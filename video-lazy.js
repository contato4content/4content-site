/*
 * Carrega e toca os vídeos de fundo apenas enquanto estão visíveis.
 *
 * Os .dc.html são re-renderizados pelo runtime (support.js/React) a qualquer
 * momento, então este script nunca mexe no atributo `src`: um re-render
 * restauraria o valor do template e dispararia o download que queremos evitar.
 * O controle é feito só por preload="none" no HTML e play()/pause() aqui.
 */
(function () {
  'use strict';

  var MARGIN = '200px 0px';
  var adopted = 'vlz';

  function silence(v) {
    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;
    v.removeAttribute('controls');
    if (!v.hasAttribute('muted')) v.setAttribute('muted', '');
  }

  function play(v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  if (!('IntersectionObserver' in window)) {
    // Sem IO: não há como saber o que está visível, então só garante o mudo.
    document.addEventListener('DOMContentLoaded', function () {
      var all = document.querySelectorAll('video');
      for (var i = 0; i < all.length; i++) { silence(all[i]); play(all[i]); }
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var v = entries[i].target;
      if (entries[i].isIntersecting) {
        silence(v);
        play(v);
      } else if (!v.paused) {
        v.pause();
      }
    }
  }, { rootMargin: MARGIN, threshold: 0.01 });

  // O runtime monta os <video> durante o render, e o IO às vezes entrega a
  // primeira notificação com o elemento ainda sem layout — o vídeo do topo
  // ficaria parado para sempre, já que sua interseção nunca mais muda.
  // Esta verificação por geometria não depende dessa primeira entrega.
  function sync() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    var w = window.innerWidth || document.documentElement.clientWidth;
    var all = document.querySelectorAll('video');
    for (var i = 0; i < all.length; i++) {
      var v = all[i];
      var r = v.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      // O eixo horizontal é medido sem folga de propósito: no carrossel da
      // home os slides seguintes ficam encostados fora da tela, e qualquer
      // margem faria os quatro vídeos tocarem ao mesmo tempo.
      var visible = r.top < h + 200 && r.bottom > -200 && r.left < w && r.right > 0;
      if (visible && v.paused) { silence(v); play(v); }
      else if (!visible && !v.paused) v.pause();
    }
  }

  var queued = false;
  function syncSoon() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; sync(); });
  }

  function scan() {
    var all = document.querySelectorAll('video');
    for (var i = 0; i < all.length; i++) {
      var v = all[i];
      silence(v);
      if (v.dataset[adopted]) continue;
      v.dataset[adopted] = '1';
      v.loop = true;
      v.playsInline = true;
      if (!v.hasAttribute('loop')) v.setAttribute('loop', '');
      if (!v.hasAttribute('playsinline')) v.setAttribute('playsinline', '');
      io.observe(v);
    }
    syncSoon();
  }

  function start() {
    scan();
    // O runtime injeta os <video> depois do parse do head, e re-renderiza
    // ao trocar de tela — por isso observamos a árvore inteira.
    new MutationObserver(scan).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    addEventListener('scroll', syncSoon, { passive: true });
    addEventListener('resize', syncSoon, { passive: true });
    addEventListener('load', syncSoon);
    // Trocar de slide no carrossel do hero move os vídeos no eixo horizontal
    // sem gerar scroll, então é a transição que avisa quem entrou em tela.
    document.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'transform') syncSoon();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      var all = document.querySelectorAll('video');
      for (var i = 0; i < all.length; i++) all[i].pause();
    } else {
      // Sem isto os vídeos ficariam pausados ao voltar para a aba: a
      // interseção não mudou, então o observer não dispara sozinho.
      syncSoon();
    }
  });
})();
