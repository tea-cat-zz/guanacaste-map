// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({9:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (feature) {
  return "<div class=\"popup-header\">\n    <h3>\n        <a\n          href=\"" + feature.properties.link + "\"\n          >\n          " + feature.properties.Estación + "\n        </a>\n    </h3>\n    <div class=\"popup-image\">\n        <a\n          href=\"" + feature.properties.link + "\"\n          >\n          <img\n            src=\"" + feature.properties.Image + "\"\n            alt=\"Image del Estaci\xF3n " + feature.properties.Estación + "\"\n          />\n        </a>\n      \n    </div>\n  </div>\n  <div class=\"popup-content\">\n    <div class=\"popup-description\">\n      <p>" + feature.properties.description + "</p>\n    </div>\n    <a\n      class=\"popup-button\"\n      href=\"" + feature.properties.link + "\"\n      >\n      M\xE1s informac\xEDon\n    </a>\n  </div>\n  ";
};
},{}],10:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (allLayers) {
  return '<div class="flex-child">\n\t    <h4 class="overlay-box toggle-button" onClick="tcat.toggleLegend()">Puestos Estaci\xF3nes y Tourismos</h4>\n\t\t\t<div id="legend-items" class="overlay-box toggle-content">\n          ' + allLayers.map(function (layer) {
    return '<div class="legend-item active" id="' + layer.name + '" onClick="tcat.handleFilter(\'' + layer.name + '\', \'' + (layer.type || 'symbol') + '\', ' + (layer.layerId ? '\'' + layer.layerId + '\'' : null) + ')">\n                  <span class="legend-key" style="background-color: ' + layer.color + '"></span>\n                  <span class="label">' + layer.label + '</span>\n                </div>';
  }).join('') + '\n\n\t\t\t</div>\n      <div id="legend-footer" class="overlay-box toggle-content">\n        <div onClick="tcat.noFilter()">Ver Todo</div>\n      </div>\n\t</div>';
};
},{}],8:[function(require,module,exports) {
var MAP = {
  // for creating mapboxgl.Map(). container defaults to 'map'
  style: 'mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x',
  center: [-85.61365526723557, 10.838261234356153],
  zoom: 9.619976883678385
  //"sprite": "mapbox://sprites/mapbox/bright-v8"
};

var ACCESS_TOKEN = 'pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww';

module.exports = {
  LAYER_ID: 'toggle-turismo',
  SYMBOL_LAYERS: ['toggle-turismo', 'toggle-ecosistemas'],
  //FLY_TO_ZOOM_LEVEL: 9.619976883678385,
  ANIMATION_DURATION: 2000,
  LEGEND_TITLE: 'Puestos Estaciónes y Tourismos',
  ACCESS_TOKEN: ACCESS_TOKEN,
  MAP: MAP,
  SOURCE_TYPES: [{
    name: 'biological',
    layerId: 'toggle-turismo',
    label: 'Biological'
  }, {
    layerId: 'toggle-turismo',
    name: 'tourist',
    label: 'Touristo'
  }],
  LAYERS: {
    'toggle-turismo': { label: 'Turismo', color: '#CCCC00' },
    'toggle-unesco': { label: 'UNESCO', color: '#CCCC00' },
    'toggle-sectores': { label: 'Sectores', color: '#449438' },
    'toggle-ecosistemas': { label: 'Ecosistemas', color: '#000000' }
  }
};
},{}],6:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVisibleLayers = undefined;

