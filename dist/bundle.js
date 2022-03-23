/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/collision-ball.js":
/*!******************************************!*\
  !*** ./src/components/collision-ball.js ***!
  \******************************************/
/***/ (() => {

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

/***/ }),

/***/ "./src/components/emit-when-near.js":
/*!******************************************!*\
  !*** ./src/components/emit-when-near.js ***!
  \******************************************/
/***/ (() => {

AFRAME.registerComponent('emit-when-near', {
  schema: {
    target: {type: 'selector', default: '#camera-rig'},
    distance: {type: 'number', default: 1},
    event: {type: 'string', default: 'click'},
    eventFar: {type: 'string', default: 'unclick'},
    throttle: {type: 'number', default: 100},
  },
  init: function () {
    this.tick = AFRAME.utils.throttleTick(this.checkDist, this.data.throttle, this);
    this.emiting = false;
  },
  checkDist: function () {
    let myPos = new THREE.Vector3(0, 0, 0);
    let targetPos = new THREE.Vector3(0, 0, 0);
    this.el.object3D.getWorldPosition(myPos);
    this.data.target.object3D.getWorldPosition(targetPos);
    const distanceTo = myPos.distanceTo(targetPos);
    if (distanceTo <= this.data.distance) {
      if (this.emiting) return;
      this.emiting = true;
      this.el.emit(this.data.event, {collidingEntity: this.data.target}, false);
      this.data.target.emit(this.data.event, {collidingEntity: this.el}, false);
    } else {
      if (!this.emiting) return;
      this.el.emit(this.data.eventFar, {collidingEntity: this.data.target}, false);
      this.data.target.emit(this.data.eventFar, {collidingEntity: this.el}, false);
      this.emiting = false;
    }
  }
});


/***/ }),

/***/ "./src/components/entity-generator.js":
/*!********************************************!*\
  !*** ./src/components/entity-generator.js ***!
  \********************************************/
/***/ (() => {

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

/***/ }),

/***/ "./src/components/environment-tweak.js":
/*!*********************************************!*\
  !*** ./src/components/environment-tweak.js ***!
  \*********************************************/
/***/ (() => {

AFRAME.registerComponent('environment-tweak', {
    multiple: true,
  
    init: function() {
      let env = document.querySelector('#env');
      env.setAttribute('environment', "preset: poison; active: true; fog: 0.01; dressing: hexagons; dressingScale: 2.62; groundYScale: 0;")
    },
  });

/***/ }),

/***/ "./src/components/on-event-set.js":
/*!****************************************!*\
  !*** ./src/components/on-event-set.js ***!
  \****************************************/
/***/ (() => {

AFRAME.registerComponent('on-event-set', {
  multiple: true,

  schema: {
    event: {type: 'string', default: 'click'},
    attribute: {type: 'string'},
    value: {type: 'string'}
  },

  init: function() {
    this._onEvent = this._onEvent.bind(this);
    this.el.addEventListener(this.data.event, this._onEvent);
  },

  remove: function() {
    this.el.removeEventListener(this.data.event, this._onEvent);
  },

  _onEvent: function(evt) {
    AFRAME.utils.entity.setComponentProperty(this.el, this.data.attribute, this.data.value);
  }

});

/***/ }),

/***/ "./src/components/random-position.js":
/*!*******************************************!*\
  !*** ./src/components/random-position.js ***!
  \*******************************************/
/***/ (() => {

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

/***/ }),

/***/ "./src/components/simple-navmesh-constraints.js":
/*!******************************************************!*\
  !*** ./src/components/simple-navmesh-constraints.js ***!
  \******************************************************/
/***/ (() => {

// from AdaRoseCanon xr-boilerplate https://github.com/AdaRoseCannon/aframe-xr-boilerplate
AFRAME.registerComponent('simple-navmesh-constraint', {
    schema: {
      navmesh: {
        default: ''
      },
      fall: {
        default: 0.5
      },
      height: {
        default: 1.6
      }
    },
  
    init: function () {
      this.lastPosition = new THREE.Vector3();
      this.el.object3D.getWorldPosition(this.lastPosition);
    },
  
    update: function () {
      const els = Array.from(document.querySelectorAll(this.data.navmesh));
      if (els === null) {
        console.warn('navmesh-physics: Did not match any elements');
        this.objects = [];
      } else {
        this.objects = els.map(el => el.object3D);
      }
    },
  
    tick: (function () {
      const nextPosition = new THREE.Vector3();
      const tempVec = new THREE.Vector3();
      const scanPattern = [
        [0,1], // Default the next location
        [30,0.4], // A little to the side shorter range
        [-30,0.4], // A little to the side shorter range
        [60,0.2], // Moderately to the side short range
        [-60,0.2], // Moderately to the side short range
        [80,0.06], // Perpendicular very short range
        [-80,0.06], // Perpendicular very short range
      ];
      const down = new THREE.Vector3(0,-1,0);
      const raycaster = new THREE.Raycaster();
      const gravity = -1;
      const maxYVelocity = 0.5;
      const results = [];
      let yVel = 0;
  
      return function (time, delta) {
        const el = this.el;
        if (this.objects.length === 0) return;
  
        this.el.object3D.getWorldPosition(nextPosition);
        if (nextPosition.distanceTo(this.lastPosition) === 0) return;
  
        let didHit = false;
  
        // So that it does not get stuck it takes as few samples around the user and finds the most appropriate
        for (const [angle, distance] of scanPattern) {
          tempVec.subVectors(nextPosition, this.lastPosition);
          tempVec.applyAxisAngle(down, angle*Math.PI/180);
          tempVec.multiplyScalar(distance);
          tempVec.add(this.lastPosition);
          tempVec.y += maxYVelocity;
          tempVec.y -= this.data.height;
          raycaster.set(tempVec, down);
          raycaster.far = this.data.fall > 0 ? this.data.fall + maxYVelocity : Infinity;
          raycaster.intersectObjects(this.objects, true, results);
          if (results.length) {
            const hitPos = results[0].point;
            hitPos.y += this.data.height;
            if (nextPosition.y - (hitPos.y - yVel*2) > 0.01) {
              yVel += Math.max(gravity * delta * 0.001, -maxYVelocity);
              hitPos.y = nextPosition.y + yVel;
            } else {
              yVel = 0;
            }
            el.object3D.position.copy(hitPos);
            this.el.object3D.parent.worldToLocal(this.el.object3D.position);
            this.lastPosition.copy(hitPos);
            results.splice(0);
            didHit = true;
            break;
          }
        }
  
        if (!didHit) {
          this.el.object3D.position.copy(this.lastPosition);
          this.el.object3D.parent.worldToLocal(this.el.object3D.position);
          
        }
      }
    }())
  });
  

/***/ }),

