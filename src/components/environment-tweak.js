AFRAME.registerComponent('environment-tweak', {
    multiple: true,
  
    init: function() {
      let env = document.querySelector('#env');
      env.setAttribute('environment', "preset: poison; active: true; fog: 0.01; dressing: hexagons; dressingScale: 2.62; groundYScale: 0;")
    },
  });