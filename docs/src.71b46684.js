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
})({10:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MAP = {
  // for creating mapboxgl.Map(). container defaults to 'map'
  style: 'mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x',
  zoom: 9.18,
  center: [-85.49304, 10.891421]
};

var ACCESS_TOKEN = 'pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww';

exports.default = {
  LAYER_ID: 'turismo',
  SOURCE_LAYER: 'Turismo',
  FLY_TO_ZOOM_LEVEL: 12,
  ANIMATION_DURATION: 2000,
  MAP: MAP,
  ACCESS_TOKEN: ACCESS_TOKEN,
  TYPES: [{
    name: 'biological',
    label: 'Biological'
  }, {
    name: 'tourist',
    label: 'Touristo'
  }]
};
},{}],11:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (feature) {
  return "<div class=\"popup-header\">\n    <h3>" + feature.properties.Estación + "</h3>\n    <div class=\"popup-image\">\n      <img\n        src=\"" + feature.properties.Image + "\"\n        alt=\"Image del Estaci\xF3n " + feature.properties.Estación + "\"\n      />\n    </div>\n  </div>\n  <div class=\"popup-content\">\n    <div class=\"popup-description\">\n      <p>" + feature.properties.description + "</p>\n    </div>\n    <a\n      class=\"popup-button\"\n      href=\"" + feature.properties.link + "\"\n      target=\"_new\"\n      >\n      M\xE1s informac\xEDon\n    </a>\n  </div>\n  ";
};
},{}],6:[function(require,module,exports) {
'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _popup = require('./components/popup');

var _popup2 = _interopRequireDefault(_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACCESS_TOKEN = _config2.default.ACCESS_TOKEN,
    MAP = _config2.default.MAP,
    SOURCE_LAYER = _config2.default.SOURCE_LAYER,
    TYPES = _config2.default.TYPES,
    LAYER_ID = _config2.default.LAYER_ID,
    FLY_TO_ZOOM_LEVEL = _config2.default.FLY_TO_ZOOM_LEVEL,
    ANIMATION_DURATION = _config2.default.ANIMATION_DURATION;


var DEFAULT_MAP = {
  container: 'map',
  center: [-85.49304, 10.891421],
  zoom: 9.18
};

mapboxgl.accessToken = ACCESS_TOKEN;

// instantiate the map instance
var map = new mapboxgl.Map(
// Set defaults, allow the config to override
Object.assign(DEFAULT_MAP, MAP));

window.exampleMap = map;

// MARKERS

var createMarker = function createMarker(feature, className) {
  return new mapboxgl.Marker(getMarkerElement(feature, className)).setLngLat(feature.geometry.coordinates).addTo(map);
};

// make a marker for each feature and add to the map
var createMarkers = function createMarkers(features, className) {
  return features.map(function (feature) {
    return createMarker(feature, className);
  });
};

// Generate the marker element on the fly in the DOM, using createElement
var getMarkerElement = function getMarkerElement(feature, className) {
  // create a HTML element for each feature
  var markerElement = document.createElement('div');
  // append default marker classname to provided class name
  markerElement.className = 'marker ' + className;

  return markerElement;
};

// LEGEND ITEMS

var createLegendItem = function createLegendItem(symbolType) {
  var div = document.createElement('div');
  var span = document.createElement('span');
  var labelSpan = document.createElement('span');
  span.className = 'marker ' + symbolType.name + '-marker';
  labelSpan.innerHTML = symbolType.label || 'No label specified';
  div.appendChild(span);
  div.appendChild(labelSpan);
  document.getElementById('legend-items').appendChild(div);
};

// HANDLE POPUPS

var popup = new mapboxgl.Popup();

// Create a mapboxgl.Popup from the default popup component.
var showPopup = function showPopup(feature) {
  popup.setLngLat(feature.geometry.coordinates).setHTML((0, _popup2.default)(feature)).addTo(map);
  popup.on('close', function (e) {
    map.flyTo({
      center: DEFAULT_MAP.center,
      zoom: DEFAULT_MAP.zoom,
      duration: ANIMATION_DURATION
    });
  });

  return popup;
};

// HANDLE MAP EVENTS

map.on('click', LAYER_ID, function (e) {
  var feature = e.features[0];
  setTimeout(function () {
    map.flyTo({
      center: feature.geometry.coordinates,
      zoom: FLY_TO_ZOOM_LEVEL,
      duration: ANIMATION_DURATION
    });
    showPopup(feature);
  }, 200);
});
// HANDLE MAP LOAD

// Retrieve the source feature data from mapbox
var getFeatures = function getFeatures(symbolType) {
  return map.querySourceFeatures('composite', {
    sourceLayer: SOURCE_LAYER,
    filter: ['==', 'symbol', symbolType]
  });
};

// When the map loads, generate the markers
map.on('load', function () {
  var featureData = TYPES && TYPES.map(function (symbolType) {
    var features = getFeatures(symbolType.name);
    createLegendItem(symbolType);

    // get the feature featureData and then create markers
    // return createMarkers(features, `${symbolType.name}-marker`);
  });
});
},{"./config":10,"./components/popup":11}],18:[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '63173' + '/');
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
},{}]},{},[18,6], null)
//# sourceMappingURL=/src.71b46684.map