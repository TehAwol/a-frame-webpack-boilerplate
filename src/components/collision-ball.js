AFRAME.registerComponent('collision-ball', {
    multiple: true,
  
    init: function() {
      this._onEvent = this._onEvent.bind(this);
      this.el.addEventListener('collidestart', this._onEvent);
    },
  
    remove: function() {
      this.el.removeEventListener(this.data.event, this._onEvent);
    },
  
    _onEvent: function(evt) {
        let target = evt.detail.targetEl.id
        if (target === 'sword') {
            this.el.parentNode.removeChild(this.el);
            console.log('You got a hit')
            // Add target hit logic
        }
    }
  
  });