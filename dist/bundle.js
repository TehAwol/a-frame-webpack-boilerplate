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
            console.log('moving')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLGNBQWMscUNBQXFDO0FBQ25ELGFBQWEsd0NBQXdDO0FBQ3JELGlCQUFpQiwyQ0FBMkM7QUFDNUQsa0JBQWtCO0FBQ2xCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7OztBQy9CRDtBQUNBO0FBQ0EsYUFBYSx5Q0FBeUM7QUFDdEQsZUFBZSwyQkFBMkI7QUFDMUMsWUFBWSxpQ0FBaUM7QUFDN0MsZUFBZSxtQ0FBbUM7QUFDbEQsZUFBZSw2QkFBNkI7QUFDNUMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsa0NBQWtDO0FBQ3ZFLDhDQUE4Qyx5QkFBeUI7QUFDdkUsTUFBTTtBQUNOO0FBQ0Esd0NBQXdDLGtDQUFrQztBQUMxRSxpREFBaUQseUJBQXlCO0FBQzFFO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDOUJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsY0FBYztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7O0FDcEREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsY0FBYyxXQUFXLG9CQUFvQixxQkFBcUIsZ0JBQWdCO0FBQ3pJLEtBQUs7QUFDTCxHQUFHOzs7Ozs7Ozs7O0FDUEg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGlDQUFpQztBQUM3QyxnQkFBZ0IsZUFBZTtBQUMvQixZQUFZO0FBQ1osR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7OztBQ3RCRDtBQUNBO0FBQ0EsWUFBWSxVQUFVLHVCQUF1QixlQUFlO0FBQzVELFlBQVksVUFBVSxvQkFBb0I7QUFDMUMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0IsZUFBZSxXQUFXO0FBQzFCLGdCQUFnQixhQUFhO0FBQzdCLGVBQWUsV0FBVztBQUMxQixnQkFBZ0I7QUFDaEIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxVQUFVLGlCQUFpQixlQUFlO0FBQ3RELFlBQVksVUFBVSx1QkFBdUI7QUFDN0MsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7Ozs7Ozs7Ozs7QUMvREg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOzs7Ozs7Ozs7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBLGVBQWUseUJBQXlCO0FBQ3hDLGtCQUFrQixrQ0FBa0M7QUFDcEQsaUJBQWlCLFVBQVUsaUJBQWlCLGVBQWU7QUFDM0QsaUJBQWlCLHlCQUF5QjtBQUMxQyxrQkFBa0IsZ0NBQWdDO0FBQ2xELGVBQWU7QUFDZixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFFBQVE7QUFDdEMsNkNBQTZDLFVBQVUsUUFBUSxlQUFlO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQSwwQkFBMEIsa0JBQWtCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFVBQVU7QUFDVixtRkFBbUYsUUFBUTtBQUMzRjtBQUNBO0FBQ0EsMEJBQTBCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTTtBQUNsRDtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7OztBQ25IRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7OztBQ3hDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ3ZDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxtREFBK0MsRSIsInNvdXJjZXMiOlsid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvY29sbGlzaW9uLWJhbGwuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy9lbWl0LXdoZW4tbmVhci5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL2VudGl0eS1nZW5lcmF0b3IuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy9lbnZpcm9ubWVudC10d2Vhay5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL29uLWV2ZW50LXNldC5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3JhbmRvbS1wb3NpdGlvbi5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3NpbXBsZS1uYXZtZXNoLWNvbnN0cmFpbnRzLmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvc3Bhd25wb2ludC5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3Rocm93LWJhbGwuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50c3xzeW5jfG5vbnJlY3Vyc2l2ZXwvLmpzJCIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdjb2xsaXNpb24tYmFsbCcsIHtcclxuICBtdWx0aXBsZTogdHJ1ZSxcclxuICBzY2hlbWE6IHtcclxuICAgIHRhcmdldDogeyB0eXBlOiBcInNlbGVjdG9yXCIsIGRlZmF1bHQ6IFwiI3N3b3JkXCIgfSxcclxuICAgIGF1ZGlvOiB7IHR5cGU6IFwic2VsZWN0b3JcIiwgZGVmYXVsdDogXCIjYmFsbC1oaXRcIiB9LFxyXG4gICAgZW1pdEV2ZW50OiB7IHR5cGU6IFwic3RyaW5nXCIsIGRlZmF1bHQ6IFwicGxheS1tb2RlLWVhc3lcIiB9LFxyXG4gICAgZW1pdFRhcmdldDogeyB0eXBlOiBcInNlbGVjdG9yXCIsIGRlZmF1bHQ6IFwiI3NjZW5lXCJ9XHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fb25FdmVudCA9IHRoaXMuX29uRXZlbnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY29sbGlkZXN0YXJ0JywgdGhpcy5fb25FdmVudCk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5kYXRhLmV2ZW50LCB0aGlzLl9vbkV2ZW50KTtcclxuICB9LFxyXG5cclxuICBfb25FdmVudDogZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgbGV0IHRhcmdldCA9IGV2dC5kZXRhaWwudGFyZ2V0RWw7XHJcbiAgICBpZiAodGFyZ2V0ID09IHRoaXMuZGF0YS50YXJnZXQpIHtcclxuICAgICAgdGhpcy5kYXRhLmVtaXRUYXJnZXQuZW1pdCh0aGlzLmRhdGEuZW1pdEV2ZW50LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuZWwuZW1pdChcInN0YXJ0YW5pbVwiLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgIHRhcmdldC5lbWl0KFwidHJpZ2dlckhhcHRpY1wiLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgIGlmICh0aGlzLmRhdGEuYXVkaW8pIHRoaXMuZGF0YS5hdWRpby5wbGF5KCk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlKClcclxuICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2VtaXQtd2hlbi1uZWFyJywge1xyXG4gIHNjaGVtYToge1xyXG4gICAgdGFyZ2V0OiB7dHlwZTogJ3NlbGVjdG9yJywgZGVmYXVsdDogJyNjYW1lcmEtcmlnJ30sXHJcbiAgICBkaXN0YW5jZToge3R5cGU6ICdudW1iZXInLCBkZWZhdWx0OiAxfSxcclxuICAgIGV2ZW50OiB7dHlwZTogJ3N0cmluZycsIGRlZmF1bHQ6ICdjbGljayd9LFxyXG4gICAgZXZlbnRGYXI6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ3VuY2xpY2snfSxcclxuICAgIHRocm90dGxlOiB7dHlwZTogJ251bWJlcicsIGRlZmF1bHQ6IDEwMH0sXHJcbiAgfSxcclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnRpY2sgPSBBRlJBTUUudXRpbHMudGhyb3R0bGVUaWNrKHRoaXMuY2hlY2tEaXN0LCB0aGlzLmRhdGEudGhyb3R0bGUsIHRoaXMpO1xyXG4gICAgdGhpcy5lbWl0aW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICBjaGVja0Rpc3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBteVBvcyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgbGV0IHRhcmdldFBvcyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgdGhpcy5lbC5vYmplY3QzRC5nZXRXb3JsZFBvc2l0aW9uKG15UG9zKTtcclxuICAgIHRoaXMuZGF0YS50YXJnZXQub2JqZWN0M0QuZ2V0V29ybGRQb3NpdGlvbih0YXJnZXRQb3MpO1xyXG4gICAgY29uc3QgZGlzdGFuY2VUbyA9IG15UG9zLmRpc3RhbmNlVG8odGFyZ2V0UG9zKTtcclxuICAgIGlmIChkaXN0YW5jZVRvIDw9IHRoaXMuZGF0YS5kaXN0YW5jZSkge1xyXG4gICAgICBpZiAodGhpcy5lbWl0aW5nKSByZXR1cm47XHJcbiAgICAgIHRoaXMuZW1pdGluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMuZWwuZW1pdCh0aGlzLmRhdGEuZXZlbnQsIHtjb2xsaWRpbmdFbnRpdHk6IHRoaXMuZGF0YS50YXJnZXR9LCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuZGF0YS50YXJnZXQuZW1pdCh0aGlzLmRhdGEuZXZlbnQsIHtjb2xsaWRpbmdFbnRpdHk6IHRoaXMuZWx9LCBmYWxzZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXRoaXMuZW1pdGluZykgcmV0dXJuO1xyXG4gICAgICB0aGlzLmVsLmVtaXQodGhpcy5kYXRhLmV2ZW50RmFyLCB7Y29sbGlkaW5nRW50aXR5OiB0aGlzLmRhdGEudGFyZ2V0fSwgZmFsc2UpO1xyXG4gICAgICB0aGlzLmRhdGEudGFyZ2V0LmVtaXQodGhpcy5kYXRhLmV2ZW50RmFyLCB7Y29sbGlkaW5nRW50aXR5OiB0aGlzLmVsfSwgZmFsc2UpO1xyXG4gICAgICB0aGlzLmVtaXRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2VudGl0eS1nZW5lcmF0b3InLCB7XHJcbiAgbXVsdGlwbGU6IHRydWUsXHJcblxyXG4gIHNjaGVtYToge1xyXG4gICAgbWl4aW46IHtcclxuICAgICAgZGVmYXVsdDogJydcclxuICAgIH0sXHJcbiAgICBudW06IHtcclxuICAgICAgZGVmYXVsdDogMTBcclxuICAgIH0sXHJcbiAgICBldmVudDoge1xyXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxyXG4gICAgICBkZWZhdWx0OiBcInBsYXktbW9kZS1lYXN5XCJcclxuICAgIH0sXHJcbiAgICBmcmVxdWVuY3k6IHtcclxuICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgZGVmYXVsdDogMVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX29uRXZlbnQgPSB0aGlzLl9vbkV2ZW50LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5kYXRhLmV2ZW50LCB0aGlzLl9vbkV2ZW50KTtcclxuICB9LFxyXG5cclxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmRhdGEuZXZlbnQsIHRoaXMuX29uRXZlbnQpO1xyXG4gIH0sXHJcblxyXG4gIF9vbkV2ZW50OiBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICBsZXQgcGFyYXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZW51LWl0ZW0nKTtcclxuICAgIGxldCBhdWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWxsLXNwYXduJyk7XHJcblxyXG4gICAgd2hpbGUgKHBhcmFzWzBdKSB7XHJcbiAgICAgIHBhcmFzWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocGFyYXNbMF0pO1xyXG4gICAgfVxyXG4gICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAvLyBDcmVhdGUgZW50aXRpZXMgd2l0aCBzdXBwbGllZCBtaXhpbiBhbmQgb2Zmc2V0cyBzcGF3biB3aXRoIGZyZXF1ZW5jeVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLm51bTsgaSsrKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGxldCBlbnRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhLWVudGl0eScpO1xyXG4gICAgICAgIGVudGl0eS5zZXRBdHRyaWJ1dGUoJ21peGluJywgdGhpcy5kYXRhLm1peGluKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhlbnRpdHkub2JqZWN0M0Quc2NhbGUpXHJcbiAgICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZChlbnRpdHkpO1xyXG4gICAgICAgIGF1ZGlvLnBsYXkoKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGVudGl0eS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgndGhyb3ctYmFsbCcpKTtcclxuICAgICAgICAgIGF1ZGlvLnBsYXkoKTtcclxuICAgICAgICB9LCAxMDAwKVxyXG4gICAgICB9LCAyMDAwICogaSAqIHRoaXMuZGF0YS5mcmVxdWVuY3kpO1xyXG4gICAgfVxyXG4gIH1cclxufSk7IiwiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdlbnZpcm9ubWVudC10d2VhaycsIHtcclxuICAgIG11bHRpcGxlOiB0cnVlLFxyXG4gIFxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbnYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW52Jyk7XHJcbiAgICAgIGVudi5zZXRBdHRyaWJ1dGUoJ2Vudmlyb25tZW50JywgXCJwcmVzZXQ6IHBvaXNvbjsgYWN0aXZlOiB0cnVlOyBmb2c6IDAuMDE7IGRyZXNzaW5nOiBoZXhhZ29uczsgZHJlc3NpbmdTY2FsZTogMi42MjsgZ3JvdW5kWVNjYWxlOiAwO1wiKVxyXG4gICAgfSxcclxuICB9KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ29uLWV2ZW50LXNldCcsIHtcclxuICBtdWx0aXBsZTogdHJ1ZSxcclxuXHJcbiAgc2NoZW1hOiB7XHJcbiAgICBldmVudDoge3R5cGU6ICdzdHJpbmcnLCBkZWZhdWx0OiAnY2xpY2snfSxcclxuICAgIGF0dHJpYnV0ZToge3R5cGU6ICdzdHJpbmcnfSxcclxuICAgIHZhbHVlOiB7dHlwZTogJ3N0cmluZyd9XHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9vbkV2ZW50ID0gdGhpcy5fb25FdmVudC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKHRoaXMuZGF0YS5ldmVudCwgdGhpcy5fb25FdmVudCk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmRhdGEuZXZlbnQsIHRoaXMuX29uRXZlbnQpO1xyXG4gIH0sXHJcblxyXG4gIF9vbkV2ZW50OiBmdW5jdGlvbihldnQpIHtcclxuICAgIEFGUkFNRS51dGlscy5lbnRpdHkuc2V0Q29tcG9uZW50UHJvcGVydHkodGhpcy5lbCwgdGhpcy5kYXRhLmF0dHJpYnV0ZSwgdGhpcy5kYXRhLnZhbHVlKTtcclxuICB9XHJcblxyXG59KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ3JhbmRvbS1wb3NpdGlvbicsIHtcclxuICAgIHNjaGVtYToge1xyXG4gICAgICBtaW46IHtkZWZhdWx0OiB7eDogLTEwLCB5OiAtMTAsIHo6IC0xMH0sIHR5cGU6ICd2ZWMzJ30sXHJcbiAgICAgIG1heDoge2RlZmF1bHQ6IHt4OiAxMCwgeTogMTAsIHo6IDEwfSwgdHlwZTogJ3ZlYzMnfVxyXG4gICAgfSxcclxuICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgdmFyIG1heCA9IGRhdGEubWF4O1xyXG4gICAgICB2YXIgbWluID0gZGF0YS5taW47XHJcbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIHtcclxuICAgICAgICB4OiBNYXRoLnJhbmRvbSgpICogKG1heC54IC0gbWluLngpICsgbWluLngsXHJcbiAgICAgICAgeTogTWF0aC5yYW5kb20oKSAqIChtYXgueSAtIG1pbi55KSArIG1pbi55LFxyXG4gICAgICAgIHo6IE1hdGgucmFuZG9tKCkgKiAobWF4LnogLSBtaW4ueikgKyBtaW4uelxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAvKipcclxuICAgKiBTZXQgcmFuZG9tIHBvc2l0aW9uIHdpdGhpbiBzcGhlcmljYWwgYm91bmRzLlxyXG4gICAqL1xyXG4gIEFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgncmFuZG9tLXNwaGVyaWNhbC1wb3NpdGlvbicsIHtcclxuICAgIHNjaGVtYToge1xyXG4gICAgICByYWRpdXM6IHtkZWZhdWx0OiAxMH0sXHJcbiAgICAgIHN0YXJ0WDoge2RlZmF1bHQ6IDB9LFxyXG4gICAgICBsZW5ndGhYOiB7ZGVmYXVsdDogMzYwfSxcclxuICAgICAgc3RhcnRZOiB7ZGVmYXVsdDogMH0sXHJcbiAgICAgIGxlbmd0aFk6IHtkZWZhdWx0OiAzNjB9XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gIFxyXG4gICAgICB2YXIgeEFuZ2xlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChNYXRoLnJhbmRvbSgpICogZGF0YS5sZW5ndGhYICsgZGF0YS5zdGFydFgpO1xyXG4gICAgICB2YXIgeUFuZ2xlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChNYXRoLnJhbmRvbSgpICogZGF0YS5sZW5ndGhZICsgZGF0YS5zdGFydFkpO1xyXG4gIFxyXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCB7XHJcbiAgICAgICAgeDogZGF0YS5yYWRpdXMgKiBNYXRoLmNvcyh4QW5nbGUpICogTWF0aC5zaW4oeUFuZ2xlKSxcclxuICAgICAgICB5OiBkYXRhLnJhZGl1cyAqIE1hdGguc2luKHhBbmdsZSkgKiBNYXRoLnNpbih5QW5nbGUpLFxyXG4gICAgICAgIHo6IGRhdGEucmFkaXVzICogTWF0aC5jb3MoeUFuZ2xlKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAvKipcclxuICAgKiBTZXQgcmFuZG9tIHJvdGF0aW9uIHdpdGhpbiBib3VuZHMuXHJcbiAgICovXHJcbiAgQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdyYW5kb20tcm90YXRpb24nLCB7XHJcbiAgICBzY2hlbWE6IHtcclxuICAgICAgbWluOiB7ZGVmYXVsdDoge3g6IDAsIHk6IDAsIHo6IDB9LCB0eXBlOiAndmVjMyd9LFxyXG4gICAgICBtYXg6IHtkZWZhdWx0OiB7eDogMzYwLCB5OiAzNjAsIHo6IDM2MH0sIHR5cGU6ICd2ZWMzJ31cclxuICAgIH0sXHJcbiAgXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgIHZhciBtYXggPSBkYXRhLm1heDtcclxuICAgICAgdmFyIG1pbiA9IGRhdGEubWluO1xyXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncm90YXRpb24nLCB7XHJcbiAgICAgICAgeDogTWF0aC5yYW5kb20oKSAqIG1heC54ICsgbWluLngsXHJcbiAgICAgICAgeTogTWF0aC5yYW5kb20oKSAqIG1heC55ICsgbWluLnksXHJcbiAgICAgICAgejogTWF0aC5yYW5kb20oKSAqIG1heC56ICsgbWluLnpcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7IiwiLy8gZnJvbSBBZGFSb3NlQ2Fub24geHItYm9pbGVycGxhdGUgaHR0cHM6Ly9naXRodWIuY29tL0FkYVJvc2VDYW5ub24vYWZyYW1lLXhyLWJvaWxlcnBsYXRlXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnc2ltcGxlLW5hdm1lc2gtY29uc3RyYWludCcsIHtcclxuICAgIHNjaGVtYToge1xyXG4gICAgICBuYXZtZXNoOiB7XHJcbiAgICAgICAgZGVmYXVsdDogJydcclxuICAgICAgfSxcclxuICAgICAgZmFsbDoge1xyXG4gICAgICAgIGRlZmF1bHQ6IDAuNVxyXG4gICAgICB9LFxyXG4gICAgICBoZWlnaHQ6IHtcclxuICAgICAgICBkZWZhdWx0OiAxLjZcclxuICAgICAgfVxyXG4gICAgfSxcclxuICBcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgICB0aGlzLmVsLm9iamVjdDNELmdldFdvcmxkUG9zaXRpb24odGhpcy5sYXN0UG9zaXRpb24pO1xyXG4gICAgfSxcclxuICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBjb25zdCBlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5kYXRhLm5hdm1lc2gpKTtcclxuICAgICAgaWYgKGVscyA9PT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignbmF2bWVzaC1waHlzaWNzOiBEaWQgbm90IG1hdGNoIGFueSBlbGVtZW50cycpO1xyXG4gICAgICAgIHRoaXMub2JqZWN0cyA9IFtdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub2JqZWN0cyA9IGVscy5tYXAoZWwgPT4gZWwub2JqZWN0M0QpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgdGljazogKGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc3QgbmV4dFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgICAgY29uc3QgdGVtcFZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICAgIGNvbnN0IHNjYW5QYXR0ZXJuID0gW1xyXG4gICAgICAgIFswLDFdLCAvLyBEZWZhdWx0IHRoZSBuZXh0IGxvY2F0aW9uXHJcbiAgICAgICAgWzMwLDAuNF0sIC8vIEEgbGl0dGxlIHRvIHRoZSBzaWRlIHNob3J0ZXIgcmFuZ2VcclxuICAgICAgICBbLTMwLDAuNF0sIC8vIEEgbGl0dGxlIHRvIHRoZSBzaWRlIHNob3J0ZXIgcmFuZ2VcclxuICAgICAgICBbNjAsMC4yXSwgLy8gTW9kZXJhdGVseSB0byB0aGUgc2lkZSBzaG9ydCByYW5nZVxyXG4gICAgICAgIFstNjAsMC4yXSwgLy8gTW9kZXJhdGVseSB0byB0aGUgc2lkZSBzaG9ydCByYW5nZVxyXG4gICAgICAgIFs4MCwwLjA2XSwgLy8gUGVycGVuZGljdWxhciB2ZXJ5IHNob3J0IHJhbmdlXHJcbiAgICAgICAgWy04MCwwLjA2XSwgLy8gUGVycGVuZGljdWxhciB2ZXJ5IHNob3J0IHJhbmdlXHJcbiAgICAgIF07XHJcbiAgICAgIGNvbnN0IGRvd24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLC0xLDApO1xyXG4gICAgICBjb25zdCByYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKCk7XHJcbiAgICAgIGNvbnN0IGdyYXZpdHkgPSAtMTtcclxuICAgICAgY29uc3QgbWF4WVZlbG9jaXR5ID0gMC41O1xyXG4gICAgICBjb25zdCByZXN1bHRzID0gW107XHJcbiAgICAgIGxldCB5VmVsID0gMDtcclxuICBcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aW1lLCBkZWx0YSkge1xyXG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy5lbDtcclxuICAgICAgICBpZiAodGhpcy5vYmplY3RzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gIFxyXG4gICAgICAgIHRoaXMuZWwub2JqZWN0M0QuZ2V0V29ybGRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xyXG4gICAgICAgIGlmIChuZXh0UG9zaXRpb24uZGlzdGFuY2VUbyh0aGlzLmxhc3RQb3NpdGlvbikgPT09IDApIHJldHVybjtcclxuICBcclxuICAgICAgICBsZXQgZGlkSGl0ID0gZmFsc2U7XHJcbiAgXHJcbiAgICAgICAgLy8gU28gdGhhdCBpdCBkb2VzIG5vdCBnZXQgc3R1Y2sgaXQgdGFrZXMgYXMgZmV3IHNhbXBsZXMgYXJvdW5kIHRoZSB1c2VyIGFuZCBmaW5kcyB0aGUgbW9zdCBhcHByb3ByaWF0ZVxyXG4gICAgICAgIGZvciAoY29uc3QgW2FuZ2xlLCBkaXN0YW5jZV0gb2Ygc2NhblBhdHRlcm4pIHtcclxuICAgICAgICAgIHRlbXBWZWMuc3ViVmVjdG9ycyhuZXh0UG9zaXRpb24sIHRoaXMubGFzdFBvc2l0aW9uKTtcclxuICAgICAgICAgIHRlbXBWZWMuYXBwbHlBeGlzQW5nbGUoZG93biwgYW5nbGUqTWF0aC5QSS8xODApO1xyXG4gICAgICAgICAgdGVtcFZlYy5tdWx0aXBseVNjYWxhcihkaXN0YW5jZSk7XHJcbiAgICAgICAgICB0ZW1wVmVjLmFkZCh0aGlzLmxhc3RQb3NpdGlvbik7XHJcbiAgICAgICAgICB0ZW1wVmVjLnkgKz0gbWF4WVZlbG9jaXR5O1xyXG4gICAgICAgICAgdGVtcFZlYy55IC09IHRoaXMuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgICByYXljYXN0ZXIuc2V0KHRlbXBWZWMsIGRvd24pO1xyXG4gICAgICAgICAgcmF5Y2FzdGVyLmZhciA9IHRoaXMuZGF0YS5mYWxsID4gMCA/IHRoaXMuZGF0YS5mYWxsICsgbWF4WVZlbG9jaXR5IDogSW5maW5pdHk7XHJcbiAgICAgICAgICByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyh0aGlzLm9iamVjdHMsIHRydWUsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhpdFBvcyA9IHJlc3VsdHNbMF0ucG9pbnQ7XHJcbiAgICAgICAgICAgIGhpdFBvcy55ICs9IHRoaXMuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmIChuZXh0UG9zaXRpb24ueSAtIChoaXRQb3MueSAtIHlWZWwqMikgPiAwLjAxKSB7XHJcbiAgICAgICAgICAgICAgeVZlbCArPSBNYXRoLm1heChncmF2aXR5ICogZGVsdGEgKiAwLjAwMSwgLW1heFlWZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgaGl0UG9zLnkgPSBuZXh0UG9zaXRpb24ueSArIHlWZWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeVZlbCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWwub2JqZWN0M0QucG9zaXRpb24uY29weShoaXRQb3MpO1xyXG4gICAgICAgICAgICB0aGlzLmVsLm9iamVjdDNELnBhcmVudC53b3JsZFRvTG9jYWwodGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uLmNvcHkoaGl0UG9zKTtcclxuICAgICAgICAgICAgcmVzdWx0cy5zcGxpY2UoMCk7XHJcbiAgICAgICAgICAgIGRpZEhpdCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtb3ZpbmcnKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKCFkaWRIaXQpIHtcclxuICAgICAgICAgIHRoaXMuZWwub2JqZWN0M0QucG9zaXRpb24uY29weSh0aGlzLmxhc3RQb3NpdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmVsLm9iamVjdDNELnBhcmVudC53b3JsZFRvTG9jYWwodGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbik7XHJcbiAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0oKSlcclxuICB9KTtcclxuICAiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ3NwYXducG9pbnQnLCB7XHJcbiAgICBtdWx0aXBsZTogdHJ1ZSxcclxuICAgIHNjaGVtYToge1xyXG4gICAgICAgIHNpemU6IHtkZWZhdWx0OiAxMCwgdHlwZTogJ2ludCd9LFxyXG4gICAgICAgIHBhdHRlcm46IHtkZWZhdWx0OiAncmFuZG9tJywgdHlwZTogJ3N0cmluZyd9LFxyXG4gICAgICAgIG9yaWdpbjoge2RlZmF1bHQ6IHt4OiAwLCB5OiAwLCB6OiAwfSwgdHlwZTogJ3ZlYzMnfSxcclxuICAgICAgICByYWRpdXM6IHtkZWZhdWx0OiAxMCwgdHlwZTogJ2ludCd9LFxyXG4gICAgICAgIGVuYWJsZVk6IHtkZWZhdWx0OiBmYWxzZSwgdHlwZTogJ2Jvb2xlYW4nfSxcclxuICAgICAgICByYXRlOiB7ZGVmYXVsdDogMCwgdHlwZTogJ2ludCd9XHJcbiAgICB9LFxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gVE9ETyBvcGVuIHNwYWNlIGluIHRoZSBwb29sIHZpYSBldmVudHNcclxuICAgICAgICBsZXQgYWN0aXZlRW50aXRpZXMgPSAwO1xyXG4gICAgICAgIC8vIFNlbGVjdCBhLXNjZW5lXHJcbiAgICAgICAgY29uc3Qgc2NlbmVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Etc2NlbmUnKTtcclxuICAgICAgICAvLyBDcmVhdGUgYSBwb29sXHJcbiAgICAgICAgY29uc3QgcG9vbCA9IGBwb29sX18ke3RoaXMuaWR9YDtcclxuICAgICAgICBzY2VuZUVsLnNldEF0dHJpYnV0ZShwb29sLCBgbWl4aW46ICR7dGhpcy5pZH07IHNpemU6ICR7dGhpcy5kYXRhLnNpemV9YCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5yYXRlID4gMCkge1xyXG4gICAgICAgICAgICAvLyBTcGF3biBlbnRpdGllcyBvbiBpbnRlcnZhbFxyXG4gICAgICAgICAgICBjb25zdCBzcGF3bkludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gUG9vbCBmdWxsLCBzdG9wIGludGVydmFsXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlRW50aXRpZXMgPT09IHRoaXMuZGF0YS5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChzcGF3bkludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwYXduRW50aXR5KHNjZW5lRWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZUVsLmNvbXBvbmVudHNbcG9vbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGF0dGVybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5vcmlnaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEucmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmVuYWJsZVkpO1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlRW50aXRpZXMrKztcclxuICAgICAgICAgICAgfSwgdGhpcy5kYXRhLnJhdGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFNwYXduIGFsbCBlbnRpdGllcyBpbiBwb29sXHJcbiAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLmRhdGEuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwYXduRW50aXR5KHNjZW5lRWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZUVsLmNvbXBvbmVudHNbcG9vbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGF0dGVybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5vcmlnaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEucmFkaXVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmVuYWJsZVkpO1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlRW50aXRpZXMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAgKiAgc3Bhd25FbnRpdHlcclxuICAgICAgKlxyXG4gICAgICAqICBTcGF3biBhbiBlbnRpdHkgYXMgYSBjaGlsZFxyXG4gICAgICAqXHJcbiAgICAgICogIHBhcmVudEVsOiBUaGUgZW50aXR5IHRvIGhvc3QgdGhlIHNwYXduZWQgZW50aXRpZXNcclxuICAgICAgKiAgcG9vbDogVGhlIEEtRnJhbWUgcG9vbCBmb3IgdGhlIHNwYXduZWQgZW50aXR5XHJcbiAgICAgICogIHBhdHRlcm46IFNQQVdOX1BBVFRFUk4gZmxhZ1xyXG4gICAgICAqICBvcmlnaW46IHBvc2l0aW9uIHZlYzMuIE9yaWdpbiBvZiB0aGUgc3Bhd24gcGF0dGVyblxyXG4gICAgICAqICByYWRpdXM6IG51bWJlci4gUmFkaXVzIGFyb3VuZCB0aGUgb3JpZ2luXHJcbiAgICAgICogIGVuYWJsZVk6IGJvb2xlYW4uIEVuYWJsZSByYW5kb20geS1heGlzXHJcbiAgICAgICovXHJcbiAgICBzcGF3bkVudGl0eTogZnVuY3Rpb24ocGFyZW50RWwsIHBvb2wsIHBhdHRlcm4sIG9yaWdpbiwgcmFkaXVzLCBlbmFibGVZKSB7XHJcbiAgICAgICAgLy8gR2V0IGVudGl0eSBmcm9tIHBvb2xcclxuICAgICAgICBjb25zdCBzcGF3bkVudGl0eSA9IHBvb2wucmVxdWVzdEVudGl0eSgpO1xyXG4gICAgICAgIC8vIEdlbmVyYXRlIGEgc3Bhd24gcG9zaXRpb24gYmFzZWQgb24gc2V0dGluZ3NcclxuICAgICAgICBjb25zdCBzcGF3blBvc2l0aW9uID0gdGhpcy5zcGF3blBvc2l0aW9uKHBhdHRlcm4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVZKTtcclxuICAgICAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChzcGF3bkVudGl0eSk7XHJcbiAgICAgICAgLy8gTXVzdCBzZXQgYXR0cmlidXRlcyBhZnRlciBhZGRpbmcgdG8gc2NlbmVcclxuICAgICAgICAvLyBTZXQgcG9zaXRpb25cclxuICAgICAgICBzcGF3bkVudGl0eS5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgc3Bhd25Qb3NpdGlvbik7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICAqICBzcGF3blBvc2l0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiAgQ3JlYXRlIGEgcG9zaXRpb24gd2hlcmUgYW4gZW50aXR5IHdpbGwgc3Bhd25cclxuICAgICAgKlxyXG4gICAgICAqICBwYXR0ZXJuOiBTUEFXTl9QQVRURVJOIGZsYWdcclxuICAgICAgKiAgb3JpZ2luOiBwb3NpdGlvbiB2ZWMzLiBPcmlnaW4gb2YgdGhlIHNwYXduIHBhdHRlcm5cclxuICAgICAgKiAgcmFkaXVzOiBudW1iZXIuIFJhZGl1cyBhcm91bmQgdGhlIG9yaWdpblxyXG4gICAgICAqICBlbmFibGVZOiBib29sZWFuLiBFbmFibGUgcmFuZG9tIHktYXhpc1xyXG4gICAgICAqXHJcbiAgICAgICogIFJldHVybnMgYSBwb3NpdGlvbiBzdHJpbmcgd2hlcmUgdGhlIGVudGl0eSB3aWxsIHNwYXduXHJcbiAgICAgICpcclxuICAgICAgKi9cclxuICAgIHNwYXduUG9zaXRpb246IGZ1bmN0aW9uKHBhdHRlcm4sIG9yaWdpbiwgcmFkaXVzLCBlbmFibGVZKSB7XHJcbiAgICAgICAgLy8gVXNlIG9iamVjdCBmb3IgZWFzaWVyIG1hbmlwdWxhdGlvblxyXG4gICAgICAgIGxldCBwb3MgPSB7eDogMCwgeTogMCwgejogMH07XHJcbiAgICAgICAgLy8gUmFuZG9tIHBvc2l0aW9uaW5nXHJcbiAgICAgICAgaWYgKHBhdHRlcm4gPT09IFNQQVdOX1BBVFRFUk4uUkFORE9NKSB7XHJcbiAgICAgICAgICAgIC8vIFJhbmRvbSBmdW5jdGlvbjogUG9zaXRpdmUgb3IgbmVnYXRpdmUgZGlyZWN0aW9uLCB3aXRoaW4gYSByYW5nZSwgZnJvbSB0aGUgb3JpZ2luXHJcbiAgICAgICAgICAgIHBvcy54ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk9PT0gMSA/IDEgOiAtMSlcclxuICAgICAgICAgICAgICAgICAgKiAoTWF0aC5yYW5kb20oKSAqIHJhZGl1cylcclxuICAgICAgICAgICAgICAgICAgKyBvcmlnaW4ueDtcclxuICAgICAgICAgICAgLy8gRW5hYmxlIHktYXhpc1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlWSkge1xyXG4gICAgICAgICAgICAgICAgcG9zLnkgPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKT09PSAxID8gMSA6IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgKiAoTWF0aC5yYW5kb20oKSAqIHJhZGl1cylcclxuICAgICAgICAgICAgICAgICAgICAgICsgb3JpZ2luLnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcG9zLnogPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKT09PSAxID8gMSA6IC0xKVxyXG4gICAgICAgICAgICAgICAgICAqIChNYXRoLnJhbmRvbSgpICogcmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgICArIG9yaWdpbi56O1xyXG4gICAgICAgIC8vIEV2ZW5seSBzcGFjZWQgcG9zaXRpb25pbmdcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YS5wYXR0ZXJuID09PSBTUEFXTl9QQVRURVJOLkVWRU4pIHtcclxuICAgICAgICAgICAgLy8gVE9ETyBFdmVubHkgc3BhY2VkIHdpdGhpbiBhIHJhbmdlXHJcbiAgICAgICAgLy8gSGFuZGxlIGJhZCBwYXR0ZXJuIG5hbWVcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2FmcmFtZS1zcGF3bnBvaW50LWNvbXBvbmVudDonLCBgSW52YWxpZCBzcGF3biBwYXR0ZXJuIFwiJHtwYXR0ZXJufVwiYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFJldHVybiBhIHNwYXduIHBvc2l0aW9uXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYCR7cG9zLnh9ICR7cG9zLnl9ICR7cG9zLnp9YDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ3Rocm93LWJhbGwnLCB7XHJcbiAgbXVsdGlwbGU6IHRydWUsXHJcblxyXG4gIHNjaGVtYToge1xyXG4gICAgdGFyZ2V0OiB7XHJcbiAgICAgIHR5cGU6ICdzZWxlY3RvcicsXHJcbiAgICAgIGRlZmF1bHQ6ICcjY2FtZXJhLXJpZydcclxuICAgIH0sXHJcbiAgfSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy52ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgdGhpcy52ZWN0b3IyID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIHRoaXMuX29uRXZlbnQgPSB0aGlzLl9vbkV2ZW50LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3Rocm93LWJhbGwnLCB0aGlzLl9vbkV2ZW50KTtcclxuICB9LFxyXG5cclxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndGhyb3ctYmFsbCcsIHRoaXMuX29uRXZlbnQpO1xyXG4gIH0sXHJcblxyXG4gIF9vbkV2ZW50OiBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAvLyBHZXQgcG9zaXRpb24gdmVjdG9yc1xyXG4gICAgdGhpcy5lbC5zY2VuZUVsLmNhbWVyYS5nZXRXb3JsZFBvc2l0aW9uKHRoaXMudmVjdG9yKTtcclxuICAgIHRoaXMuZWwub2JqZWN0M0QuZ2V0V29ybGRQb3NpdGlvbih0aGlzLnZlY3RvcjIpXHJcbiAgICAvLyBHZW5lcmF0ZSBuZXcgdmVjdG9yIGFuZCBhaW0gYXQgY2FtZXJhXHJcbiAgICB0aGlzLnZlY3RvcjIuc3ViKHRoaXMudmVjdG9yKVxyXG4gICAgdGhpcy5lbC5vYmplY3QzRC5sb29rQXQodGhpcy52ZWN0b3IpO1xyXG4gICAgdGhpcy52ZWN0b3IyLm5lZ2F0ZSgpO1xyXG4gICAgLy8gRnJlZXplIG9iamVjdCB1bnRpbCB0aHJvd1xyXG4gICAgLy8gQXBwbHkgcmFuZG9taXNlZCBzY2FsZWQgZm9yY2UgdG8gYmFsbFxyXG4gICAgbGV0IGludGVuc2l0eSA9IChNYXRoLnJhbmRvbSgpICogMTUpICsgMjU7XHJcbiAgICBjb25zdCBmb3JjZSA9IG5ldyBBbW1vLmJ0VmVjdG9yMyh0aGlzLnZlY3RvcjIueCogaW50ZW5zaXR5LCB0aGlzLnZlY3RvcjIueSwgdGhpcy52ZWN0b3IyLnogKiBpbnRlbnNpdHkgKTtcclxuICAgIGNvbnN0IHBvcyA9IG5ldyBBbW1vLmJ0VmVjdG9yMyh0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uKTtcclxuICAgIHRoaXMuZWwuYm9keS5hcHBseUZvcmNlKGZvcmNlLCBwb3MpO1xyXG4gICAgLy8gTWVtb3J5IG9wdGltaXNhdGlvblxyXG4gICAgQW1tby5kZXN0cm95KGZvcmNlKTtcclxuICAgIEFtbW8uZGVzdHJveShwb3MpO1xyXG4gIH1cclxuXHJcbn0pOyIsInZhciBtYXAgPSB7XG5cdFwiLi9jb2xsaXNpb24tYmFsbC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvY29sbGlzaW9uLWJhbGwuanNcIixcblx0XCIuL2VtaXQtd2hlbi1uZWFyLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9lbWl0LXdoZW4tbmVhci5qc1wiLFxuXHRcIi4vZW50aXR5LWdlbmVyYXRvci5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvZW50aXR5LWdlbmVyYXRvci5qc1wiLFxuXHRcIi4vZW52aXJvbm1lbnQtdHdlYWsuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2Vudmlyb25tZW50LXR3ZWFrLmpzXCIsXG5cdFwiLi9vbi1ldmVudC1zZXQuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL29uLWV2ZW50LXNldC5qc1wiLFxuXHRcIi4vcmFuZG9tLXBvc2l0aW9uLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9yYW5kb20tcG9zaXRpb24uanNcIixcblx0XCIuL3NpbXBsZS1uYXZtZXNoLWNvbnN0cmFpbnRzLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9zaW1wbGUtbmF2bWVzaC1jb25zdHJhaW50cy5qc1wiLFxuXHRcIi4vc3Bhd25wb2ludC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvc3Bhd25wb2ludC5qc1wiLFxuXHRcIi4vdGhyb3ctYmFsbC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvdGhyb3ctYmFsbC5qc1wiLFxuXHRcImNvbXBvbmVudHMvY29sbGlzaW9uLWJhbGwuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2NvbGxpc2lvbi1iYWxsLmpzXCIsXG5cdFwiY29tcG9uZW50cy9lbWl0LXdoZW4tbmVhci5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvZW1pdC13aGVuLW5lYXIuanNcIixcblx0XCJjb21wb25lbnRzL2VudGl0eS1nZW5lcmF0b3IuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2VudGl0eS1nZW5lcmF0b3IuanNcIixcblx0XCJjb21wb25lbnRzL2Vudmlyb25tZW50LXR3ZWFrLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9lbnZpcm9ubWVudC10d2Vhay5qc1wiLFxuXHRcImNvbXBvbmVudHMvb24tZXZlbnQtc2V0LmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9vbi1ldmVudC1zZXQuanNcIixcblx0XCJjb21wb25lbnRzL3JhbmRvbS1wb3NpdGlvbi5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvcmFuZG9tLXBvc2l0aW9uLmpzXCIsXG5cdFwiY29tcG9uZW50cy9zaW1wbGUtbmF2bWVzaC1jb25zdHJhaW50cy5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvc2ltcGxlLW5hdm1lc2gtY29uc3RyYWludHMuanNcIixcblx0XCJjb21wb25lbnRzL3NwYXducG9pbnQuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3NwYXducG9pbnQuanNcIixcblx0XCJjb21wb25lbnRzL3Rocm93LWJhbGwuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3Rocm93LWJhbGwuanNcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvY29tcG9uZW50cyBzeW5jIFxcXFwuanMkXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJmdW5jdGlvbiBpbXBvcnRBbGwocikge1xyXG4gICAgci5rZXlzKCkuZm9yRWFjaChyKTtcclxuICB9XHJcbiAgXHJcbiAgaW1wb3J0QWxsKHJlcXVpcmUuY29udGV4dCgnLi9jb21wb25lbnRzJywgZmFsc2UsIC9cXC5qcyQvKSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9