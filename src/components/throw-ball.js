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
    this.el.addEventListener('body-loaded', this._onEvent);
  },

  remove: function () {
    this.el.removeEventListener('body-loaded', this._onEvent);
  },

  _onEvent: function (evt) {
    console.log(42);
    // Get position vectors
    this.el.sceneEl.camera.getWorldPosition(this.vector);
    this.el.object3D.getWorldPosition(this.vector2)
    // Generate new vector and aim at camera
    this.vector2.sub(this.vector)
    this.el.object3D.lookAt(this.vector);
    this.vector2.negate();
    // Apply force scaled force to entity
    const force = new Ammo.btVector3(this.vector2.x*25, this.vector2.y*25, this.vector2.z*25 );
    const pos = new Ammo.btVector3(this.el.object3D.position);
    this.el.body.applyForce(force, pos);
    // Memory opti
    Ammo.destroy(force);
    Ammo.destroy(pos);
  }

});