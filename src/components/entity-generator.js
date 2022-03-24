AFRAME.registerComponent('entity-generator', {
  multiple: true,

  schema: {
    mixin: {
      default: ''
    },
    num: {
      default: 10
    },
    event: {
      type: "string",
      default: "play-mode-easy"
    },
    frequency: {
      type: "number",
      default: 1
    }
  },

  init: function () {
    this._onEvent = this._onEvent.bind(this);
    this.el.addEventListener(this.data.event, this._onEvent);
  },

  remove: function () {
    this.el.removeEventListener(this.data.event, this._onEvent);
  },

  _onEvent: function (evt) {
    let paras = document.getElementsByClassName('menu-item');
    let audio = document.getElementById('ball-spawn');

    while (paras[0]) {
      paras[0].parentNode.removeChild(paras[0]);
    }
    let data = this.data;
    // Create entities with supplied mixin and offsets spawn with frequency
    for (let i = 0; i < data.num; i++) {
      setTimeout(() => {
        let entity = document.createElement('a-entity');
        entity.setAttribute('mixin', this.data.mixin);
        console.log(entity.object3D.scale)
        this.el.appendChild(entity);
        audio.play();
        setTimeout(() => {
          entity.dispatchEvent(new Event('throw-ball'));
          audio.play();
        }, 1000)
      }, 2000 * i * this.data.frequency);
    }
  }
});