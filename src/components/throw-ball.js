AFRAME.registerComponent('throw-ball', {
  multiple: true,

  schema: {
    target: {
      type: 'selector',
      default: '#camera-rig'
    },
  },

  init: function () {
    this.vector = new THREE.Vector3();
    this.vector2 = new THREE.Vector3();
    this._onEvent = this._onEvent.bind(this);
    this.el.addEventListener('throw-ball', this._onEvent);
  },

  remove: function () {
    this.el.removeEventListener('throw-ball', this._onEvent);
  },

  _onEvent: function (evt) {
    // Get position vectors
    this.el.sceneEl.camera.getWorldPosition(this.vector);
    this.el.object3D.getWorldPosition(this.vector2)
    // Generate new vector and aim at camera
    this.vector2.sub(this.vector)
    this.el.object3D.lookAt(this.vector);
    this.vector2.negate();
    // Freeze object until throw
    // Apply randomised scaled force to ball
    let intensity = (Math.random() * 15) + 25;
    const force = new Ammo.btVector3(this.vector2.x* intensity, this.vector2.y, this.vector2.z * intensity );
    const pos = new Ammo.btVector3(this.el.object3D.position);
    this.el.body.applyForce(force, pos);
    // Memory optimisation
    Ammo.destroy(force);
    Ammo.destroy(pos);
  }

});