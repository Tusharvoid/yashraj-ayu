(function(){
  'use strict';
  // Sticky header state
  var top = document.getElementById('top');
  function onScroll(){ top.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Drawer
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var drawerClose = document.getElementById('drawerClose');

  function setDrawer(open){
    var wasOpen = drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) drawerClose.focus();
    else if (wasOpen) burger.focus();
  }
  burger.addEventListener('click', function(){ setDrawer(true); });
  drawerClose.addEventListener('click', function(){ setDrawer(false); });
  drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setDrawer(false); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setDrawer(false); });
  window.addEventListener('resize', function(){ if (window.innerWidth > 1100 && drawer.classList.contains('open')) setDrawer(false); });

  // The page navigation is marked active in the HTML.
  // Keep links to sections of the former single-page site working.
  var legacyRoutes = {
    therapies: 'therapies.html', panchakarma: 'panchakarma.html',
    gallery: 'gallery.html', testimonials: 'testimonials.html',
    visit: 'visit.html', doctors: 'doctors.html'
  };
  function followLegacyLink(){
    var file = location.pathname.split('/').pop();
    var destination = legacyRoutes[location.hash.slice(1)];
    if ((!file || file === 'index.html' || file === 'ayurveda') && destination) {
      location.replace(new URL(destination, document.baseURI).href);
    }
  }
  followLegacyLink();
  window.addEventListener('hashchange', followLegacyLink);

  // Keep keyboard focus inside the open mobile menu.
  drawer.addEventListener('keydown', function(event){
    if (event.key !== 'Tab') return;
    var items = drawer.querySelectorAll('button, a[href]');
    var first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first){
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last){
      event.preventDefault(); first.focus();
    }
  });

  // Gentle procedural ambience. Audible autoplay is attempted, then retried
  // on the first visitor interaction when browser autoplay policy blocks it.
  var soundToggle = document.getElementById('soundToggle');
  var AudioEngine = window.AudioContext || window.webkitAudioContext;
  var audioContext = null;
  var masterGain = null;
  var soundWanted = true;
  try { soundWanted = sessionStorage.getItem('ayu-sound') !== 'off'; } catch (error) {}
  function rememberSound(){
    try { sessionStorage.setItem('ayu-sound', soundWanted ? 'on' : 'off'); } catch (error) {}
  }

  function buildAmbience(){
    if (!AudioEngine || audioContext) return;
    audioContext = new AudioEngine();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.032;
    masterGain.connect(audioContext.destination);

    // Soft, filtered brown-noise bed, similar to distant water or wind.
    var seconds = 4;
    var buffer = audioContext.createBuffer(1, audioContext.sampleRate * seconds, audioContext.sampleRate);
    var data = buffer.getChannelData(0);
    var last = 0;
    for (var i = 0; i < data.length; i++){
      var white = Math.random() * 2 - 1;
      last = (last + .018 * white) / 1.018;
      data[i] = last * 2.4;
    }
    var noise = audioContext.createBufferSource();
    var lowpass = audioContext.createBiquadFilter();
    var noiseGain = audioContext.createGain();
    noise.buffer = buffer;
    noise.loop = true;
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 520;
    noiseGain.gain.value = .34;
    noise.connect(lowpass).connect(noiseGain).connect(masterGain);
    noise.start();

    // Two quiet sine layers create a warm, slowly breathing drone.
    [130.81,196].forEach(function(frequency,index){
      var tone = audioContext.createOscillator();
      var toneGain = audioContext.createGain();
      var lfo = audioContext.createOscillator();
      var lfoGain = audioContext.createGain();
      tone.type = 'sine';
      tone.frequency.value = frequency;
      toneGain.gain.value = index ? .055 : .075;
      lfo.frequency.value = index ? .065 : .05;
      lfoGain.gain.value = index ? .022 : .028;
      lfo.connect(lfoGain).connect(toneGain.gain);
      tone.connect(toneGain).connect(masterGain);
      tone.start();
      lfo.start();
    });
  }

  function updateSoundButton(active){
    soundToggle.setAttribute('aria-pressed', String(active));
    soundToggle.setAttribute('aria-label', active ? 'Mute ambient sound' : 'Play ambient sound');
  }

  function playAmbience(){
    if (!AudioEngine || !soundWanted) return;
    buildAmbience();
    var resumed = audioContext.resume();
    if (resumed && resumed.then){
      resumed.then(function(){ updateSoundButton(audioContext.state === 'running'); }).catch(function(){ updateSoundButton(false); });
    } else {
      updateSoundButton(audioContext.state === 'running');
    }
  }

  function pauseAmbience(){
    soundWanted = false;
    rememberSound();
    if (audioContext) audioContext.suspend();
    updateSoundButton(false);
  }

  var testimonialVideos = document.querySelectorAll('.testimonial-video');
  testimonialVideos.forEach(function(video){
    var playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'video-play';
    playButton.setAttribute('aria-label', video.getAttribute('aria-label'));
    playButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l14-8z"/></svg><span>Play story</span>';
    video.parentNode.appendChild(playButton);
    video.controls = false;
    playButton.addEventListener('click', function(){
      video.controls = true;
      playButton.hidden = true;
      video.focus();
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function(){
        playButton.hidden = false;
        playButton.focus();
      });
    });
    video.addEventListener('play', function(){
      video.controls = true;
      playButton.hidden = true;
      pauseAmbience();
      testimonialVideos.forEach(function(other){ if (other !== video) other.pause(); });
    });
  });

  soundToggle.addEventListener('click', function(event){
    event.stopPropagation();
    if (audioContext && audioContext.state === 'running') pauseAmbience();
    else { soundWanted = true; rememberSound(); playAmbience(); }
  });

  function unlockSound(event){
    if (event.target && event.target.closest && event.target.closest('#soundToggle')) return;
    if (soundWanted) playAmbience();
  }
  document.addEventListener('pointerdown', unlockSound, {once:true,passive:true});
  document.addEventListener('keydown', unlockSound, {once:true});
  window.addEventListener('load', function(){ window.setTimeout(playAmbience, 700); });
  document.addEventListener('visibilitychange', function(){
    if (!audioContext) return;
    if (document.hidden) audioContext.suspend();
    else if (soundWanted) playAmbience();
  });

  // Year
  document.querySelectorAll('[data-y]').forEach(function(el){ el.textContent = new Date().getFullYear(); });
})();
