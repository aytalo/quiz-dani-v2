// ─── Conteúdo do quiz ─────────────────────────────────────────────────────
// Estratégia: cada pergunta diagnostica um erro comum na roleta e logo em
// seguida o follow-up mostra exatamente como o APP da Dani resolve esse erro.
// A pessoa termina o quiz já tendo visto 5 razões concretas pra querer o app.
const QUIZ = [
  {
    intro: [
      'Oi! Eu sou a *Dani* 🎡 — em 30 segundos eu descubro se você queima banca na roleta no feeling ou se já tem cabeça de estratégia. Passando, libero meu *APP* + *FICHAS DOURADAS* pra você começar a jogar sem usar seu dinheiro. 🪙',
    ],
    question: '*1/5 — Me conta:* quando você senta pra jogar roleta, o que você faz ANTES de apostar a primeira ficha?',
    options: [
      { text: 'Aposto direto, confio no meu feeling 🎲', wrong: true },
      { text: 'Copio a estratégia que vi alguém usando 👀', wrong: true },
      { text: 'Observo algumas rodadas antes de entrar 🧠', wrong: false },
      { text: 'Depende do meu humor no momento 🌀', wrong: true },
    ],
    after_right: [
      'Isso já te coloca na frente de uns 80% da galera. 👏',
      'Mas tem um detalhe: você observa 3, 4 rodadas no olho — meu app analisa as **últimas 30 rodadas em segundos**, identifica quais colunas, dúzias e cores estão "aquecidas" e te diz exatamente onde apostar.',
      'O que você faz no olho, ele faz com matemática. E não erra por cansaço.',
    ],
    after_wrong: [
      'Hmm… é assim que a maioria queima a banca. 😬',
      'Olha o que meu app faz: analisa as **últimas 30 rodadas em segundos**, identifica padrão de colunas, dúzias e cores — e te avisa se é hora de entrar ou esperar.',
      '*Feeling vira matemática.* Não tem mais achismo.',
    ],
  },
  {
    question: '*2/5 — Imagina:* você perdeu 3 apostas seguidas na roleta. Qual sua reação REAL?',
    options: [
      { text: 'Dobro a aposta pra recuperar rápido 🔥', wrong: true },
      { text: 'Continuo apostando o mesmo valor 💸', wrong: true },
      { text: 'Fico nervosa mas não consigo parar 😤', wrong: true },
      { text: 'Paro, respiro e redefino meu limite 🧘', wrong: false },
    ],
    after_right: [
      'Você tem cabeça fria — isso é OURO. 💛',
      'Mas no quente, **todo mundo** vacila. É aí que entra meu app: você define o limite de perda UMA VEZ e ele **trava sozinho** quando você passa.',
      'Você nem precisa ter disciplina na hora H — o app te dá.',
    ],
    after_wrong: [
      'Isso é o *tilt*, e ele destrói banca em minutos. 😬',
      'É exatamente o que meu app resolve: você define "perdi X, parei" — e ele **TRAVA SOZINHO**. Você não consegue furar nem se quisesse.',
      'Não depende mais da sua cabeça no quente. Depende do app.',
    ],
  },
  {
    question: '*3/5 — Estratégia:* como você decide em quais apostas colocar suas fichas? (número cheio, dúzia, cor, coluna…)',
    options: [
      { text: 'No feeling do momento ✨', wrong: true },
      { text: 'Sempre aposto nas mesmas opções 🎯', wrong: true },
      { text: 'Baseado no padrão das últimas rodadas 📊', wrong: false },
      { text: 'Espalho em vários lugares sem critério 😅', wrong: true },
    ],
    after_right: [
      'Caminho certo! 📈 Mas você calcula isso manualmente.',
      'Meu app **te diz a aposta exata** rodada por rodada. Não é "sempre vermelho" — é cálculo dinâmico: se as últimas vieram preto, ele te avisa pra cobrir vermelho; se uma dúzia resfriou, ele te direciona pra ela.',
      '*Cada rodada tem a aposta certa, e ele te entrega na tela.*',
    ],
    after_wrong: [
      'É aí que mora o vazamento. 🎡',
      'Apostar sempre igual (ou no feeling) faz você perder as sequências boas E levar prejuízo nas ruins.',
      'Meu app calcula a **aposta ideal pra CADA rodada**, com base no padrão histórico da mesa. Você só lê o sinal e aposta.',
    ],
  },
  {
    question: '*4/5 —* Você sabe identificar quando uma mesa está "fria" e deveria trocar ou pausar?',
    options: [
      { text: 'Não, fico na mesma mesa independente 🤷', wrong: true },
      { text: 'Tenho uma intuição mas não sei ao certo 🤔', wrong: true },
      { text: 'Sim, leio o histórico e troco quando necessário 🎯', wrong: false },
      { text: 'Nunca pensei que isso importasse 😅', wrong: true },
    ],
    after_right: [
      'Você joga *com* a mesa. A maioria joga CONTRA ela. 💪',
      'Só falta automação: você precisa ficar olhando pra perceber isso. Meu app faz isso por você.',
      'Ele **monitora a temperatura da mesa em tempo real** e te avisa quando é hora de trocar ou pausar. Você entra só em mesa quente.',
    ],
    after_wrong: [
      'Jogar em mesa fria é jogar no difícil com a mão no bolso. 😬',
      'Meu app **monitora a mesa em tempo real** e te avisa quando ela esfria. Você só continua apostando enquanto o app estiver verde.',
      'É como ter alguém analisando a mesa pra você 24h.',
    ],
  },
  {
    question: '*5/5 — Última:* você tem meta de lucro e perda máxima por sessão? E *respeita*?',
    options: [
      { text: 'Jogo até cansar ou acabar o saldo 😴', wrong: true },
      { text: 'Tenho, mas quase nunca respeito 😅', wrong: true },
      { text: 'Sim, e paro quando bato qualquer uma 🛑', wrong: false },
      { text: 'Nunca parei pra pensar nisso 🤷', wrong: true },
    ],
    after_right: [
      'Você é a exceção. 🏆 De verdade.',
      'Meu app só **automatiza** o que você já faz: define meta de ganho e meta de perda, e ele **te trava sozinho** quando bate qualquer uma.',
      'Pra você é só uma camada a mais de segurança — pra 90% da galera, é a peça que tava faltando.',
    ],
    after_wrong: [
      'Esse é o erro que mata banca de verdade. 😬',
      'Sem meta = sem fim. Todo dia você ganha, gosta da sensação e devolve tudo.',
      'No meu app você define meta de ganho e perda — e ele **PARA SOZINHO** quando bate. Sua banca cresce **todo dia que você joga**, mesmo nos dias ruins.',
    ],
  },
];