/***/ "./src/components/spawnpoint.js":
/*!**************************************!*\
  !*** ./src/components/spawnpoint.js ***!
  \**************************************/
/***/ (() => {

AFRAME.registerComponent('spawnpoint', {
    multiple: true,
    schema: {
        size: {default: 10, type: 'int'},
        pattern: {default: 'random', type: 'string'},
        origin: {default: {x: 0, y: 0, z: 0}, type: 'vec3'},
        radius: {default: 10, type: 'int'},
        enableY: {default: false, type: 'boolean'},
        rate: {default: 0, type: 'int'}
    },
    init: function() {
        // TODO open space in the pool via events
        let activeEntities = 0;
        // Select a-scene
        const sceneEl = document.querySelector('a-scene');
        // Create a pool
        const pool = `pool__${this.id}`;
        sceneEl.setAttribute(pool, `mixin: ${this.id}; size: ${this.data.size}`);
        if (this.data.rate > 0) {
            // Spawn entities on interval
            const spawnInterval = setInterval(() => {
                // Pool full, stop interval
                if (activeEntities === this.data.size) {
                    clearInterval(spawnInterval);
                    return;
                }
                this.spawnEntity(sceneEl,
                            sceneEl.components[pool],
                            this.data.pattern,
                            this.data.origin,
                            this.data.radius,
                            this.data.enableY);
                activeEntities++;
            }, this.data.rate);
        } else {
            // Spawn all entities in pool
            for (let i=0; i<this.data.size; i++) {
                this.spawnEntity(sceneEl,
                            sceneEl.components[pool],
                            this.data.pattern,
                            this.data.origin,
                            this.data.radius,
                            this.data.enableY);
                activeEntities++;
            }
        }
    },
    /**
      *  spawnEntity
      *
      *  Spawn an entity as a child
      *
      *  parentEl: The entity to host the spawned entities
      *  pool: The A-Frame pool for the spawned entity
      *  pattern: SPAWN_PATTERN flag
      *  origin: position vec3. Origin of the spawn pattern
      *  radius: number. Radius around the origin
      *  enableY: boolean. Enable random y-axis
      */
    spawnEntity: function(parentEl, pool, pattern, origin, radius, enableY) {
        // Get entity from pool
        const spawnEntity = pool.requestEntity();
        // Generate a spawn position based on settings
        const spawnPosition = this.spawnPosition(pattern,
                                                 origin,
                                                 radius,
                                                 enableY);
        parentEl.appendChild(spawnEntity);
        // Must set attributes after adding to scene
        // Set position
        spawnEntity.setAttribute('position', spawnPosition);
    },

    /**
      *  spawnPosition
      *
      *  Create a position where an entity will spawn
      *
      *  pattern: SPAWN_PATTERN flag
      *  origin: position vec3. Origin of the spawn pattern
      *  radius: number. Radius around the origin
      *  enableY: boolean. Enable random y-axis
      *
      *  Returns a position string where the entity will spawn
      *
      */
    spawnPosition: function(pattern, origin, radius, enableY) {
        // Use object for easier manipulation
        let pos = {x: 0, y: 0, z: 0};
        // Random positioning
        if (pattern === SPAWN_PATTERN.RANDOM) {
            // Random function: Positive or negative direction, within a range, from the origin
            pos.x = (Math.round(Math.random())=== 1 ? 1 : -1)
                  * (Math.random() * radius)
                  + origin.x;
            // Enable y-axis
            if (enableY) {
                pos.y = (Math.round(Math.random())=== 1 ? 1 : -1)
                      * (Math.random() * radius)
                      + origin.y;
            }
            pos.z = (Math.round(Math.random())=== 1 ? 1 : -1)
                  * (Math.random() * radius)
                  + origin.z;
        // Evenly spaced positioning
        } else if (this.data.pattern === SPAWN_PATTERN.EVEN) {
            // TODO Evenly spaced within a range
        // Handle bad pattern name
        } else {
            console.warn('aframe-spawnpoint-component:', `Invalid spawn pattern "${pattern}"`);
        }
        // Return a spawn position
        const result = `${pos.x} ${pos.y} ${pos.z}`;
        return result;
    }
});

/***/ }),

/***/ "./src/components/throw-ball.js":
/*!**************************************!*\
  !*** ./src/components/throw-ball.js ***!
  \**************************************/
/***/ (() => {

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
    // Apply force scaled force to entity
    let intensity = (Math.random() * 15) + 15;
    const force = new Ammo.btVector3(this.vector2.x* intensity, 0, this.vector2.z * intensity );
    const pos = new Ammo.btVector3(this.el.object3D.position);
    this.el.body.applyForce(force, pos);
    // Memory optimisation
    Ammo.destroy(force);
    Ammo.destroy(pos);
  }

});

/***/ }),

