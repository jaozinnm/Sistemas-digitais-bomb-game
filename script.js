/* script.js
   - controla a barra de tempo, start/reset
   - adiciona efeitos visuais quando faltar pouco tempo
*/

(() => {
  // CONFIGURÁVEL: total em segundos
  const TOTAL_SECONDS = 60;

  // elementos
  const timerBar = document.getElementById('timerBar');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const downloadBtn = document.getElementById('downloadZip');
  const hero = document.querySelector('.hero');

  // estado
  let remaining = TOTAL_SECONDS;
  let intervalId = null;
  let running = false;

  // formata porcentagem para largura da barra
  function updateBar() {
    const pct = Math.max(0, (remaining / TOTAL_SECONDS) * 100);
    timerBar.style.width = pct + '%';
  }

  // chama quando o tempo chega a 0
  function explode() {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    hero.classList.add('danger');
    timerBar.classList.add('blink');
    // alerta visual + som (som é opcional -- só beep curto)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 220;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.frequency.value = 90; }, 200);
      setTimeout(() => { o.stop(); ctx.close(); }, 1800);
    } catch (e) {}
    // visuais: piscar o título
    const title = document.getElementById('projectTitle');
    let flashes = 0;
    const tFlash = setInterval(() => {
      title.style.visibility = (title.style.visibility === 'hidden') ? 'visible' : 'hidden';
      flashes++;
      if (flashes > 8) {
        clearInterval(tFlash);
        title.style.visibility = 'visible';
      }
    }, 160);
  }

  function tick() {
    if (!running) return;
    if (remaining <= 0) {
      explode();
      return;
    }
    remaining--;
    updateBar();

    // quando faltar 10s, liga o modo perigo visual
    if (remaining <= 10) {
      hero.classList.add('danger');
      timerBar.classList.add('blink');
      // destacar botão download (pulsar forte)
      downloadBtn.style.transform = 'scale(1.06)';
      downloadBtn.style.boxShadow = '0 8px 28px rgba(255,80,60,0.28)';
    } else {
      hero.classList.remove('danger');
      timerBar.classList.remove('blink');
      downloadBtn.style.transform = '';
      downloadBtn.style.boxShadow = '';
    }
  }

  function start() {
    if (running) return;
    running = true;
    // se já acabou, reseta antes
    if (remaining <= 0) remaining = TOTAL_SECONDS;
    updateBar();
    intervalId = setInterval(tick, 1000);
  }

  function reset() {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    remaining = TOTAL_SECONDS;
    updateBar();
    hero.classList.remove('danger');
    timerBar.classList.remove('blink');
    const title = document.getElementById('projectTitle');
    title.style.visibility = 'visible';
    downloadBtn.style.transform = '';
    downloadBtn.style.boxShadow = '';
  }

  // connect events
  startBtn.addEventListener('click', start);
  resetBtn.addEventListener('click', reset);

  // inicializa barra cheia
  remaining = TOTAL_SECONDS;
  updateBar();

  // acessibilidade: tecla Space inicia / Esc reseta
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!running) start(); else reset();
    }
    if (e.code === 'Escape') {
      reset();
    }
  });
})();

// FEEDBACK VISUAL IMEDIATO
startBtn.addEventListener("click", () => {
  startBtn.textContent = "CONTANDO...";
  startBtn.style.background = "#ff7b6b";
});

resetBtn.addEventListener("click", () => {
  startBtn.textContent = "Start Bomba";
  startBtn.style.background = "";
});
