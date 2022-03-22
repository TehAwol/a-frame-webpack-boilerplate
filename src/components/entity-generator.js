AFRAME.registerComponent('entity-generator', {
    schema: {
      mixin: {default: ''},
      num: {default: 10}
    },
  
    init: function () {
      var data = this.data;
    //   const timeout = ms => new Promise(res => setTimeout(res, ms))
      // Create entities with supplied mixin.
      for (var i = 0; i < data.num; i++) {
          setTimeout(() => {
            var entity = document.createElement('a-entity');
            entity.setAttribute('mixin', data.mixin);
            this.el.appendChild(entity);
            setTimeout(() => {
            entity.dispatchEvent(new Event('body-loaded'));
            })
          }, 2000*i);
      }
    }
  });