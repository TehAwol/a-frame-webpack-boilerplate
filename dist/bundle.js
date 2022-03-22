/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/collision-ball.js":
/*!******************************************!*\
  !*** ./src/components/collision-ball.js ***!
  \******************************************/
/***/ (() => {

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
	"./on-event-set.js": "./src/components/on-event-set.js",
	"./random-position.js": "./src/components/random-position.js",
	"./spawnpoint.js": "./src/components/spawnpoint.js",
	"./throw-ball.js": "./src/components/throw-ball.js",
	"components/collision-ball.js": "./src/components/collision-ball.js",
	"components/emit-when-near.js": "./src/components/emit-when-near.js",
	"components/entity-generator.js": "./src/components/entity-generator.js",
	"components/on-event-set.js": "./src/components/on-event-set.js",
	"components/random-position.js": "./src/components/random-position.js",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFVBQVU7QUFDVixtRkFBbUYsUUFBUTtBQUMzRjtBQUNBO0FBQ0EsMEJBQTBCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTTtBQUNsRDtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7OztBQ25IRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7QUN2Q0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDbkNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBOzs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1EQUErQyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy9jb2xsaXNpb24tYmFsbC5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL2VtaXQtd2hlbi1uZWFyLmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvZW50aXR5LWdlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL29uLWV2ZW50LXNldC5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3JhbmRvbS1wb3NpdGlvbi5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3NwYXducG9pbnQuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy90aHJvdy1iYWxsLmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHN8c3luY3xub25yZWN1cnNpdmV8Ly5qcyQiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnY29sbGlzaW9uLWJhbGwnLCB7XHJcbiAgICBtdWx0aXBsZTogdHJ1ZSxcclxuICBcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLl9vbkV2ZW50ID0gdGhpcy5fb25FdmVudC5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbGxpZGVzdGFydCcsIHRoaXMuX29uRXZlbnQpO1xyXG4gICAgfSxcclxuICBcclxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmRhdGEuZXZlbnQsIHRoaXMuX29uRXZlbnQpO1xyXG4gICAgfSxcclxuICBcclxuICAgIF9vbkV2ZW50OiBmdW5jdGlvbihldnQpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZXZ0LmRldGFpbC50YXJnZXRFbC5pZFxyXG4gICAgICAgIGlmICh0YXJnZXQgPT09ICdzd29yZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWwpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGdvdCBhIGhpdCcpXHJcbiAgICAgICAgICAgIC8vIEFkZCB0YXJnZXQgaGl0IGxvZ2ljXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIFxyXG4gIH0pOyIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZW1pdC13aGVuLW5lYXInLCB7XHJcbiAgc2NoZW1hOiB7XHJcbiAgICB0YXJnZXQ6IHt0eXBlOiAnc2VsZWN0b3InLCBkZWZhdWx0OiAnI2NhbWVyYS1yaWcnfSxcclxuICAgIGRpc3RhbmNlOiB7dHlwZTogJ251bWJlcicsIGRlZmF1bHQ6IDF9LFxyXG4gICAgZXZlbnQ6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ2NsaWNrJ30sXHJcbiAgICBldmVudEZhcjoge3R5cGU6ICdzdHJpbmcnLCBkZWZhdWx0OiAndW5jbGljayd9LFxyXG4gICAgdGhyb3R0bGU6IHt0eXBlOiAnbnVtYmVyJywgZGVmYXVsdDogMTAwfSxcclxuICB9LFxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudGljayA9IEFGUkFNRS51dGlscy50aHJvdHRsZVRpY2sodGhpcy5jaGVja0Rpc3QsIHRoaXMuZGF0YS50aHJvdHRsZSwgdGhpcyk7XHJcbiAgICB0aGlzLmVtaXRpbmcgPSBmYWxzZTtcclxuICB9LFxyXG4gIGNoZWNrRGlzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG15UG9zID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCk7XHJcbiAgICBsZXQgdGFyZ2V0UG9zID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCk7XHJcbiAgICB0aGlzLmVsLm9iamVjdDNELmdldFdvcmxkUG9zaXRpb24obXlQb3MpO1xyXG4gICAgdGhpcy5kYXRhLnRhcmdldC5vYmplY3QzRC5nZXRXb3JsZFBvc2l0aW9uKHRhcmdldFBvcyk7XHJcbiAgICBjb25zdCBkaXN0YW5jZVRvID0gbXlQb3MuZGlzdGFuY2VUbyh0YXJnZXRQb3MpO1xyXG4gICAgaWYgKGRpc3RhbmNlVG8gPD0gdGhpcy5kYXRhLmRpc3RhbmNlKSB7XHJcbiAgICAgIGlmICh0aGlzLmVtaXRpbmcpIHJldHVybjtcclxuICAgICAgdGhpcy5lbWl0aW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy5lbC5lbWl0KHRoaXMuZGF0YS5ldmVudCwge2NvbGxpZGluZ0VudGl0eTogdGhpcy5kYXRhLnRhcmdldH0sIGZhbHNlKTtcclxuICAgICAgdGhpcy5kYXRhLnRhcmdldC5lbWl0KHRoaXMuZGF0YS5ldmVudCwge2NvbGxpZGluZ0VudGl0eTogdGhpcy5lbH0sIGZhbHNlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghdGhpcy5lbWl0aW5nKSByZXR1cm47XHJcbiAgICAgIHRoaXMuZWwuZW1pdCh0aGlzLmRhdGEuZXZlbnRGYXIsIHtjb2xsaWRpbmdFbnRpdHk6IHRoaXMuZGF0YS50YXJnZXR9LCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuZGF0YS50YXJnZXQuZW1pdCh0aGlzLmRhdGEuZXZlbnRGYXIsIHtjb2xsaWRpbmdFbnRpdHk6IHRoaXMuZWx9LCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuZW1pdGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZW50aXR5LWdlbmVyYXRvcicsIHtcclxuICAgIHNjaGVtYToge1xyXG4gICAgICBtaXhpbjoge2RlZmF1bHQ6ICcnfSxcclxuICAgICAgbnVtOiB7ZGVmYXVsdDogMTB9XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIC8vICAgY29uc3QgdGltZW91dCA9IG1zID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgbXMpKVxyXG4gICAgICAvLyBDcmVhdGUgZW50aXRpZXMgd2l0aCBzdXBwbGllZCBtaXhpbi5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLm51bTsgaSsrKSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGVudGl0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EtZW50aXR5Jyk7XHJcbiAgICAgICAgICAgIGVudGl0eS5zZXRBdHRyaWJ1dGUoJ21peGluJywgZGF0YS5taXhpbik7XHJcbiAgICAgICAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoZW50aXR5KTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGVudGl0eS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnYm9keS1sb2FkZWQnKSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LCAyMDAwKmkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7IiwiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdvbi1ldmVudC1zZXQnLCB7XHJcbiAgbXVsdGlwbGU6IHRydWUsXHJcblxyXG4gIHNjaGVtYToge1xyXG4gICAgZXZlbnQ6IHt0eXBlOiAnc3RyaW5nJywgZGVmYXVsdDogJ2NsaWNrJ30sXHJcbiAgICBhdHRyaWJ1dGU6IHt0eXBlOiAnc3RyaW5nJ30sXHJcbiAgICB2YWx1ZToge3R5cGU6ICdzdHJpbmcnfVxyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fb25FdmVudCA9IHRoaXMuX29uRXZlbnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRhdGEuZXZlbnQsIHRoaXMuX29uRXZlbnQpO1xyXG4gIH0sXHJcblxyXG4gIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5kYXRhLmV2ZW50LCB0aGlzLl9vbkV2ZW50KTtcclxuICB9LFxyXG5cclxuICBfb25FdmVudDogZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICBBRlJBTUUudXRpbHMuZW50aXR5LnNldENvbXBvbmVudFByb3BlcnR5KHRoaXMuZWwsIHRoaXMuZGF0YS5hdHRyaWJ1dGUsIHRoaXMuZGF0YS52YWx1ZSk7XHJcbiAgfVxyXG5cclxufSk7IiwiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdyYW5kb20tcG9zaXRpb24nLCB7XHJcbiAgICBzY2hlbWE6IHtcclxuICAgICAgbWluOiB7ZGVmYXVsdDoge3g6IC0xMCwgeTogLTEwLCB6OiAtMTB9LCB0eXBlOiAndmVjMyd9LFxyXG4gICAgICBtYXg6IHtkZWZhdWx0OiB7eDogMTAsIHk6IDEwLCB6OiAxMH0sIHR5cGU6ICd2ZWMzJ31cclxuICAgIH0sXHJcbiAgXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgIHZhciBtYXggPSBkYXRhLm1heDtcclxuICAgICAgdmFyIG1pbiA9IGRhdGEubWluO1xyXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCB7XHJcbiAgICAgICAgeDogTWF0aC5yYW5kb20oKSAqIChtYXgueCAtIG1pbi54KSArIG1pbi54LFxyXG4gICAgICAgIHk6IE1hdGgucmFuZG9tKCkgKiAobWF4LnkgLSBtaW4ueSkgKyBtaW4ueSxcclxuICAgICAgICB6OiBNYXRoLnJhbmRvbSgpICogKG1heC56IC0gbWluLnopICsgbWluLnpcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgLyoqXHJcbiAgICogU2V0IHJhbmRvbSBwb3NpdGlvbiB3aXRoaW4gc3BoZXJpY2FsIGJvdW5kcy5cclxuICAgKi9cclxuICBBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ3JhbmRvbS1zcGhlcmljYWwtcG9zaXRpb24nLCB7XHJcbiAgICBzY2hlbWE6IHtcclxuICAgICAgcmFkaXVzOiB7ZGVmYXVsdDogMTB9LFxyXG4gICAgICBzdGFydFg6IHtkZWZhdWx0OiAwfSxcclxuICAgICAgbGVuZ3RoWDoge2RlZmF1bHQ6IDM2MH0sXHJcbiAgICAgIHN0YXJ0WToge2RlZmF1bHQ6IDB9LFxyXG4gICAgICBsZW5ndGhZOiB7ZGVmYXVsdDogMzYwfVxyXG4gICAgfSxcclxuICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICBcclxuICAgICAgdmFyIHhBbmdsZSA9IFRIUkVFLk1hdGguZGVnVG9SYWQoTWF0aC5yYW5kb20oKSAqIGRhdGEubGVuZ3RoWCArIGRhdGEuc3RhcnRYKTtcclxuICAgICAgdmFyIHlBbmdsZSA9IFRIUkVFLk1hdGguZGVnVG9SYWQoTWF0aC5yYW5kb20oKSAqIGRhdGEubGVuZ3RoWSArIGRhdGEuc3RhcnRZKTtcclxuICBcclxuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywge1xyXG4gICAgICAgIHg6IGRhdGEucmFkaXVzICogTWF0aC5jb3MoeEFuZ2xlKSAqIE1hdGguc2luKHlBbmdsZSksXHJcbiAgICAgICAgeTogZGF0YS5yYWRpdXMgKiBNYXRoLnNpbih4QW5nbGUpICogTWF0aC5zaW4oeUFuZ2xlKSxcclxuICAgICAgICB6OiBkYXRhLnJhZGl1cyAqIE1hdGguY29zKHlBbmdsZSlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgLyoqXHJcbiAgICogU2V0IHJhbmRvbSByb3RhdGlvbiB3aXRoaW4gYm91bmRzLlxyXG4gICAqL1xyXG4gIEFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgncmFuZG9tLXJvdGF0aW9uJywge1xyXG4gICAgc2NoZW1hOiB7XHJcbiAgICAgIG1pbjoge2RlZmF1bHQ6IHt4OiAwLCB5OiAwLCB6OiAwfSwgdHlwZTogJ3ZlYzMnfSxcclxuICAgICAgbWF4OiB7ZGVmYXVsdDoge3g6IDM2MCwgeTogMzYwLCB6OiAzNjB9LCB0eXBlOiAndmVjMyd9XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICB2YXIgbWF4ID0gZGF0YS5tYXg7XHJcbiAgICAgIHZhciBtaW4gPSBkYXRhLm1pbjtcclxuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3JvdGF0aW9uJywge1xyXG4gICAgICAgIHg6IE1hdGgucmFuZG9tKCkgKiBtYXgueCArIG1pbi54LFxyXG4gICAgICAgIHk6IE1hdGgucmFuZG9tKCkgKiBtYXgueSArIG1pbi55LFxyXG4gICAgICAgIHo6IE1hdGgucmFuZG9tKCkgKiBtYXgueiArIG1pbi56XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pOyIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnc3Bhd25wb2ludCcsIHtcclxuICAgIG11bHRpcGxlOiB0cnVlLFxyXG4gICAgc2NoZW1hOiB7XHJcbiAgICAgICAgc2l6ZToge2RlZmF1bHQ6IDEwLCB0eXBlOiAnaW50J30sXHJcbiAgICAgICAgcGF0dGVybjoge2RlZmF1bHQ6ICdyYW5kb20nLCB0eXBlOiAnc3RyaW5nJ30sXHJcbiAgICAgICAgb3JpZ2luOiB7ZGVmYXVsdDoge3g6IDAsIHk6IDAsIHo6IDB9LCB0eXBlOiAndmVjMyd9LFxyXG4gICAgICAgIHJhZGl1czoge2RlZmF1bHQ6IDEwLCB0eXBlOiAnaW50J30sXHJcbiAgICAgICAgZW5hYmxlWToge2RlZmF1bHQ6IGZhbHNlLCB0eXBlOiAnYm9vbGVhbid9LFxyXG4gICAgICAgIHJhdGU6IHtkZWZhdWx0OiAwLCB0eXBlOiAnaW50J31cclxuICAgIH0sXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBUT0RPIG9wZW4gc3BhY2UgaW4gdGhlIHBvb2wgdmlhIGV2ZW50c1xyXG4gICAgICAgIGxldCBhY3RpdmVFbnRpdGllcyA9IDA7XHJcbiAgICAgICAgLy8gU2VsZWN0IGEtc2NlbmVcclxuICAgICAgICBjb25zdCBzY2VuZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYS1zY2VuZScpO1xyXG4gICAgICAgIC8vIENyZWF0ZSBhIHBvb2xcclxuICAgICAgICBjb25zdCBwb29sID0gYHBvb2xfXyR7dGhpcy5pZH1gO1xyXG4gICAgICAgIHNjZW5lRWwuc2V0QXR0cmlidXRlKHBvb2wsIGBtaXhpbjogJHt0aGlzLmlkfTsgc2l6ZTogJHt0aGlzLmRhdGEuc2l6ZX1gKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnJhdGUgPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIFNwYXduIGVudGl0aWVzIG9uIGludGVydmFsXHJcbiAgICAgICAgICAgIGNvbnN0IHNwYXduSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBQb29sIGZ1bGwsIHN0b3AgaW50ZXJ2YWxcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVFbnRpdGllcyA9PT0gdGhpcy5kYXRhLnNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHNwYXduSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25FbnRpdHkoc2NlbmVFbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjZW5lRWwuY29tcG9uZW50c1twb29sXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYXR0ZXJuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLm9yaWdpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5yYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuZW5hYmxlWSk7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVFbnRpdGllcysrO1xyXG4gICAgICAgICAgICB9LCB0aGlzLmRhdGEucmF0ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gU3Bhd24gYWxsIGVudGl0aWVzIGluIHBvb2xcclxuICAgICAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMuZGF0YS5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25FbnRpdHkoc2NlbmVFbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjZW5lRWwuY29tcG9uZW50c1twb29sXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYXR0ZXJuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLm9yaWdpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5yYWRpdXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuZW5hYmxlWSk7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVFbnRpdGllcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICAqICBzcGF3bkVudGl0eVxyXG4gICAgICAqXHJcbiAgICAgICogIFNwYXduIGFuIGVudGl0eSBhcyBhIGNoaWxkXHJcbiAgICAgICpcclxuICAgICAgKiAgcGFyZW50RWw6IFRoZSBlbnRpdHkgdG8gaG9zdCB0aGUgc3Bhd25lZCBlbnRpdGllc1xyXG4gICAgICAqICBwb29sOiBUaGUgQS1GcmFtZSBwb29sIGZvciB0aGUgc3Bhd25lZCBlbnRpdHlcclxuICAgICAgKiAgcGF0dGVybjogU1BBV05fUEFUVEVSTiBmbGFnXHJcbiAgICAgICogIG9yaWdpbjogcG9zaXRpb24gdmVjMy4gT3JpZ2luIG9mIHRoZSBzcGF3biBwYXR0ZXJuXHJcbiAgICAgICogIHJhZGl1czogbnVtYmVyLiBSYWRpdXMgYXJvdW5kIHRoZSBvcmlnaW5cclxuICAgICAgKiAgZW5hYmxlWTogYm9vbGVhbi4gRW5hYmxlIHJhbmRvbSB5LWF4aXNcclxuICAgICAgKi9cclxuICAgIHNwYXduRW50aXR5OiBmdW5jdGlvbihwYXJlbnRFbCwgcG9vbCwgcGF0dGVybiwgb3JpZ2luLCByYWRpdXMsIGVuYWJsZVkpIHtcclxuICAgICAgICAvLyBHZXQgZW50aXR5IGZyb20gcG9vbFxyXG4gICAgICAgIGNvbnN0IHNwYXduRW50aXR5ID0gcG9vbC5yZXF1ZXN0RW50aXR5KCk7XHJcbiAgICAgICAgLy8gR2VuZXJhdGUgYSBzcGF3biBwb3NpdGlvbiBiYXNlZCBvbiBzZXR0aW5nc1xyXG4gICAgICAgIGNvbnN0IHNwYXduUG9zaXRpb24gPSB0aGlzLnNwYXduUG9zaXRpb24ocGF0dGVybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZVkpO1xyXG4gICAgICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKHNwYXduRW50aXR5KTtcclxuICAgICAgICAvLyBNdXN0IHNldCBhdHRyaWJ1dGVzIGFmdGVyIGFkZGluZyB0byBzY2VuZVxyXG4gICAgICAgIC8vIFNldCBwb3NpdGlvblxyXG4gICAgICAgIHNwYXduRW50aXR5LnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBzcGF3blBvc2l0aW9uKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgICogIHNwYXduUG9zaXRpb25cclxuICAgICAgKlxyXG4gICAgICAqICBDcmVhdGUgYSBwb3NpdGlvbiB3aGVyZSBhbiBlbnRpdHkgd2lsbCBzcGF3blxyXG4gICAgICAqXHJcbiAgICAgICogIHBhdHRlcm46IFNQQVdOX1BBVFRFUk4gZmxhZ1xyXG4gICAgICAqICBvcmlnaW46IHBvc2l0aW9uIHZlYzMuIE9yaWdpbiBvZiB0aGUgc3Bhd24gcGF0dGVyblxyXG4gICAgICAqICByYWRpdXM6IG51bWJlci4gUmFkaXVzIGFyb3VuZCB0aGUgb3JpZ2luXHJcbiAgICAgICogIGVuYWJsZVk6IGJvb2xlYW4uIEVuYWJsZSByYW5kb20geS1heGlzXHJcbiAgICAgICpcclxuICAgICAgKiAgUmV0dXJucyBhIHBvc2l0aW9uIHN0cmluZyB3aGVyZSB0aGUgZW50aXR5IHdpbGwgc3Bhd25cclxuICAgICAgKlxyXG4gICAgICAqL1xyXG4gICAgc3Bhd25Qb3NpdGlvbjogZnVuY3Rpb24ocGF0dGVybiwgb3JpZ2luLCByYWRpdXMsIGVuYWJsZVkpIHtcclxuICAgICAgICAvLyBVc2Ugb2JqZWN0IGZvciBlYXNpZXIgbWFuaXB1bGF0aW9uXHJcbiAgICAgICAgbGV0IHBvcyA9IHt4OiAwLCB5OiAwLCB6OiAwfTtcclxuICAgICAgICAvLyBSYW5kb20gcG9zaXRpb25pbmdcclxuICAgICAgICBpZiAocGF0dGVybiA9PT0gU1BBV05fUEFUVEVSTi5SQU5ET00pIHtcclxuICAgICAgICAgICAgLy8gUmFuZG9tIGZ1bmN0aW9uOiBQb3NpdGl2ZSBvciBuZWdhdGl2ZSBkaXJlY3Rpb24sIHdpdGhpbiBhIHJhbmdlLCBmcm9tIHRoZSBvcmlnaW5cclxuICAgICAgICAgICAgcG9zLnggPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKT09PSAxID8gMSA6IC0xKVxyXG4gICAgICAgICAgICAgICAgICAqIChNYXRoLnJhbmRvbSgpICogcmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgICArIG9yaWdpbi54O1xyXG4gICAgICAgICAgICAvLyBFbmFibGUgeS1heGlzXHJcbiAgICAgICAgICAgIGlmIChlbmFibGVZKSB7XHJcbiAgICAgICAgICAgICAgICBwb3MueSA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpPT09IDEgPyAxIDogLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAqIChNYXRoLnJhbmRvbSgpICogcmFkaXVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgKyBvcmlnaW4ueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwb3MueiA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpPT09IDEgPyAxIDogLTEpXHJcbiAgICAgICAgICAgICAgICAgICogKE1hdGgucmFuZG9tKCkgKiByYWRpdXMpXHJcbiAgICAgICAgICAgICAgICAgICsgb3JpZ2luLno7XHJcbiAgICAgICAgLy8gRXZlbmx5IHNwYWNlZCBwb3NpdGlvbmluZ1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhLnBhdHRlcm4gPT09IFNQQVdOX1BBVFRFUk4uRVZFTikge1xyXG4gICAgICAgICAgICAvLyBUT0RPIEV2ZW5seSBzcGFjZWQgd2l0aGluIGEgcmFuZ2VcclxuICAgICAgICAvLyBIYW5kbGUgYmFkIHBhdHRlcm4gbmFtZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignYWZyYW1lLXNwYXducG9pbnQtY29tcG9uZW50OicsIGBJbnZhbGlkIHNwYXduIHBhdHRlcm4gXCIke3BhdHRlcm59XCJgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUmV0dXJuIGEgc3Bhd24gcG9zaXRpb25cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBgJHtwb3MueH0gJHtwb3MueX0gJHtwb3Muen1gO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn0pOyIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgndGhyb3ctYmFsbCcsIHtcclxuICBtdWx0aXBsZTogdHJ1ZSxcclxuXHJcbiAgc2NoZW1hOiB7XHJcbiAgICB0YXJnZXQ6IHtcclxuICAgICAgdHlwZTogJ3NlbGVjdG9yJyxcclxuICAgICAgZGVmYXVsdDogJyNjYW1lcmEtcmlnJ1xyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICB0aGlzLnZlY3RvcjIgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgdGhpcy5fb25FdmVudCA9IHRoaXMuX29uRXZlbnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignYm9keS1sb2FkZWQnLCB0aGlzLl9vbkV2ZW50KTtcclxuICB9LFxyXG5cclxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYm9keS1sb2FkZWQnLCB0aGlzLl9vbkV2ZW50KTtcclxuICB9LFxyXG5cclxuICBfb25FdmVudDogZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgY29uc29sZS5sb2coNDIpO1xyXG4gICAgLy8gR2V0IHBvc2l0aW9uIHZlY3RvcnNcclxuICAgIHRoaXMuZWwuc2NlbmVFbC5jYW1lcmEuZ2V0V29ybGRQb3NpdGlvbih0aGlzLnZlY3Rvcik7XHJcbiAgICB0aGlzLmVsLm9iamVjdDNELmdldFdvcmxkUG9zaXRpb24odGhpcy52ZWN0b3IyKVxyXG4gICAgLy8gR2VuZXJhdGUgbmV3IHZlY3RvciBhbmQgYWltIGF0IGNhbWVyYVxyXG4gICAgdGhpcy52ZWN0b3IyLnN1Yih0aGlzLnZlY3RvcilcclxuICAgIHRoaXMuZWwub2JqZWN0M0QubG9va0F0KHRoaXMudmVjdG9yKTtcclxuICAgIHRoaXMudmVjdG9yMi5uZWdhdGUoKTtcclxuICAgIC8vIEFwcGx5IGZvcmNlIHNjYWxlZCBmb3JjZSB0byBlbnRpdHlcclxuICAgIGNvbnN0IGZvcmNlID0gbmV3IEFtbW8uYnRWZWN0b3IzKHRoaXMudmVjdG9yMi54KjI1LCB0aGlzLnZlY3RvcjIueSoyNSwgdGhpcy52ZWN0b3IyLnoqMjUgKTtcclxuICAgIGNvbnN0IHBvcyA9IG5ldyBBbW1vLmJ0VmVjdG9yMyh0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uKTtcclxuICAgIHRoaXMuZWwuYm9keS5hcHBseUZvcmNlKGZvcmNlLCBwb3MpO1xyXG4gICAgLy8gTWVtb3J5IG9wdGlcclxuICAgIEFtbW8uZGVzdHJveShmb3JjZSk7XHJcbiAgICBBbW1vLmRlc3Ryb3kocG9zKTtcclxuICB9XHJcblxyXG59KTsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vY29sbGlzaW9uLWJhbGwuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2NvbGxpc2lvbi1iYWxsLmpzXCIsXG5cdFwiLi9lbWl0LXdoZW4tbmVhci5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvZW1pdC13aGVuLW5lYXIuanNcIixcblx0XCIuL2VudGl0eS1nZW5lcmF0b3IuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2VudGl0eS1nZW5lcmF0b3IuanNcIixcblx0XCIuL29uLWV2ZW50LXNldC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvb24tZXZlbnQtc2V0LmpzXCIsXG5cdFwiLi9yYW5kb20tcG9zaXRpb24uanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3JhbmRvbS1wb3NpdGlvbi5qc1wiLFxuXHRcIi4vc3Bhd25wb2ludC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvc3Bhd25wb2ludC5qc1wiLFxuXHRcIi4vdGhyb3ctYmFsbC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvdGhyb3ctYmFsbC5qc1wiLFxuXHRcImNvbXBvbmVudHMvY29sbGlzaW9uLWJhbGwuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2NvbGxpc2lvbi1iYWxsLmpzXCIsXG5cdFwiY29tcG9uZW50cy9lbWl0LXdoZW4tbmVhci5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvZW1pdC13aGVuLW5lYXIuanNcIixcblx0XCJjb21wb25lbnRzL2VudGl0eS1nZW5lcmF0b3IuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL2VudGl0eS1nZW5lcmF0b3IuanNcIixcblx0XCJjb21wb25lbnRzL29uLWV2ZW50LXNldC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvb24tZXZlbnQtc2V0LmpzXCIsXG5cdFwiY29tcG9uZW50cy9yYW5kb20tcG9zaXRpb24uanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3JhbmRvbS1wb3NpdGlvbi5qc1wiLFxuXHRcImNvbXBvbmVudHMvc3Bhd25wb2ludC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvc3Bhd25wb2ludC5qc1wiLFxuXHRcImNvbXBvbmVudHMvdGhyb3ctYmFsbC5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvdGhyb3ctYmFsbC5qc1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9jb21wb25lbnRzIHN5bmMgXFxcXC5qcyRcIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsImZ1bmN0aW9uIGltcG9ydEFsbChyKSB7XHJcbiAgICByLmtleXMoKS5mb3JFYWNoKHIpO1xyXG4gIH1cclxuICBcclxuICBpbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KCcuL2NvbXBvbmVudHMnLCBmYWxzZSwgL1xcLmpzJC8pKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=