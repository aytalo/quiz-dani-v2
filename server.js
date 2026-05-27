import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 8080;
const QUIZ_VARIANT = process.env.QUIZ_VARIANT || 'v2';

// ─── DB ───────────────────────────────────────────────────────────────────
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
  : null;

async function initSchema() {
  if (!pool) { console.warn('[quiz-dani-v2] sem DATABASE_URL — tracking não persistido'); return; }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_dani_visits (
      id              SERIAL PRIMARY KEY,
      session_id      TEXT UNIQUE NOT NULL,
      started_at      TIMESTAMPTZ DEFAULT NOW(),
      finished_at     TIMESTAMPTZ,
      last_question   INTEGER DEFAULT 0,
      score           INTEGER,
      cta_clicked     BOOLEAN DEFAULT false,
      cta_clicked_at  TIMESTAMPTZ,
      utm_source      TEXT,
      utm_medium      TEXT,
      utm_campaign    TEXT,
      utm_content     TEXT,
      utm_term        TEXT,
      fbclid          TEXT,
      kwai_click_id   TEXT,
      gclid           TEXT,
      referrer        TEXT,
      user_agent      TEXT,
      ip              TEXT,
      tracking        JSONB,
      variant         TEXT DEFAULT 'v1'
    );
    -- migrate-safe: adiciona coluna se já existir tabela antiga
    ALTER TABLE quiz_dani_visits ADD COLUMN IF NOT EXISTS variant TEXT DEFAULT 'v1';
    CREATE INDEX IF NOT EXISTS idx_quiz_dani_visits_started ON quiz_dani_visits(started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_quiz_dani_visits_cta ON quiz_dani_visits(cta_clicked, cta_clicked_at);
    CREATE INDEX IF NOT EXISTS idx_quiz_dani_visits_variant ON quiz_dani_visits(variant);

    CREATE TABLE IF NOT EXISTS quiz_dani_events (
      id            SERIAL PRIMARY KEY,
      session_id    TEXT NOT NULL,
      event_type    TEXT NOT NULL,
      question_idx  INTEGER,
      option_idx    INTEGER,
      option_wrong  BOOLEAN,
      payload       JSONB,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      variant       TEXT DEFAULT 'v1'
    );
    ALTER TABLE quiz_dani_events ADD COLUMN IF NOT EXISTS variant TEXT DEFAULT 'v1';
    CREATE INDEX IF NOT EXISTS idx_quiz_dani_events_session ON quiz_dani_events(session_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_quiz_dani_events_type ON quiz_dani_events(event_type, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_quiz_dani_events_variant ON quiz_dani_events(variant);
  `);
  console.log('[quiz-dani-v2] schema OK · variant=' + QUIZ_VARIANT);
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || null;
}

async function dbInsertVisit(sid, body, req) {
  if (!pool) return;
  const t = body?.tracking || {};
  await pool.query(
    `INSERT INTO quiz_dani_visits
     (session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      fbclid, kwai_click_id, gclid, referrer, user_agent, ip, tracking, variant)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (session_id) DO UPDATE
     SET tracking=COALESCE(quiz_dani_visits.tracking, $13),
         variant=COALESCE(quiz_dani_visits.variant, $14)`,
    [sid, t.utm_source, t.utm_medium, t.utm_campaign, t.utm_content, t.utm_term,
     t.fbclid, t.kwai_click_id || t.clickid, t.gclid,
     t._referrer || req.headers.referer || null,
     req.headers['user-agent'] || null, clientIp(req),
     JSON.stringify(t), QUIZ_VARIANT]
  );
}

async function dbInsertEvent(sid, ev) {
  if (!pool) return;
  await pool.query(
    `INSERT INTO quiz_dani_events (session_id, event_type, question_idx, option_idx, option_wrong, payload, variant)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [sid, ev.event_type, ev.question_idx ?? null, ev.option_idx ?? null,
     ev.option_wrong ?? null, JSON.stringify(ev.payload || {}), QUIZ_VARIANT]
  );
  if (ev.event_type === 'question_answered' && typeof ev.question_idx === 'number') {
    await pool.query(
      `UPDATE quiz_dani_visits SET last_question=$2 WHERE session_id=$1 AND ($2 > COALESCE(last_question,0))`,
      [sid, ev.question_idx + 1]
    );
  }
  if (ev.event_type === 'quiz_finished') {
    await pool.query(
      `UPDATE quiz_dani_visits SET finished_at=NOW(), score=$2 WHERE session_id=$1`,
      [sid, ev.payload?.score ?? null]
    );
  }
  if (ev.event_type === 'cta_clicked') {
    await pool.query(
      `UPDATE quiz_dani_visits SET cta_clicked=true, cta_clicked_at=NOW() WHERE session_id=$1`,
      [sid]
    );
  }
}

// ─── App ──────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '64kb' }));

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '5m',
  setHeaders: (res, p) => { if (p.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache'); },
}));

app.get('/health', (_req, res) => res.json({ ok: true, db: !!pool, variant: QUIZ_VARIANT }));

app.post('/track/visit', async (req, res) => {
  try {
    const sid = (req.body?.session_id || '').toString().slice(0, 100) || crypto.randomUUID();
    await dbInsertVisit(sid, req.body, req);
    res.json({ ok: true, session_id: sid });
  } catch (e) {
    console.error('[track/visit]', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/track/event', async (req, res) => {
  try {
    const sid = (req.body?.session_id || '').toString().slice(0, 100);
    if (!sid) return res.status(400).json({ error: 'session_id obrigatório' });
    await dbInsertEvent(sid, req.body);
    res.json({ ok: true });
  } catch (e) {
    console.error('[track/event]', e.message);
    res.status(500).json({ error: e.message });
  }
});

initSchema().then(() => {
  app.listen(PORT, () => console.log(`[quiz-dani-v2] http://localhost:${PORT}`));
}).catch(e => {
  console.error('[quiz-dani-v2] initSchema falhou:', e.message);
  app.listen(PORT, () => console.log(`[quiz-dani-v2] (sem DB) http://localhost:${PORT}`));
});
