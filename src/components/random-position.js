AFRAME.registerComponent('random-position', {
    schema: {
      min: {default: {x: -10, y: -10, z: -10}, type: 'vec3'},
      max: {default: {x: 10, y: 10, z: 10}, type: 'vec3'}
    },
  
    update: function () {
      var data = this.data;
      var max = data.max;
      var min = data.min;
      this.el.setAttribute('position', {
        x: Math.random() * (max.x - min.x) + min.x,
        y: Math.random() * (max.y - min.y) + min.y,
        z: Math.random() * (max.z - min.z) + min.z
      });
    }
  });
  
  /**
   * Set random position within spherical bounds.
   */
  AFRAME.registerComponent('random-spherical-position', {
    schema: {
      radius: {default: 10},
      startX: {default: 0},
      lengthX: {default: 360},
      startY: {default: 0},
      lengthY: {default: 360}
    },
  
    update: function () {
      var data = this.data;
  
      var xAngle = THREE.Math.degToRad(Math.random() * data.lengthX + data.startX);
      var yAngle = THREE.Math.degToRad(Math.random() * data.lengthY + data.startY);
  
      this.el.setAttribute('position', {
        x: data.radius * Math.cos(xAngle) * Math.sin(yAngle),
        y: data.radius * Math.sin(xAngle) * Math.sin(yAngle),
        z: data.radius * Math.cos(yAngle)
      });
    }
  });
  
  /**
   * Set random rotation within bounds.
   */
  AFRAME.registerComponent('random-rotation', {
    schema: {
      min: {default: {x: 0, y: 0, z: 0}, type: 'vec3'},
      max: {default: {x: 360, y: 360, z: 360}, type: 'vec3'}
    },
  
    update: function () {
      var data = this.data;
      var max = data.max;
      var min = data.min;
      this.el.setAttribute('rotation', {
        x: Math.random() * max.x + min.x,
        y: Math.random() * max.y + min.y,
        z: Math.random() * max.z + min.z
      });
    }
  });