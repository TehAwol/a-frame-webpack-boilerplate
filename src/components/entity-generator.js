AFRAME.registerComponent('entity-generator', {
  multiple: true,

  schema: {
    mixin: { default: '' },
    num: { default: 10 },
    event: { type: "string", default: "play-mode-easy" },
    frequency: {type: "number", default: 1}
  },

  init: function () {
    this._onEvent = this._onEvent.bind(this);
    this.el.addEventListener(this.data.event, this._onEvent);
  },

  remove: function () {
    this.el.removeEventListener(this.data.event, this._onEvent);
  },

  _onEvent: function (evt) {
    var paras = document.getElementsByClassName('menu-item');

    while (paras[0]) {
      paras[0].parentNode.removeChild(paras[0]);
    }
    var data = this.data;
    // Create entities with supplied mixin.
    for (var i = 0; i < data.num; i++) {
      setTimeout(() => {
        var entity = document.createElement('a-entity');
        entity.setAttribute('mixin', this.data.mixin);
        this.el.appendChild(entity);
        entity.emit("endanim", null, false);
        setTimeout(() => {
          entity.dispatchEvent(new Event('throw-ball'));
        })
      }, 2000 * i * this.data.frequency);
    }
  }
});