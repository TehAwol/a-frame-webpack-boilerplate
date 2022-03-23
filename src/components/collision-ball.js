AFRAME.registerComponent('collision-ball', {
  multiple: true,
  schema: {
    target: { type: "selector", default: "#sword" },
    audio: { type: "selector", default: "#ball-hit" },
    emitEvent: { type: "string", default: "play-mode-easy" },
    emitTarget: { type: "selector", default: "#scene"}
  },

  init: function () {
    this._onEvent = this._onEvent.bind(this);
    this.el.addEventListener('collidestart', this._onEvent);
  },

  remove: function () {
    this.el.removeEventListener(this.data.event, this._onEvent);
  },

  _onEvent: function (evt) {
    let target = evt.detail.targetEl;
    if (target == this.data.target) {
      this.data.emitTarget.emit(this.data.emitEvent, null, false);
      this.el.emit("startanim", null, false);
      target.emit("triggerHaptic", null, false);
      if (this.data.audio) this.data.audio.play();
      setTimeout(() => {
        this.el.remove()
      }, 500);
    }
  }

});