/***/ "./src/components sync \\.js$":
/*!*************************************************!*\
  !*** ./src/components/ sync nonrecursive \.js$ ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./collision-ball.js": "./src/components/collision-ball.js",
	"./emit-when-near.js": "./src/components/emit-when-near.js",
	"./entity-generator.js": "./src/components/entity-generator.js",
	"./environment-tweak.js": "./src/components/environment-tweak.js",
	"./on-event-set.js": "./src/components/on-event-set.js",
	"./random-position.js": "./src/components/random-position.js",
	"./simple-navmesh-constraints.js": "./src/components/simple-navmesh-constraints.js",
	"./spawnpoint.js": "./src/components/spawnpoint.js",
	"./throw-ball.js": "./src/components/throw-ball.js",
	"components/collision-ball.js": "./src/components/collision-ball.js",
	"components/emit-when-near.js": "./src/components/emit-when-near.js",
	"components/entity-generator.js": "./src/components/entity-generator.js",
	"components/environment-tweak.js": "./src/components/environment-tweak.js",
	"components/on-event-set.js": "./src/components/on-event-set.js",
	"components/random-position.js": "./src/components/random-position.js",
	"components/simple-navmesh-constraints.js": "./src/components/simple-navmesh-constraints.js",
	"components/spawnpoint.js": "./src/components/spawnpoint.js",
	"components/throw-ball.js": "./src/components/throw-ball.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/components sync \\.js$";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
function importAll(r) {
    r.keys().forEach(r);
  }
  
  importAll(__webpack_require__("./src/components sync \\.js$"));
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxtREFBK0MsRSIsInNvdXJjZXMiOlsid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvY29sbGlzaW9uLWJhbGwuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy9lbWl0LXdoZW4tbmVhci5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL2VudGl0eS1nZW5lcmF0b3IuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy9lbnZpcm9ubWVudC10d2Vhay5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL29uLWV2ZW50LXNldC5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3JhbmRvbS1wb3NpdGlvbi5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3NpbXBsZS1uYXZtZXNoLWNvbnN0cmFpbnRzLmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvc3Bhd25wb2ludC5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3Rocm93LWJhbGwuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50c3xzeW5jfG5vbnJlY3Vyc2l2ZXwvLmpzJCIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdjb2xsaXNpb24tYmFsbCcsIHtcclxuICBtdWx0aXBsZTogdHJ1ZSxcclxuICBzY2hlbWE6IHtcclxuICAgIHRhcmdldDogeyB0eXBlOiBcInNlbGVjdG9yXCIsIGRlZmF1bHQ6IFwiI3N3b3JkXCIgfSxcclxuICAgIGF1ZGlvOiB7IHR5cGU6IFwic2VsZWN0b3JcIiwgZGVmYXVsdDogXCIjYmFsbC1oaXRcIiB9LFxyXG4gICAgZW1pdEV2ZW50OiB7IHR5cGU6IFwic3RyaW5nXCIsIGRlZmF1bHQ6IFwicGxheS1tb2RlLWVhc3lcIiB9LFxyXG4gICAgZW1pdFRhcmdldDogeyB0eXBlOiBcInNlbGVjdG9yXCIsIGRlZmF1bHQ6IFwiI3NjZW5lXCJ9XHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fb25FdmVudCA9IHRoaXMuX29uRXZlbnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY29sbGlkZXN0YXJ0JywgdGhpcy5fb25FdmVudCk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5kYXRhLmV2ZW50LCB0aGlzLl9vbkV2ZW50KTtcclxuICB9LFxyXG5cclxuICBfb25FdmVudDogZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgbGV0IHRhcmdldCA9IGV2dC5kZXRhaWwudGFyZ2V0RWw7XHJcbiAgICBpZiAodGFyZ2V0ID09IHRoaXMuZGF0YS50YXJnZXQpIHtcclxuICAgICAgdGhpcy5kYXRhLmVtaXRUYXJnZXQuZW1pdCh0aGlzLmRhdGEuZW1pdEV2ZW50LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuZWwuZW1pdChcInN0YXJ0YW5pbVwiLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgIHRhcmdldC5lbWl0KFwidHJpZ2dlckhhcHRpY1wiLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgIGlmICh0aGlzLmRhdGEuYXVkaW8pIHRoaXMuZGF0YS5hdWRpby5wbGF5KCk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlKClcclxuICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2VtaXQtd2hlbi1uZWFyJywge1xyXG4gIHNjaGVtYToge1xyXG4gICAgdGFyZ2V0OiB7dHlwZTogJ3NlbGVjdG9yJywgZGVmYXVsdDogJyNjYW1lcmEtcmlnJ30sXHJcbiAgICBkaXN0YW5jZToge3R5cGU6ICdudW1iZXInLCBkZWZhdWx0OiAxfSxcclxuICAgIGV2ZW50OiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICdjbGljayd9LFxyXG4gICAgZXZlbnRGYXI6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ3VuY2xpY2snfSxcclxuICAgIHRocm90dGxlOiB7dHlwZTogJ251bWJlcicsIGRlZmF1bHQ6IDEwMH0sXHJcbiAgfSxcclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnRpY2sgPSBBRlJBTUUudXRpbHMudGhyb3R0bGVUaWNrKHRoaXMuY2hlY2tEaXN0LCB0aGlzLmRhdGEudGhyb3R0bGUsIHRoaXMpO1xyXG4gICAgdGhpcy5lbWl0aW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICBjaGVja0Rpc3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBteVBvcyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgbGV0IHRhcmdldFBvcyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgdGhpcy5lbC5vYmplY3QzRC5nZXRXb3JsZFBvc2l0aW9uKG15UG9zKTtcclxuICAgIHRoaXMuZGF0YS50YXJnZXQub2JqZWN0M0QuZ2V0V29ybGRQb3NpdGlvbih0YXJnZXRQb3MpO1xyXG4gICAgY29uc3QgZGlzdGFuY2VUbyA9IG15UG9zLmRpc3RhbmNlVG8odGFyZ2V0UG9zKTtcclxuICAgIGlmIChkaXN0YW5jZVRvIDw9IHRoaXMuZGF0YS5kaXN0YW5jZSkge1xyXG4gICAgICBpZiAodGhpcy5lbWl0aW5nKSByZXR1cm47XHJcbiAgICAgIHRoaXMuZW1pdGluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMuZWwuZW1pdCh0aGlzLmRhdGEuZXZlbnQsIHtjb2xsaWRpbmdFbnRpdHk6IHRoaXMuZGF0YS50YXJnZXR9LCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuZGF0YS50YXJnZXQuZW1pdCh0aGlzLmRhdGEuZXZlbnQsIHtjb2xsaWRpbmdFbnRpdHk6IHRoaXMuZWx9LCBmYWxzZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXRoaXMuZW1pdGluZykgcmV0dXJuO1xyXG4gICAgICB0aGlzLmVsLmVtaXQodGhpcy5kYXRhLmV2ZW50RmFyLCB7Y29sbGlkaW5nRW50aXR5OiB0aGlzLmRhdGEudGFyZ2V0fSwgZmFsc2UpO1xyXG4gICAgICB0aGlzLmRhdGEudGFyZ2V0LmVtaXQodGhpcy5kYXRhLmV2ZW50RmFyLCB7Y29sbGlkaW5nRW50aXR5OiB0aGlzLmVsfSwgZmFsc2UpO1xyXG4gICAgICB0aGlzLmVtaXRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2VudGl0eS1nZW5lcmF0b3InLCB7XHJcbiAgbXVsdGlwbGU6IHRydWUsXHJcblxyXG4gIHNjaGVtYToge1xyXG4gICAgbWl4aW46IHsgZGVmYXVsdDogJycgfSxcclxuICAgIG51bTogeyBkZWZhdWx0OiAxMCB9LFxyXG4gICAgZXZlbnQ6IHsgdHlwZTogXCJzdHJpbmdcIiwgZGVmYXVsdDogXCJwbGF5LW1vZGUtZWFzeVwiIH0sXHJcbiAgICBmcmVxdWVuY3k6IHt0eXBlOiBcIm51bWJlclwiLCBkZWZhdWx0OiAxfVxyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX29uRXZlbnQgPSB0aGlzLl9vbkV2ZW50LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5kYXRhLmV2ZW50LCB0aGlzLl9vbkV2ZW50KTtcclxuICB9LFxyXG5cclxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmRhdGEuZXZlbnQsIHRoaXMuX29uRXZlbnQpO1xyXG4gIH0sXHJcblxyXG4gIF9vbkV2ZW50OiBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICB2YXIgcGFyYXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZW51LWl0ZW0nKTtcclxuXHJcbiAgICB3aGlsZSAocGFyYXNbMF0pIHtcclxuICAgICAgcGFyYXNbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwYXJhc1swXSk7XHJcbiAgICB9XHJcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIC8vIENyZWF0ZSBlbnRpdGllcyB3aXRoIHN1cHBsaWVkIG1peGluLlxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLm51bTsgaSsrKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHZhciBlbnRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhLWVudGl0eScpO1xyXG4gICAgICAgIGVudGl0eS5zZXRBdHRyaWJ1dGUoJ21peGluJywgdGhpcy5kYXRhLm1peGluKTtcclxuICAgICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKGVudGl0eSk7XHJcbiAgICAgICAgZW50aXR5LmVtaXQoXCJlbmRhbmltXCIsIG51bGwsIGZhbHNlKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGVudGl0eS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgndGhyb3ctYmFsbCcpKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9LCAyMDAwICogaSAqIHRoaXMuZGF0YS5mcmVxdWVuY3kpO1xyXG4gICAgfVxyXG4gIH1cclxufSk7IiwiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdlbnZpcm9ubWVudC10d2VhaycsIHtcclxuICAgIG11bHRpcGxlOiB0cnVlLFxyXG4gIFxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbnYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW52Jyk7XHJcbiAgICAgIGVudi5zZXRBdHRyaWJ1dGUoJ2Vudmlyb25tZW50JywgXCJwcmVzZXQ6IHBvaXNvbjsgYWN0aXZlOiB0cnVlOyBmb2c6IDAuMDE7IGRyZXNzaW5nOiBoZXhhZ29uczsgZHJlc3NpbmdTY2FsZTogMi42MjsgZ3JvdW5kWVNjYWxlOiAwO1wiKVxyXG4gICAgfSxcclxuICB9KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ29uLWV2ZW50LXNldCcsIHtcclxuICBtdWx0aXBsZTogdHJ1ZSxcclxuXHJcbiAgc2NoZW1hOiB7XHJcbiAgICBldmVudDoge3R5cGU6ICdzdHJpbmcnLCBkZWZhdWx0OiAnY2xpY2snfSxcclxuICAgIGF0dHJpYnV0ZToge3R5cGU6ICdzdHJpbmcnfSxcclxuICAgIHZhbHVlOiB7dHlwZTogJ3N0cmluZyd9XHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9vbkV2ZW50ID0gdGhpcy5fb25FdmVudC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKHRoaXMuZGF0YS5ldmVudCwgdGhpcy5fb25FdmVudCk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmRhdGEuZXZlbnQsIHRoaXMuX29uRXZlbnQpO1xyXG4gIH0sXHJcblxyXG4gIF9vbkV2ZW50OiBmdW5jdGlvbihldnQpIHtcclxuICAgIEFGUkFNRS51dGlscy5lbnRpdHkuc2V0Q29tcG9uZW50UHJvcGVydHkodGhpcy5lbCwgdGhpcy5kYXRhLmF0dHJpYnV0ZSwgdGhpcy5kYXRhLnZhbHVlKTtcclxuICB9XHJcblxyXG59KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ3JhbmRvbS1wb3NpdGlvbicsIHtcclxuICAgIHNjaGVtYToge1xyXG4gICAgICBtaW46IHtkZWZhdWx0OiB7eDogLTEwLCB5OiAtMTAsIHo6IC0xMH0sIHR5cGU6ICd2ZWMzJ30sXHJcbiAgICAgIG1heDoge2RlZmF1bHQ6IHt4OiAxMCwgeTogMTAsIHo6IDEwfSwgdHlwZTogJ3ZlYzMnfVxyXG4gICAgfSxcclxuICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgdmFyIG1heCA9IGRhdGEubWF4O1xyXG4gICAgICB2YXIgbWluID0gZGF0YS5taW47XHJcbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIHtcclxuICAgICAgICB4OiBNYXRoLnJhbmRvbSgpICogKG1heC54IC0gbWluLngpICsgbWluLngsXHJcbiAgICAgICAgeTogTWF0aC5yYW5kb20oKSAqIChtYXgueSAtIG1pbi55KSArIG1pbi55LFxyXG4gICAgICAgIHo6IE1hdGgucmFuZG9tKCkgKiAobWF4LnogLSBtaW4ueikgKyBtaW4uelxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAvKipcclxuICAgKiBTZXQgcmFuZG9tIHBvc2l0aW9uIHdpdGhpbiBzcGhlcmljYWwgYm91bmRzLlxyXG4gICAqL1xyXG4gIEFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgncmFuZG9tLXNwaGVyaWNhbC1wb3NpdGlvbicsIHtcclxuICAgIHNjaGVtYToge1xyXG4gICAgICByYWRpdXM6IHtkZWZhdWx0OiAxMH0sXHJcbiAgICAgIHN0YXJ0WDoge2RlZmF1bHQ6IDB9LFxyXG4gICAgICBsZW5ndGhYOiB7ZGVmYXVsdDogMzYwfSxcclxuICAgICAgc3RhcnRZOiB7ZGVmYXVsdDogMH0sXHJcbiAgICAgIGxlbmd0aFk6IHtkZWZhdWx0OiAzNjB9XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gIFxyXG4gICAgICB2YXIgeEFuZ2xlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChNYXRoLnJhbmRvbSgpICogZGF0YS5sZW5ndGhYICsgZGF0YS5zdGFydFgpO1xyXG4gICAgICB2YXIgeUFuZ2xlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChNYXRoLnJhbmRvbSgpICogZGF0YS5sZW5ndGhZICsgZGF0YS5zdGFydFkpO1xyXG4gIFxyXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCB7XHJcbiAgICAgICAgeDogZGF0YS5yYWRpdXMgKiBNYXRoLmNvcyh4QW5nbGUpICogTWF0aC5zaW4oeUFuZ2xlKSxcclxuICAgICAgICB5OiBkYXRhLnJhZGl1cyAqIE1hdGguc2luKHhBbmdsZSkgKiBNYXRoLnNpbih5QW5nbGUpLFxyXG4gICAgICAgIHo6IGRhdGEucmFkaXVzICogTWF0aC5jb3MoeUFuZ2xlKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAvKipcclxuICAgKiBTZXQgcmFuZG9tIHJvdGF0aW9uIHdpdGhpbiBib3VuZHMuXHJcbiAgICovXHJcbiAgQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdyYW5kb20tcm90YXRpb24nLCB7XHJcbiAgICBzY2hlbWE6IHtcclxuICAgICAgbWluOiB7ZGVmYXVsdDoge3g6IDAsIHk6IDAsIHo6IDB9LCB0eXBlOiAndmVjMyd9LFxyXG4gICAgICBtYXg6IHtkZWZhdWx0OiB7eDogMzYwLCB5OiAzNjAsIHo6IDM2MH0sIHR5cGU6ICd2ZWMzJ31cclxuICAgIH0sXHJcbiAgXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgIHZhciBtYXggPSBkYXRhLm1heDtcclxuICAgICAgdmFyIG1pbiA9IGRhdGEubWluO1xyXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncm90YXRpb24nLCB7XHJcbiAgICAgICAgeDogTWF0aC5yYW5kb20oKSAqIG1heC54ICsgbWluLngsXHJcbiAgICAgICAgeTogTWF0aC5yYW5kb20oKSAqIG1heC55ICsgbWluLnksXHJcbiAgICAgICAgejogTWF0aC5yYW5kb20oKSAqIG1heC56ICsgbWluLnpcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7IiwiLy8gZnJvbSBBZGFSb3NlQ2Fub24geHItYm9pbGVycGxhdGUgaHR0cHM6Ly9naXRodWIuY29tL0FkYVJvc2VDYW5ub24vYWZyYW1lLXhyLWJvaWxlcnBsYXRlXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnc2ltcGxlLW5hdm1lc2gtY29uc3RyYWludCcsIHtcclxuICAgIHNjaGVtYToge1xyXG4gICAgICBuYXZtZXNoOiB7XHJcbiAgICAgICAgZGVmYXVsdDogJydcclxuICAgICAgfSxcclxuICAgICAgZmFsbDoge1xyXG4gICAgICAgIGRlZmF1bHQ6IDAuNVxyXG4gICAgICB9LFxyXG4gICAgICBoZWlnaHQ6IHtcclxuICAgICAgICBkZWZhdWx0OiAxLjZcclxuICAgICAgfVxyXG4gICAgfSxcclxuICBcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgICB0aGlzLmVsLm9iamVjdDNELmdldFdvcmxkUG9zaXRpb24odGhpcy5sYXN0UG9zaXRpb24pO1xyXG4gICAgfSxcclxuICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBjb25zdCBlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5kYXRhLm5hdm1lc2gpKTtcclxuICAgICAgaWYgKGVscyA9PT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignbmF2bWVzaC1waHlzaWNzOiBEaWQgbm90IG1hdGNoIGFueSBlbGVtZW50cycpO1xyXG4gICAgICAgIHRoaXMub2JqZWN0cyA9IFtdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub2JqZWN0cyA9IGVscy5tYXAoZWwgPT4gZWwub2JqZWN0M0QpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgdGljazogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc3QgbmV4dFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgICAgY29uc3QgdGVtcFZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICAgIGNvbnN0IHNjYW5QYXR0ZXJuID0gW1xyXG4gICAgICAgIFswLDFdLCAvLyBEZWZhdWx0IHRoZSBuZXh0IGxvY2F0aW9uXHJcbiAgICAgICAgWzMwLDAuNF0sIC8vIEEgbGl0dGxlIHRvIHRoZSBzaWRlIHNob3J0ZXIgcmFuZ2VcclxuICAgICAgICBbLTMwLDAuNF0sIC8vIEEgbGl0dGxlIHRvIHRoZSBzaWRlIHNob3J0ZXIgcmFuZ2VcclxuICAgICAgICBbNjAsMC4yXSwgLy8gTW9kZXJhdGVseSB0byB0aGUgc2lkZSBzaG9ydCByYW5nZVxyXG4gICAgICAgIFstNjAsMC4yXSwgLy8gTW9kZXJhdGVseSB0byB0aGUgc2lkZSBzaG9ydCByYW5nZVxyXG4gICAgICAgIFs4MCwwLjA2XSwgLy8gUGVycGVuZGljdWxhciB2ZXJ5IHNob3J0IHJhbmdlXHJcbiAgICAgICAgWy04MCwwLjA2XSwgLy8gUGVycGVuZGljdWxhciB2ZXJ5IHNob3J0IHJhbmdlXHJcbiAgICAgIF07XHJcbiAgICAgIGNvbnN0IGRvd24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLC0xLDApO1xyXG4gICAgICBjb25zdCByYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKCk7XHJcbiAgICAgIGNvbnN0IGdyYXZpdHkgPSAtMTtcclxuICAgICAgY29uc3QgbWF4WVZlbG9jaXR5ID0gMC41O1xyXG4gICAgICBjb25zdCByZXN1bHRzID0gW107XHJcbiAgICAgIGxldCB5VmVsID0gMDtcclxuICBcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aW1lLCBkZWx0YSkge1xyXG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy5lbDtcclxuICAgICAgICBpZiAodGhpcy5vYmplY3RzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gIFxyXG4gICAgICAgIHRoaXMuZWwub2JqZWN0M0QuZ2V0V29ybGRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xyXG4gICAgICAgIGlmIChuZXh0UG9zaXRpb24uZGlzdGFuY2VUbyh0aGlzLmxhc3RQb3NpdGlvbikgPT09IDApIHJldHVybjtcclxuICBcclxuICAgICAgICBsZXQgZGlkSGl0ID0gZmFsc2U7XHJcbiAgXHJcbiAgICAgICAgLy8gU28gdGhhdCBpdCBkb2VzIG5vdCBnZXQgc3R1Y2sgaXQgdGFrZXMgYXMgZmV3IHNhbXBsZXMgYXJvdW5kIHRoZSB1c2VyIGFuZCBmaW5kcyB0aGUgbW9zdCBhcHByb3ByaWF0ZVxyXG4gICAgICAgIGZvciAoY29uc3QgW2FuZ2xlLCBkaXN0YW5jZV0gb2Ygc2NhblBhdHRlcm4pIHtcclxuICAgICAgICAgIHRlbXBWZWMuc3ViVmVjdG9ycyhuZXh0UG9zaXRpb24sIHRoaXMubGFzdFBvc2l0aW9uKTtcclxuICAgICAgICAgIHRlbXBWZWMuYXBwbHlBeGlzQW5nbGUoZG93biwgYW5nbGUqTWF0aC5QSS8xODApO1xyXG4gICAgICAgICAgdGVtcFZlYy5tdWx0aXBseVNjYWxhcihkaXN0YW5jZSk7XHJcbiAgICAgICAgICB0ZW1wVmVjLmFkZCh0aGlzLmxhc3RQb3NpdGlvbik7XHJcbiAgICAgICAgICB0ZW1wVmVjLnkgKz0gbWF4WVZlbG9jaXR5O1xyXG4gICAgICAgICAgdGVtcFZlYy55IC09IHRoaXMuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgICByYXljYXN0ZXIuc2V0KHRlbXBWZWMsIGRvd24pO1xyXG4gICAgICAgICAgcmF5Y2FzdGVyLmZhciA9IHRoaXMuZGF0YS5mYWxsID4gMCA/IHRoaXMuZGF0YS5mYWxsICsgbWF4WVZlbG9jaXR5IDogSW5maW5pdHk7XHJcbiAgICAgICAgICByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyh0aGlzLm9iamVjdHMsIHRydWUsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhpdFBvcyA9IHJlc3VsdHNbMF0ucG9pbnQ7XHJcbiAgICAgICAgICAgIGhpdFBvcy55ICs9IHRoaXMuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmIChuZXh0UG9zaXRpb24ueSAtIChoaXRQb3MueSAtIHlWZWwqMikgPiAwLjAxKSB7XHJcbiAgICAgICAgICAgICAgeVZlbCArPSBNYXRoLm1heChncmF2aXR5ICogZGVsdGEgKiAwLjAwMSwgLW1heFlWZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgaGl0UG9zLnkgPSBuZXh0UG9zaXRpb24ueSArIHlWZWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeVZlbCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWwub2JqZWN0M0QucG9zaXRpb24uY29weShoaXRQb3MpO1xyXG4gICAgICAgICAgICB0aGlzLmVsLm9iamVjdDNELnBhcmVudC53b3JsZFRvTG9jYWwodGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uLmNvcHkoaGl0UG9zKTtcclxuICAgICAgICAgICAgcmVzdWx0cy5zcGxpY2UoMCk7XHJcbiAgICAgICAgICAgIGRpZEhpdCA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAoIWRpZEhpdCkge1xyXG4gICAgICAgICAgdGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbi5jb3B5KHRoaXMubGFzdFBvc2l0aW9uKTtcclxuICAgICAgICAgIHRoaXMuZWwub2JqZWN0M0QucGFyZW50LndvcmxkVG9Mb2NhbCh0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSgpKVxyXG4gIH0pO1xyXG4gICIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnc3Bhd25wb2ludCcsIHtcclxuICAgIG11bHRpcGxlOiB0cnVlLFxyXG4gICAgc2NoZW1hOiB7XHJcbiAgICAgICAgc2l6ZToge2RlZmF1bHQ6IDEwLCB0eXBlOiAnaW50J30sXHJcbiAgICAgICAgcGF0dGVybjoge2RlZmF1bHQ6ICdyYW5kb20nLCB0eXBlOiAnc3RyaW5nJ30sXHJcbiAgICAgICAgb3JpZ2luOiB7ZGVmYXVsdDoge3g6IDAsIHk6IDAsIHo6IDB9LCB0eXBlOiAndmVjMyd9LFxyXG4gICAgICAgIHJhZGl1czoge2RlZmF1bHQ6IDEwLCB0eXBlOiAnaW50J30sXHJcbiAgICAgICAgZW5hYmxlWToge2RlZmF1bHQ6IGZhbHNlLCB0eXBlOiAnYm9vbGVhbid9LFxyXG4gICAgICAgIHJhdGU6IHtkZWZhdWx0OiAwLCB0eXBlOiAnaW50J31cclxuICAgIH0sXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBUT0RPIG9wZW4gc3BhY2UgaW4gdGhlIHBvb2wgdmlhIGV2ZW50c1xyXG4gICAgICAgIGxldCBhY3RpdmVFbnRpdGllcyA9IDA7XHJcbiAgICAgICAgLy8gU2VsZWN0IGEtc2NlbmVcclxuICAgICAgICBjb25zdCBzY2VuZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYS1zY2VuZScpO1xyXG4gICAgICAgIC8vIENyZWF0ZSBhIHBvb2xcclxuICAgICAgICBjb25zdCBwb29sID0gYHBvb2xfXyR7dGhpcy5pZH1gO1xyXG4gICAgICAgIHNjZW5lRWwuc2V0QXR0cmlidXRlKHBvb2wsIGBtaXhpbjogJHt0aGlzLmlkfTsgc2l6ZTogJHt0aGlzLmRhdGEuc2l6ZX1gKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnJhdGUgPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIFNwYXduIGVudGl0aWVzIG9uIGludGVydmFsXHJcbiAgICAgICAgICAgIGNvbnN0IHNwYXduSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBQb29sIGZ1bGwsIHN0b3AgaW50ZXJ2YWxcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVFbnRpdGllcyA9PT0gdGhpcy5kYXRhLnNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHNwYXduSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25FbnRpdHkoc2NlbmVFbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjZW5lRWwuY29tcG9uZW50c1twb29sXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYXR0ZXJuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLm9yaWdpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5yYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuZW5hYmxlWSk7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVFbnRpdGllcysrO1xyXG4gICAgICAgICAgICB9LCB0aGlzLmRhdGEucmF0ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gU3Bhd24gYWxsIGVudGl0aWVzIGluIHBvb2xcclxuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMuZGF0YS5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25FbnRpdHkoc2NlbmVFbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjZW5lRWwuY29tcG9uZW50c1twb29sXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYXR0ZXJuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLm9yaWdpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5yYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuZW5hYmxlWSk7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVFbnRpdGllcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICAqICBzcGF3bkVudGl0eVxyXG4gICAgICAqXHJcbiAgICAgICogIFNwYXduIGFuIGVudGl0eSBhcyBhIGNoaWxkXHJcbiAgICAgICpcclxuICAgICAgKiAgcGFyZW50RWw6IFRoZSBlbnRpdHkgdG8gaG9zdCB0aGUgc3Bhd25lZCBlbnRpdGllc1xyXG4gICAgICAqICBwb29sOiBUaGUgQS1GcmFtZSBwb29sIGZvciB0aGUgc3Bhd25lZCBlbnRpdHlcclxuICAgICAgKiAgcGF0dGVybjogU1BBV05fUEFUVEVSTiBmbGFnXHJcbiAgICAgICogIG9yaWdpbjogcG9zaXRpb24gdmVjMy4gT3JpZ2luIG9mIHRoZSBzcGF3biBwYXR0ZXJuXHJcbiAgICAgICogIHJhZGl1czogbnVtYmVyLiBSYWRpdXMgYXJvdW5kIHRoZSBvcmlnaW5cclxuICAgICAgKiAgZW5hYmxlWTogYm9vbGVhbi4gRW5hYmxlIHJhbmRvbSB5LWF4aXNcclxuICAgICAgKi9cclxuICAgIHNwYXduRW50aXR5OiBmdW5jdGlvbihwYXJlbnRFbCwgcG9vbCwgcGF0dGVybiwgb3JpZ2luLCByYWRpdXMsIGVuYWJsZVkpIHtcclxuICAgICAgICAvLyBHZXQgZW50aXR5IGZyb20gcG9vbFxyXG4gICAgICAgIGNvbnN0IHNwYXduRW50aXR5ID0gcG9vbC5yZXF1ZXN0RW50aXR5KCk7XHJcbiAgICAgICAgLy8gR2VuZXJhdGUgYSBzcGF3biBwb3NpdGlvbiBiYXNlZCBvbiBzZXR0aW5nc1xyXG4gICAgICAgIGNvbnN0IHNwYXduUG9zaXRpb24gPSB0aGlzLnNwYXduUG9zaXRpb24ocGF0dGVybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZVkpO1xyXG4gICAgICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKHNwYXduRW50aXR5KTtcclxuICAgICAgICAvLyBNdXN0IHNldCBhdHRyaWJ1dGVzIGFmdGVyIGFkZGluZyB0byBzY2VuZVxyXG4gICAgICAgIC8vIFNldCBwb3NpdGlvblxyXG4gICAgICAgIHNwYXduRW50aXR5LnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBzcGF3blBvc2l0aW9uKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICogIHNwYXduUG9zaXRpb25cclxuICAgICAgKlxyXG4gICAgICAqICBDcmVhdGUgYSBwb3NpdGlvbiB3aGVyZSBhbiBlbnRpdHkgd2lsbCBzcGF3blxyXG4gICAgICAqXHJcbiAgICAgICogIHBhdHRlcm46IFNQQVdOX1BBVFRFUk4gZmxhZ1xyXG4gICAgICAqICBvcmlnaW46IHBvc2l0aW9uIHZlYzMuIE9yaWdpbiBvZiB0aGUgc3Bhd24gcGF0dGVyblxyXG4gICAgICAqICByYWRpdXM6IG51bWJlci4gUmFkaXVzIGFyb3VuZCB0aGUgb3JpZ2luXHJcbiAgICAgICogIGVuYWJsZVk6IGJvb2xlYW4uIEVuYWJsZSByYW5kb20geS1heGlzXHJcbiAgICAgICpcclxuICAgICAgKiAgUmV0dXJucyBhIHBvc2l0aW9uIHN0cmluZyB3aGVyZSB0aGUgZW50aXR5IHdpbGwgc3Bhd25cclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgc3Bhd25Qb3NpdGlvbjogZnVuY3Rpb24ocGF0dGVybiwgb3JpZ2luLCByYWRpdXMsIGVuYWJsZVkpIHtcclxuICAgICAgICAvLyBVc2Ugb2JqZWN0IGZvciBlYXNpZXIgbWFuaXB1bGF0aW9uXHJcbiAgICAgICAgbGV0IHBvcyA9IHt4OiAwLCB5OiAwLCB6OiAwfTtcclxuICAgICAgICAvLyBSYW5kb20gcG9zaXRpb25pbmdcclxuICAgICAgICBpZiAocGF0dGVybiA9PT0gU1BBV05fUEFUVEVSTi5SQU5ET00pIHtcclxuICAgICAgICAgICAgLy8gUmFuZG9tIGZ1bmN0aW9uOiBQb3NpdGl2ZSBvciBuZWdhdGl2ZSBkaXJlY3Rpb24sIHdpdGhpbiBhIHJhbmdlLCBmcm9tIHRoZSBvcmlnaW5cclxuICAgICAgICAgICAgcG9zLnggPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKT09PSAxID8gMSA6IC0xKVxyXG4gICAgICAgICAgICAgICAgICAqIChNYXRoLnJhbmRvbSgpICogcmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgICArIG9yaWdpbi54O1xyXG4gICAgICAgICAgICAvLyBFbmFibGUgeS1heGlzXHJcbiAgICAgICAgICAgIGlmIChlbmFibGVZKSB7XHJcbiAgICAgICAgICAgICAgICBwb3MueSA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpPT09IDEgPyAxIDogLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAqIChNYXRoLnJhbmRvbSgpICogcmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgKyBvcmlnaW4ueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwb3MueiA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpPT09IDEgPyAxIDogLTEpXHJcbiAgICAgICAgICAgICAgICAgICogKE1hdGgucmFuZG9tKCkgKiByYWRpdXMpXHJcbiAgICAgICAgICAgICAgICAgICsgb3JpZ2luLno7XHJcbiAgICAgICAgLy8gRXZlbmx5IHNwYWNlZCBwb3NpdGlvbmluZ1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhLnBhdHRlcm4gPT09IFNQQVdOX1BBVFRFUk4uRVZFTikge1xyXG4gICAgICAgICAgICAvLyBUT0RPIEV2ZW5seSBzcGFjZWQgd2l0aGluIGEgcmFuZ2VcclxuICAgICAgICAvLyBIYW5kbGUgYmFkIHBhdHRlcm4gbmFtZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignYWZyYW1lLXNwYXducG9pbnQtY29tcG9uZW50OicsIGBJbnZhbGlkIHNwYXduIHBhdHRlcm4gXCIke3BhdHRlcm59XCJgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUmV0dXJuIGEgc3Bhd24gcG9zaXRpb25cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBgJHtwb3MueH0gJHtwb3MueX0gJHtwb3Muen1gO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn0pOyIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgndGhyb3ctYmFsbCcsIHtcclxuICBtdWx0aXBsZTogdHJ1ZSxcclxuXHJcbiAgc2NoZW1hOiB7XHJcbiAgICB0YXJnZXQ6IHtcclxuICAgICAgdHlwZTogJ3NlbGVjdG9yJyxcclxuICAgICAgZGVmYXVsdDogJyNjYW1lcmEtcmlnJ1xyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICB0aGlzLnZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgdGhpcy5fb25FdmVudCA9IHRoaXMuX29uRXZlbnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcigndGhyb3ctYmFsbCcsIHRoaXMuX29uRXZlbnQpO1xyXG4gIH0sXHJcblxyXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0aHJvdy1iYWxsJywgdGhpcy5fb25FdmVudCk7XHJcbiAgfSxcclxuXHJcbiAgX29uRXZlbnQ6IGZ1bmN0aW9uIChldnQpIHtcclxuICAgIC8vIEdldCBwb3NpdGlvbiB2ZWN0b3JzXHJcbiAgICB0aGlzLmVsLnNjZW5lRWwuY2FtZXJhLmdldFdvcmxkUG9zaXRpb24odGhpcy52ZWN0b3IpO1xyXG4gICAgdGhpcy5lbC5vYmplY3QzRC5nZXRXb3JsZFBvc2l0aW9uKHRoaXMudmVjdG9yMilcclxuICAgIC8vIEdlbmVyYXRlIG5ldyB2ZWN0b3IgYW5kIGFpbSBhdCBjYW1lcmFcclxuICAgIHRoaXMudmVjdG9yMi5zdWIodGhpcy52ZWN0b3IpXHJcbiAgICB0aGlzLmVsLm9iamVjdDNELmxvb2tBdCh0aGlzLnZlY3Rvcik7XHJcbiAgICB0aGlzLnZlY3RvcjIubmVnYXRlKCk7XHJcbiAgICAvLyBGcmVlemUgb2JqZWN0IHVudGlsIHRocm93XHJcbiAgICAvLyBBcHBseSBmb3JjZSBzY2FsZWQgZm9yY2UgdG8gZW50aXR5XHJcbiAgICBsZXQgaW50ZW5zaXR5ID0gKE1hdGgucmFuZG9tKCkgKiAxNSkgKyAxNTtcclxuICAgIGNvbnN0IGZvcmNlID0gbmV3IEFtbW8uYnRWZWN0b3IzKHRoaXMudmVjdG9yMi54KiBpbnRlbnNpdHksIDAsIHRoaXMudmVjdG9yMi56ICogaW50ZW5zaXR5ICk7XHJcbiAgICBjb25zdCBwb3MgPSBuZXcgQW1tby5idFZlY3RvcjModGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbik7XHJcbiAgICB0aGlzLmVsLmJvZHkuYXBwbHlGb3JjZShmb3JjZSwgcG9zKTtcclxuICAgIC8vIE1lbW9yeSBvcHRpbWlzYXRpb25cclxuICAgIEFtbW8uZGVzdHJveShmb3JjZSk7XHJcbiAgICBBbW1vLmRlc3Ryb3kocG9zKTtcclxuICB9XHJcblxyXG59KTsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vY29sbGlzaW9uLWJhbGwuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2NvbGxpc2lvbi1iYWxsLmpzXCIsXG5cdFwiLi9lbWl0LXdoZW4tbmVhci5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvZW1pdC13aGVuLW5lYXIuanNcIixcblx0XCIuL2VudGl0eS1nZW5lcmF0b3IuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2VudGl0eS1nZW5lcmF0b3IuanNcIixcblx0XCIuL2Vudmlyb25tZW50LXR3ZWFrLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9lbnZpcm9ubWVudC10d2Vhay5qc1wiLFxuXHRcIi4vb24tZXZlbnQtc2V0LmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9vbi1ldmVudC1zZXQuanNcIixcblx0XCIuL3JhbmRvbS1wb3NpdGlvbi5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvcmFuZG9tLXBvc2l0aW9uLmpzXCIsXG5cdFwiLi9zaW1wbGUtbmF2bWVzaC1jb25zdHJhaW50cy5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvc2ltcGxlLW5hdm1lc2gtY29uc3RyYWludHMuanNcIixcblx0XCIuL3NwYXducG9pbnQuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3NwYXducG9pbnQuanNcIixcblx0XCIuL3Rocm93LWJhbGwuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3Rocm93LWJhbGwuanNcIixcblx0XCJjb21wb25lbnRzL2NvbGxpc2lvbi1iYWxsLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9jb2xsaXNpb24tYmFsbC5qc1wiLFxuXHRcImNvbXBvbmVudHMvZW1pdC13aGVuLW5lYXIuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2VtaXQtd2hlbi1uZWFyLmpzXCIsXG5cdFwiY29tcG9uZW50cy9lbnRpdHktZ2VuZXJhdG9yLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9lbnRpdHktZ2VuZXJhdG9yLmpzXCIsXG5cdFwiY29tcG9uZW50cy9lbnZpcm9ubWVudC10d2Vhay5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvZW52aXJvbm1lbnQtdHdlYWsuanNcIixcblx0XCJjb21wb25lbnRzL29uLWV2ZW50LXNldC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvb24tZXZlbnQtc2V0LmpzXCIsXG5cdFwiY29tcG9uZW50cy9yYW5kb20tcG9zaXRpb24uanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3JhbmRvbS1wb3NpdGlvbi5qc1wiLFxuXHRcImNvbXBvbmVudHMvc2ltcGxlLW5hdm1lc2gtY29uc3RyYWludHMuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3NpbXBsZS1uYXZtZXNoLWNvbnN0cmFpbnRzLmpzXCIsXG5cdFwiY29tcG9uZW50cy9zcGF3bnBvaW50LmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9zcGF3bnBvaW50LmpzXCIsXG5cdFwiY29tcG9uZW50cy90aHJvdy1iYWxsLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy90aHJvdy1iYWxsLmpzXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2NvbXBvbmVudHMgc3luYyBcXFxcLmpzJFwiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiZnVuY3Rpb24gaW1wb3J0QWxsKHIpIHtcclxuICAgIHIua2V5cygpLmZvckVhY2gocik7XHJcbiAgfVxyXG4gIFxyXG4gIGltcG9ydEFsbChyZXF1aXJlLmNvbnRleHQoJy4vY29tcG9uZW50cycsIGZhbHNlLCAvXFwuanMkLykpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==