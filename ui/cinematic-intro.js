import { openSaveTransfer } from './save-transfer.js';
import { getPreferences, decorativeMotionAllowed } from './game-preferences.js';

/** Introductory film before the interactive sectors; it does not change game state. */
export function playCinematic({ hasTeam = false, paused = false } = {}) {
  return new Promise(resolve => {
    const root = document.createElement('section');
    root.className = 'cinematic-intro';
    root.setAttribute('aria-label', 'Ao Trabalho · apresentação');
    root.innerHTML = `<header><span>PILHA+ GAME</span><span>Uma empresa. Muitas histórias.</span></header><div class="cinematic-layout"><div class="cinematic-film"><video autoplay loop playsinline preload="auto" poster="/assets/cinematic/ao-trabalho-poster.jpg" aria-label="Apresentação do universo Ao Trabalho"><source src="/assets/cinematic/ao-trabalho-intro.mp4" type="video/mp4"></video><button class="cinematic-audio" type="button" aria-label="Desativar som" aria-pressed="true"><span aria-hidden="true">🔊</span><span>Som ligado</span></button><p class="cinematic-fallback" hidden>O vídeo não pôde ser reproduzido. Você ainda pode conhecer o jogo.</p></div><div class="cinematic-copy"><p class="cinematic-eyebrow">Pessoas bem, organizações fortes.</p><h1>Ao Trabalho</h1><p>Conheça a empresa, forme sua equipe e transforme o ambiente de trabalho.</p><button class="cinematic-start" type="button">Conhecer o jogo <span aria-hidden="true">→</span></button><small>Uma experiência de gestão, cuidado e escolhas.</small></div></div>`;

    const app = document.getElementById('continuous-app');
    const wasInert = app?.inert;
    if (app) app.inert = true;

    root.querySelector('header span').outerHTML = '<button class="cinematic-home" data-game-home aria-label="Voltar à tela inicial"><img src="/assets/branding/pilha-logo-puro.png" alt="">PILHA+ GAME</button>';
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.dataset.gameSettings = '';
    settings.textContent = 'Configurações';
    root.querySelector('header').append(settings);

    const backup = document.createElement('button');
    backup.type = 'button';
    backup.className = 'cinematic-import';
    backup.textContent = 'Importar progresso';
    backup.onclick = () => openSaveTransfer();
    root.querySelector('.cinematic-copy small').after(backup);

    if (hasTeam) {
      root.classList.add('cinematic-has-save');
      const resume = document.createElement('button');
      resume.type = 'button';
      resume.className = 'cinematic-resume';
      resume.textContent = 'Continuar partida →';
      root.querySelector('.cinematic-start').before(resume);
      root.querySelector('.cinematic-copy small').textContent = paused
        ? 'Dupla e progresso salvos. A empresa está pausada.'
        : 'Dupla e progresso salvos. O relógio continua; use Pausar jogo para interrompê-lo.';
    }

    document.body.append(root);
    const video = root.querySelector('video');
    const button = root.querySelector('.cinematic-start');
    const audioButton = root.querySelector('.cinematic-audio');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const allowed = () => decorativeMotionAllowed(getPreferences(), motion.matches);
    let userPaused = false;
    let soundEnabled = true;
    let done = false;

    const updateAudioButton = (blocked = false) => {
      audioButton.setAttribute('aria-pressed', String(soundEnabled));
      audioButton.setAttribute('aria-label', soundEnabled ? 'Desativar som' : 'Ativar som');
      audioButton.innerHTML = `<span aria-hidden="true">${soundEnabled ? '🔊' : '🔇'}</span><span>${soundEnabled ? 'Som ligado' : blocked ? 'Ativar som' : 'Som desligado'}</span>`;
    };

    const startVideo = async () => {
      if (done || document.hidden || !allowed()) return;
      video.muted = !soundEnabled;
      try {
        await video.play();
        updateAudioButton();
      } catch {
        if (soundEnabled) {
          soundEnabled = false;
          video.muted = true;
          updateAudioButton(true);
          try {
            await video.play();
          } catch {
            root.querySelector('.cinematic-fallback').hidden = false;
          }
        } else {
          root.querySelector('.cinematic-fallback').hidden = false;
        }
      }
    };

    const visibility = () => {
      if (document.hidden || !allowed()) {
        video.pause();
      } else if (!userPaused) {
        startVideo();
      }
    };

    video.addEventListener('error', () => { root.querySelector('.cinematic-fallback').hidden = false; });
    video.addEventListener('pause', () => {
      if (!document.hidden && allowed()) userPaused = true;
    });
    video.addEventListener('play', () => { userPaused = false; });
    audioButton.addEventListener('click', async () => {
      soundEnabled = !soundEnabled;
      video.muted = !soundEnabled;
      updateAudioButton();
      if (soundEnabled) {
        try {
          await video.play();
        } catch {
          soundEnabled = false;
          video.muted = true;
          updateAudioButton(true);
        }
      }
    });

    if (!allowed()) {
      video.autoplay = false;
      video.pause();
      soundEnabled = false;
      video.muted = true;
      updateAudioButton();
    } else {
      startVideo();
    }

    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pilha:preferences', visibility);

    const finish = choice => {
      if (done) return;
      done = true;
      button.disabled = true;
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pilha:preferences', visibility);
      video.pause();
      video.removeAttribute('src');
      video.querySelector('source')?.remove();
      video.load();
      root.remove();
      if (app) app.inert = wasInert;
      resolve(choice);
    };

    button.addEventListener('click', () => finish('explore'), { once: true });
    const resume = root.querySelector('.cinematic-resume');
    resume?.addEventListener('click', () => finish('resume'), { once: true });
    (resume || button).focus({ preventScroll: true });
  });
}