// ─── Tracking client → backend ────────────────────────────────────────────
function getOrCreateSessionId() {
  let sid = localStorage.getItem('quiz_sid');
  if (!sid) {
    sid = (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
    localStorage.setItem('quiz_sid', sid);
  }
  return sid;
}
const SESSION_ID = getOrCreateSessionId();

function track(eventType, extra = {}) {
  const body = { session_id: SESSION_ID, event_type: eventType, ...extra };
  const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
  if (navigator.sendBeacon && navigator.sendBeacon('/track/event', blob)) return;
  fetch('/track/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

// Visit (1x)
(function trackVisit() {
  const tracking = window.__TRACKING__ || JSON.parse(sessionStorage.getItem('tracking') || '{}');
  fetch('/track/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: SESSION_ID, tracking }),
    keepalive: true,
  }).catch(() => {});
  track('quiz_started');
})();

// ─── Helpers ──────────────────────────────────────────────────────────────
const chat = document.getElementById('chat');
const status = document.getElementById('contactStatus');
const inputText = document.getElementById('inputText');

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

document.getElementById('statusTime').textContent = nowHHMM();

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function scrollChat() {
  requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
}

function setTyping(on) {
  status.textContent = on ? 'digitando…' : 'online';
  status.style.opacity = on ? 1 : 0.85;
}

async function showTyping(ms = 1100) {
  setTyping(true);
  const el = document.createElement('div');
  el.className = 'typing';
  el.innerHTML = '<span></span><span></span><span></span>';
  chat.appendChild(el);
  scrollChat();
  await sleep(ms);
  el.remove();
  setTyping(false);
}

function fmt(text) {
  return text.replace(/\*(.+?)\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
}

async function bubbleOther(text, typingMs = 1000) {
  await showTyping(typingMs);
  const b = document.createElement('div');
  b.className = 'bubble other';
  b.innerHTML = `<div class="text">${fmt(text)}</div><div class="meta">${nowHHMM()}</div>`;
  chat.appendChild(b);
  scrollChat();
  await sleep(180);
}

function bubbleMe(text) {
  const b = document.createElement('div');
  b.className = 'bubble me';
  b.innerHTML = `<div class="text">${fmt(text)}</div><div class="meta">${nowHHMM()} <span class="ticks">✓✓</span></div>`;
  chat.appendChild(b);
  scrollChat();
}

async function bubbleVideo(src, captionHtml = '', typingMs = 1200) {
  await showTyping(typingMs);
  const b = document.createElement('div');
  b.className = 'bubble other video';
  b.innerHTML =
    `<div class="video-wrap">` +
      `<video src="${src}" autoplay muted playsinline loop preload="metadata" ` +
      `disablepictureinpicture disableremoteplayback x-webkit-airplay="deny" ` +
      `controlslist="nodownload noplaybackrate nofullscreen noremoteplayback"></video>` +
      `<div class="video-tap" role="button" aria-label="tocar com som">` +
        `<div class="video-tap-prompt">` +
          `<span class="video-tap-icon">▶</span>` +
          `<span class="video-tap-label">Toque pra ouvir</span>` +
        `</div>` +
      `</div>` +
    `</div>` +
    (captionHtml ? `<div class="text caption">${captionHtml}</div>` : '') +
    `<div class="meta">${nowHHMM()}</div>`;
  chat.appendChild(b);
  const videoEl = b.querySelector('video');
  const tapEl = b.querySelector('.video-tap');
  // defensivo: garante que nenhum atributo "controls" sobreviva (Chrome mobile
  // às vezes injeta controles overlay mesmo sem o attr — mantemos removido)
  videoEl.removeAttribute('controls');
  videoEl.controls = false;
  // tenta autoplay mudo (sempre permitido)
  videoEl.play().catch(() => {});
  let unmuted = false;
  const unmuteNow = async () => {
    if (unmuted) return true;
    try {
      videoEl.muted = false;
      videoEl.volume = 1;
      videoEl.currentTime = 0;
      await videoEl.play();
      unmuted = true;
      tapEl.classList.add('playing');
      return true;
    } catch (_) {
      videoEl.muted = true;
      try { await videoEl.play(); } catch (_) {}
      return false;
    }
  };
  // tenta autoplay com som — alguns navegadores permitem depois que o usuário
  // já interagiu com a página (cliques nas opções do quiz contam)
  unmuteNow();
  // overlay SEMPRE captura cliques no vídeo — depois de iniciar com som,
  // o overlay vira transparente mas continua interceptando toques pra
  // toggle pause/play, evitando que o player nativo do navegador apareça
  tapEl.addEventListener('click', async () => {
    if (!unmuted) {
      // garante que volta ao começo e inicia com som no toque
      videoEl.muted = false;
      videoEl.volume = 1;
      videoEl.currentTime = 0;
      try { await videoEl.play(); } catch (_) {}
      unmuted = true;
      tapEl.classList.add('playing');
      return;
    }
    if (videoEl.paused) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  });
  // re-garante que controles não voltem se algum evento do navegador tentar
  ['play', 'pause', 'loadeddata', 'loadedmetadata'].forEach(evt => {
    videoEl.addEventListener(evt, () => {
      if (videoEl.hasAttribute('controls')) videoEl.removeAttribute('controls');
      videoEl.controls = false;
    });
  });
  scrollChat();
  await sleep(220);
}

function renderOptions(options, onPick) {
  const wrap = document.createElement('div');
  wrap.className = 'options';
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = fmt(opt.text);
    btn.addEventListener('click', () => {
      [...wrap.children].forEach(c => c.classList.add('disabled'));
      btn.classList.add('picked');
      onPick(idx, opt);
    });
    wrap.appendChild(btn);
  });
  chat.appendChild(wrap);
  scrollChat();
}

// ─── Fluxo do quiz ───────────────────────────────────────────────────────
let erros = 0;
let qIdx = 0;

async function ask(q) {
  if (q.intro) {
    for (const line of q.intro) await bubbleOther(line, 600);
    await sleep(150);
  }
  await bubbleOther(q.question, 900);
  await sleep(120);

  await new Promise(resolve => {
    renderOptions(q.options, async (idx, opt) => {
      if (opt.wrong) erros++;
      track('question_answered', {
        question_idx: qIdx, option_idx: idx, option_wrong: !!opt.wrong,
        payload: { option_text: opt.text, total_erros: erros },
      });
      bubbleMe(opt.text);
      await sleep(420);
      const followups = opt.wrong ? q.after_wrong : q.after_right;
      for (const f of (followups || [])) await bubbleOther(f, 900);
      resolve();
    });
  });
}

function buildCtaUrl() {
  const base = 'https://rainhadaroleta.online/auth';
  const tracking = window.__TRACKING__ || JSON.parse(sessionStorage.getItem('tracking') || '{}');
  const u = new URL(base);
  for (const [k, v] of Object.entries(tracking)) {
    if (k.startsWith('_')) continue;
    if (v != null && v !== '') u.searchParams.set(k, v);
  }
  u.searchParams.set('utm_source', tracking.utm_source || 'quiz-dani');
  u.searchParams.set('utm_medium', tracking.utm_medium || 'quiz');
  u.searchParams.set('utm_campaign', tracking.utm_campaign || 'roleta-5-erros');
  u.searchParams.set('quiz_score', String(erros));
  u.searchParams.set('quiz_sid', SESSION_ID);
  return u.toString();
}

async function finalResult() {
  await sleep(300);
  await bubbleOther('Pronto, terminei de analisar 🧠', 1100);
  await sleep(200);

  if (erros === 0) {
    await bubbleOther('Cara… **0 erros**. 🏆 Você joga no nível certo.', 1200);
    await bubbleOther('Mas até quem joga certo deixa dinheiro na mesa por não ter automação. É aí que meu app vira o jogo.', 1300);
  } else if (erros <= 2) {
    await bubbleOther(`Você marcou **${erros} dos 5 erros**. 😬 Tá no caminho — mas ainda tá deixando dinheiro escapar toda sessão.`, 1400);
  } else {
    await bubbleOther(`Você marcou **${erros} dos 5 erros mais caros da roleta**. 😬`, 1300);
    await bubbleOther('Não é sorte que te falta. É *método e automação*.', 1100);
  }

  await sleep(300);
  await bubbleOther('Olha, vou te resumir o que meu app faz pra resolver TUDO que a gente acabou de ver 👇', 1400);
  await sleep(200);
  await bubbleOther(
    '✅ Analisa 30 rodadas em segundos → diz **onde apostar**\n' +
    '✅ Stop-loss automático → mata o tilt\n' +
    '✅ Sinal certo **rodada por rodada**\n' +
    '✅ Detecta mesa fria → te avisa pra **trocar ou pausar**\n' +
    '✅ Trava sozinho quando bate sua meta',
    1500
  );
  await sleep(250);
  await bubbleOther('Não é grupo de dicas. Não é sala de sinal no WhatsApp. É um *app* trabalhando pra você em tempo real. 📱', 1400);

  // ─── 🎁 Liberação de acesso + fichas douradas ─────────────────────────
  await sleep(400);
  await bubbleOther('🎉 *PARABÉNS!* Você respondeu até o final — então tá tudo liberado pra você AGORA: 👇', 1500);
  await sleep(200);
  await bubbleOther(
    '✅ Acesso ao **APP da Dani** liberado\n' +
    '🪙 **FICHAS DOURADAS** pra você jogar sem usar o seu dinheiro\n' +
    '⏰ *Só vale hoje* — depois disso o cadastro entra na fila normal e as fichas não vão mais junto.',
    1600
  );
  await sleep(250);
  await bubbleOther('Gravei esse vídeo rapidinho te mostrando *exatamente* como fazer o cadastro e resgatar as fichas — assiste agora 👇', 1300);
  await sleep(150);
  await bubbleVideo('/fichas-douradas.mp4', '🎥 Como criar conta + resgatar as fichas douradas', 900);
  await sleep(300);
  await bubbleOther('⚠️ *Atenção:* as fichas douradas só caem pra quem se cadastrar HOJE pelo botão aqui embaixo. Não deixa pra depois — toca aí 👇', 1500);

  await sleep(300);
  await showTyping(500);
  track('quiz_finished', { payload: { score: erros } });

  const cta = document.createElement('a');
  cta.className = 'cta-btn';
  cta.href = buildCtaUrl();
  cta.target = '_blank';
  cta.rel = 'noopener';
  cta.innerHTML = '🪙 Resgatar fichas douradas + acessar app →';
  cta.addEventListener('click', () => {
    cta.href = buildCtaUrl();
    track('cta_clicked', { payload: { score: erros, href: cta.href } });
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'quiz-dani-cta', value: erros });
  });
  chat.appendChild(cta);
  scrollChat();
  inputText.textContent = 'Aperta o botão acima 👆';
}

async function run() {
  for (qIdx = 0; qIdx < QUIZ.length; qIdx++) {
    await ask(QUIZ[qIdx]);
    await sleep(380);
  }
  await finalResult();
}

// Start
window.addEventListener('load', () => setTimeout(run, 500));