var _config = require('./config');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getVisibleLayers = exports.getVisibleLayers = function getVisibleLayers(layerList) {
  return layerList.filter(function (_ref) {
    var id = _ref.id;
    return id.substring(0, 7) === 'toggle-';
  }).reduce(function (agg, layer) {
    var result = _defineProperty({}, layer.id, true);
    if (layer.id === 'toggle-turismo') {
      result[layer.id] = _config.SOURCE_TYPES.filter(function (_ref2) {
        var layerId = _ref2.layerId;
        return layerId === layer.id;
      }).reduce(function (agg, _ref3) {
        var name = _ref3.name;
        return Object.assign(_defineProperty({}, name, true), agg);
      }, {});
    }
    return Object.assign(result, agg);
  }, {});
};
},{"./config":8}],24:[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],21:[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":24}],7:[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../svg/park-11.svg":[["park-11.2b9fa686.svg",19],19],"_css_loader":21}],4:[function(require,module,exports) {
'use strict';

var _popup = require('./components/popup');

var _popup2 = _interopRequireDefault(_popup);

var _legend = require('./components/legend');

var _legend2 = _interopRequireDefault(_legend);

var _utils = require('./utils');

require('../assets/styles/index.scss');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* global mapboxgl */
/* eslint-disable no-irregular-whitespace */

var DEFAULT_MAP = {
  container: 'map',
  style: 'mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x',
  center: [-85.61365526723557, 10.838261234356153],
  zoom: 9.619976883678385
};
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww';

// instantiate the map instance
var map = new mapboxgl.Map(
// Set defaults, allow the config to override
Object.assign(DEFAULT_MAP, _config.MAP));
// debugging only
// window.map = map;
window.tcat = window.tcat || {};

window.tcat.toggleLegend = function () {
  var legendEl = document.getElementById('legend');
  legendEl.classList.toggle('active');
};

// HANDLE POPUPS

var popup = new mapboxgl.Popup();

// Create a mapboxgl.Popup from the default popup component.
var showPopup = function showPopup(feature) {
  popup.setLngLat(feature.geometry.coordinates).setHTML((0, _popup2.default)(feature)).addTo(map);
  popup.on('close', function () {
    map.flyTo({
      center: DEFAULT_MAP.center,
      duration: _config.ANIMATION_DURATION
    });
  });

  return popup;
};

// HANDLE MAP EVENTS

map.on('click', _config.LAYER_ID, function (e) {
  var feature = e.features[0];
  setTimeout(function () {
    map.flyTo({
      center: feature.geometry.coordinates,
      duration: _config.ANIMATION_DURATION
    });
    showPopup(feature);
  }, 200);
});

//FULL SCREEN MODE

map.addControl(new mapboxgl.FullscreenControl());

// function createLegend() {
//  const legendEl
//}

//Create Compass Button that Flys to Center
function createCompass() {
  var leftEl = document.querySelector('.mapboxgl-ctrl-bottom-left');
  var compass = document.createElement('div');

  compass.innerHTML = '<div class="mapboxgl-ctrl mapboxgl-ctrl-group">\n      <button class="mapboxgl-ctrl-icon mapboxgl-ctrl-compass" type="button" aria-label="Reset North">\u2028\n      <span class="mapboxgl-ctrl-compass-arrow" style="transform: rotate(0deg);"></span>\u2028\n    </button>\u2028\n  </div>';

  compass.onclick = function () {
    map.flyTo({
      center: DEFAULT_MAP.center
    });
  };
  leftEl.appendChild(compass);
}

var visibleLayers = {};

map.on('load', function () {
  var nav = new mapboxgl.NavigationControl({ showCompass: false });
  map.addControl(nav, 'top-left');
  map.scrollZoom.disable();
  createCompass();

  var layerList = map.getStyle().layers;

  visibleLayers = (0, _utils.getVisibleLayers)(layerList);

  var filteredLayers = layerList.filter(function (layer) {
    var layerName = layer.id;
    if (layerName.substring(0, 7) === 'toggle-' && layerName !== 'toggle-turismo') {
      return true;
    }
    return false;
  }).map(function (layer) {
    return {
      name: layer.id,
      label: _config.LAYERS[layer.id] ? _config.LAYERS[layer.id].label : layer.id.substring(7),
      type: 'layer',
      color: _config.LAYERS[layer.id] ? _config.LAYERS[layer.id].color : 'darkgrey'
    };
  });
  var legend = document.getElementById('legend');

  // This is where we combine the symbol layer SOURCE_TYPES with filteredLayers
  legend.innerHTML = (0, _legend2.default)([].concat(_toConsumableArray(_config.SOURCE_TYPES), _toConsumableArray(filteredLayers)));

  // HANDLE MAP LOAD
  window.tcat.handleFilter = function (layerOrSymbolType) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var layerId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    // Toggle Active Class
    var legendItem = document.getElementById(layerOrSymbolType);
    legendItem.classList.toggle('active');
    // If Symbol, toggle for the symbol in the layer filter
    if (type === 'symbol' && layerId) {
      visibleLayers[layerId][layerOrSymbolType] = !visibleLayers[layerId][layerOrSymbolType];

      var activeSymbolLayers = Object.keys(visibleLayers[layerId]).filter(function (key) {
        return visibleLayers[layerId][key];
      });
      if (activeSymbolLayers.length > 0) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      }
      if (activeSymbolLayers.length > 1) {
        return map.setFilter(layerId, ['in', 'symbol'].concat(_toConsumableArray(activeSymbolLayers)));
      }
      if (activeSymbolLayers.length === 1) {
        return map.setFilter(layerId, ['==', 'symbol', activeSymbolLayers[0]]);
      }
      // TODO: Until we figure out how to setFilter of none?
      return map.setLayoutProperty(layerId, 'visibility', 'none');
    }
    visibleLayers[layerOrSymbolType] = !visibleLayers[layerOrSymbolType];
    var isToggledOn = visibleLayers[layerOrSymbolType];

    // Toggle Layers
    map.setLayoutProperty(layerOrSymbolType, 'visibility', isToggledOn ? 'visible' : 'none');
    return;
  };

  window.tcat.noFilter = function () {
    filteredLayers.map(function (layer) {
      return map.setLayoutProperty(layer.name, 'visibility', 'visible');
    });
    filteredLayers.map(function (_ref) {
      var name = _ref.name;
      return map.setFilter(name, null);
    });
    visibleLayers = (0, _utils.getVisibleLayers)(layerList);
    var legend = document.getElementById('legend');
    // This is where we combine the symbol layer SOURCE_TYPES with filteredLayers
    legend.innerHTML = (0, _legend2.default)([].concat(_toConsumableArray(_config.SOURCE_TYPES), _toConsumableArray(filteredLayers)));
  };
});

// Press Command to Scrollzoom
document.body.addEventListener('keydown', function (event) {
  var metaKey = event.metaKey,
      ctrlKey = event.ctrlKey;

  if (metaKey || ctrlKey) {
    map.scrollZoom.enable();
  }
});
document.body.addEventListener('keyup', function (event) {
  var metaKey = event.metaKey,
      ctrlKey = event.ctrlKey;

  if (metaKey || ctrlKey) {
    map.scrollZoom.disable();
  }
});
},{"./components/popup":9,"./components/legend":10,"./utils":6,"../assets/styles/index.scss":7,"./config":8}],26:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '62411' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[26,4], null)
//# sourceMappingURL=/src.71b46684.map