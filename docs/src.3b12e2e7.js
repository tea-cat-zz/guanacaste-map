parcelRequire = (function(e, r, n, t) {
  var i = 'function' == typeof parcelRequire && parcelRequire,
    o = 'function' == typeof require && require;
  function u(n, t) {
    if (!r[n]) {
      if (!e[n]) {
        var f = 'function' == typeof parcelRequire && parcelRequire;
        if (!t && f) return f(n, !0);
        if (i) return i(n, !0);
        if (o && 'string' == typeof n) return o(n);
        var c = new Error("Cannot find module '" + n + "'");
        throw ((c.code = 'MODULE_NOT_FOUND'), c);
      }
      p.resolve = function(r) {
        return e[n][1][r] || r;
      };
      var l = (r[n] = new u.Module(n));
      e[n][0].call(l.exports, p, l, l.exports, this);
    }
    return r[n].exports;
    function p(e) {
      return u(p.resolve(e));
    }
  }
  (u.isParcelRequire = !0),
    (u.Module = function(e) {
      (this.id = e), (this.bundle = u), (this.exports = {});
    }),
    (u.modules = e),
    (u.cache = r),
    (u.parent = i),
    (u.register = function(r, n) {
      e[r] = [
        function(e, r) {
          r.exports = n;
        },
        {}
      ];
    });
  for (var f = 0; f < n.length; f++) u(n[f]);
  if (n.length) {
    var c = u(n[n.length - 1]);
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = c)
      : 'function' == typeof define && define.amd
        ? define(function() {
            return c;
          })
        : t && (this[t] = c);
  }
  return u;
})(
  {
    10: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 });
        var e = {
            style: 'mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x',
            zoom: 9.18,
            center: [-85.49304, 10.891421]
          },
          o =
            'pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww';
        exports.default = {
          MAP: e,
          ACCESS_TOKEN: o,
          SOURCE_LAYER: 'Turismo',
          TYPES: [
            { name: 'biological', label: 'Biological' },
            { name: 'tourist', label: 'Touristo' }
          ]
        };
      },
      {}
    ],
    11: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = function(e) {
            return (
              '<div class="popup-header">\n    <h3>' +
              e.properties.Estación +
              '</h3>\n    <div class="popup-image">\n      <img\n        src="' +
              e.properties.Image +
              '"\n        alt="Image del Estación ' +
              e.properties.Estación +
              '"\n      />\n    </div>\n  </div>\n  <div class="popup-description">\n    <p>' +
              e.properties.description +
              '</p>\n    <a class="popup-button" href="' +
              e.properties.link +
              '">Más informacíon</a>\n  </div>\n  '
            );
          });
      },
      {}
    ],
    6: [
      function(require, module, exports) {
        'use strict';
        var e = require('./config'),
          n = r(e),
          t = require('./components/popup'),
          a = r(t);
        function r(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var o = n.default.ACCESS_TOKEN,
          u = n.default.MAP,
          l = n.default.SOURCE_LAYER,
          m = n.default.TYPES;
        mapboxgl.accessToken = o;
        var c = new mapboxgl.Map(
            Object.assign(u, { container: 'map', center: [-85.49304, 10.891421], zoom: 9.18 }, {})
          ),
          i = function(e) {
            return c.querySourceFeatures('composite', {
              sourceLayer: l,
              filter: ['==', 'symbol', e]
            });
          },
          d = function(e, n) {
            var t = document.createElement('div');
            return (t.className = 'marker ' + n), t;
          },
          p = function(e) {
            return new mapboxgl.Popup().setHTML((0, a.default)(e));
          },
          s = function(e) {
            var n = document.createElement('div'),
              t = document.createElement('span'),
              a = document.createElement('span');
            (t.className = 'marker ' + e.name + '-marker'),
              (a.innerHTML = e.label || 'No label specified'),
              n.appendChild(t),
              n.appendChild(a),
              document.getElementById('legend-items').appendChild(n);
          },
          f = function(e, n) {
            return e.map(function(e) {
              return new mapboxgl.Marker(d(e, n))
                .setLngLat(e.geometry.coordinates)
                .setPopup(p(e))
                .addTo(c);
            });
          };
        c.on('load', function() {
          var e =
            m &&
            m.map(function() {
              var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'biological',
                n = i(e.name);
              return s(e, e.name + '-marker'), f(n, e.name + '-marker');
            });
          e.length === m.length &&
            console.log(
              e.length +
                ' types of markers generated for ' +
                m
                  .map(function(n, t) {
                    return n.name + ' (' + e[t].length + ')';
                  })
                  .join(', ')
            );
        });
      },
      { './config': 10, './components/popup': 11 }
    ]
  },
  {},
  [6],
  null
);
//# sourceMappingURL=/src.3b12e2e7.map
