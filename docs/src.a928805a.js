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
})({"../../node_modules/hyperscript-attribute-to-property/index.js":[function(require,module,exports) {
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],"../../node_modules/hyperx/index.js":[function(require,module,exports) {
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":"../../node_modules/hyperscript-attribute-to-property/index.js"}],"../../node_modules/nanohtml/lib/append-child.js":[function(require,module,exports) {
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],"../../node_modules/nanohtml/lib/svg-tags.js":[function(require,module,exports) {
module.exports = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

},{}],"../../node_modules/nanohtml/lib/bool-props.js":[function(require,module,exports) {
module.exports = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

},{}],"../../node_modules/nanohtml/lib/direct-props.js":[function(require,module,exports) {
module.exports = [
  'indeterminate'
]

},{}],"../../node_modules/nanohtml/lib/browser.js":[function(require,module,exports) {
var hyperx = require('hyperx')
var appendChild = require('./append-child')
var SVG_TAGS = require('./svg-tags')
var BOOL_PROPS = require('./bool-props')
// Props that need to be set directly rather than with el.setAttribute()
var DIRECT_PROPS = require('./direct-props')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var COMMENT_TAG = '!--'

function nanoHtmlCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on' || DIRECT_PROPS.indexOf(key) !== -1) {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(nanoHtmlCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = nanoHtmlCreateElement

},{"hyperx":"../../node_modules/hyperx/index.js","./append-child":"../../node_modules/nanohtml/lib/append-child.js","./svg-tags":"../../node_modules/nanohtml/lib/svg-tags.js","./bool-props":"../../node_modules/nanohtml/lib/bool-props.js","./direct-props":"../../node_modules/nanohtml/lib/direct-props.js"}],"src/config/layers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  "toggle-turismo": {
    label: "Turismo",
    color: "#CCCC00",
    filterOn: "symbol",
    hasPopups: true,
    filters: [{
      value: "biological",
      label: "Biological"
    }, {
      value: "tourist",
      label: "Touristo"
    }]
  },
  "toggle-unesco": { label: "UNESCO", color: "#CCCC00" },
  "toggle-sectores": {
    label: "Sectores",
    color: "#449438",
    combineWithLayers: ["sectores-nombres", "sectores-nombres-6mdotv"]
  },
  "toggle-ecosistemas": {
    label: "Ecosistemas",
    color: "#444444",
    filterOn: "Name",
    filters: [{
      value: "Marino",
      label: "Marino",
      color: "hsl(221, 100%, 72%)"
    }, {
      value: "Bosque Seco",
      label: "Bosque Seco",
      color: "hsl(64, 100%, 66%)"
    }, {
      value: "Bosque Lluvioso",
      label: "Bosque Lluvioso",
      color: "hsl(127, 96%, 64%)"
    }, {
      value: "Bosque Nuboso",
      label: "Bosque Nuboso",
      color: "hsl(305, 100%, 66%)"
    }]
  }
};
},{}],"src/config/text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var es = {
  LEGEND_TITLE: "Puestos Estaciónes y Tourismos",
  LEGEND_VIEW_ALL: "Muestra Todo",
  LEGEND_VIEW_NONE: "Muestra Nada",
  LEGEND_ITEM_TOOLTIP_PREFIX: "Muestra u oculta", // prefix the legend item
  POPUP_IMAGE_ALT_PREFIX: "Image del Estación",
  POPUP_MORE_INFO: "Más informacíon"
};

var en = {
  LEGEND_TITLE: "English Legend Title",
  LEGEND_VIEW_ALL: "View All",
  LEGEND_VIEW_NONE: "View None",
  POPUP_IMAGE_ALT_PREFIX: "Image of station",
  POPUP_MORE_INFO: "More information"
};

exports.es = es;
exports.default = es;
exports.en = en;
},{}],"src/config/index.js":[function(require,module,exports) {
"use strict";

var _layers = require("./layers");

var _layers2 = _interopRequireDefault(_layers);

var _text = require("./text");

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Get these coordinates right
// const maxBounds = [
//   [-86.06044269571538, 10.42373421696972], // SW
//   [11.241447566507844, -85.16795975566262] // NE
// ];

// Inital config object for creating mapboxgl.Map().
// container defaults to 'map'
var MAP = {
  style: "mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x",
  center: [-85.61365526723557, 10.838261234356153],
  zoom: 9.619976883678385,
  scrollZoom: false,
  maxZoom: 12.5,
  minZoom: 9.619976883678385
  //maxBounds
};

var ACCESS_TOKEN = "pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww";

module.exports = Object.freeze({
  LAYER_PREFIX: "toggle-",
  LAYERS_ACTIVE: false,
  ANIMATION_DURATION: 2000,
  ACCESS_TOKEN: ACCESS_TOKEN,
  MAP: MAP,
  LAYERS: _layers2.default,
  TEXT: _text2.default
});
},{"./layers":"src/config/layers.js","./text":"src/config/text.js"}],"src/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilteredLayers = exports.getVisibleLayers = exports.filteringLayersList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _config = require("./config");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PREFIX_LENGTH = _config.LAYER_PREFIX.length;

var filteringLayers = Object.entries(_config.LAYERS).filter(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      _ref2$ = _ref2[1],
      filters = _ref2$.filters,
      filterOn = _ref2$.filterOn;

  return filterOn && filters && filters.length && filters.length > 0;
}).map(function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      layerName = _ref4[0],
      _ref4$ = _ref4[1],
      _ref4$$filters = _ref4$.filters,
      filters = _ref4$$filters === undefined ? [] : _ref4$$filters,
      filterOn = _ref4$.filterOn;

  return {
    name: layerName,
    filterOn: filterOn,
    filters: filters
  };
});

var filteringLayersList = exports.filteringLayersList = filteringLayers.map(function (_ref5) {
  var name = _ref5.name;
  return name;
});
var hasToggle = function hasToggle(_ref6) {
  var id = _ref6.id;
  return id.substring(0, PREFIX_LENGTH) === _config.LAYER_PREFIX;
};

// const hasToggle = ({ id }) => id;

var getVisibleLayers = exports.getVisibleLayers = function getVisibleLayers(layerList) {
  var forceValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _config.LAYERS_ACTIVE;
  return layerList.filter(hasToggle).reduce(function (agg, layer) {
    var result = _defineProperty({}, layer.id, forceValue);
    var layerIndex = filteringLayersList.indexOf(layer.id);
    if (layerIndex >= 0) {
      var _layer = filteringLayers[layerIndex];
      result[_layer.name] = _layer.filters.reduce(function (agg, _ref7) {
        var value = _ref7.value;
        return Object.assign(_defineProperty({}, value, forceValue), agg);
      }, {});
    }
    return Object.assign(result, agg);
  }, {});
};

var getFilteredLayers = exports.getFilteredLayers = function getFilteredLayers(layerList) {
  return layerList.filter(hasToggle).map(function (layer) {
    var layerC = _config.LAYERS[layer.id];
    var hasFilters = layerC && layerC.filters && !!layerC.filters.length;
    return _extends({}, layerC, {
      hasFilters: hasFilters,
      filters: hasFilters && layerC.filters.map(function (filter) {
        return _extends({}, filter, { layerId: layer.id });
      }),
      name: layer.id,
      label: layerC && layerC.label ? layerC.label : layer.id.substring(PREFIX_LENGTH)
    });
  });
};
},{"./config":"src/config/index.js"}],"src/handlers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHideAllHandler = exports.getShowAllHandler = exports.getFilterToggleHandler = exports.getFilterLayerToggleHandler = exports.getLayerToggleHandler = exports.toggleLegend = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require("./config");

var _utils = require("./utils");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var toggleLegend = exports.toggleLegend = function toggleLegend() {
  var legendEl = document.getElementById("legend");
  legendEl.classList.toggle("active");
};

/**
 Toggles the entire layer for a layer without a filter
**/
var getLayerToggleHandler = exports.getLayerToggleHandler = function getLayerToggleHandler(map) {
  return function (layerId) {
    // toggle class
    var legendItem = document.getElementById(layerId);
    legendItem.classList.toggle("active");
    // toggle state
    map.visibleLayers[layerId] = !map.visibleLayers[layerId];

    var isToggledOn = map.visibleLayers[layerId];
    var visibility = isToggledOn ? "visible" : "none";
    var combineWithLayers = _config.LAYERS[layerId].combineWithLayers;

    if (combineWithLayers) {
      combineWithLayers.forEach(function (layerName) {
        return map.setLayoutProperty(layerName, "visibility", visibility);
      });
    }
    // toggle layer visibility
    return map.setLayoutProperty(layerId, "visibility", visibility);
  };
};

/**
 Toggles the entire layer for a layer with a filter
**/
var getFilterLayerToggleHandler = exports.getFilterLayerToggleHandler = function getFilterLayerToggleHandler(map) {
  return function (layerId) {
    var legendItem = document.getElementById(layerId);
    legendItem.classList.toggle("active");
    var legendItemEls = document.querySelectorAll("#" + layerId + " .legend-item");
    var currentLayerState = map.visibleLayers[layerId];

    // if any items were active, they are now all inactive
    var isToggledOn = !Object.values(currentLayerState).some(function (item) {
      return item;
    });

    // Toggle the active class for children

    [].forEach.call(legendItemEls, function (item) {
      isToggledOn ? item.classList.add("active") : item.classList.remove("active");
    });

    var visibility = isToggledOn ? "visible" : "none";

    // update map.visibleLayers state
    map.visibleLayers[layerId] = Object.keys(currentLayerState).reduce(function (agg, value) {
      return _extends({}, agg, _defineProperty({}, value, isToggledOn));
    }, {});

    // If we are toggling the layer back on, display everything
    isToggledOn && map.setFilter(layerId, null);

    // Toggle Layer visibility
    return map.setLayoutProperty(layerId, "visibility", visibility);
  };
};

/**
 * Toggles just the filter item.
 */
var getFilterToggleHandler = exports.getFilterToggleHandler = function getFilterToggleHandler(map) {
  return function (layerId, value) {
    // Toggle Active Class
    var legendItem = document.getElementById(layerId + "-" + value);
    legendItem.classList.toggle("active");

    if (layerId) {
      var layerConfig = _config.LAYERS[layerId];
      var layerData = map.visibleLayers[layerId];
      map.visibleLayers[layerId][value] = !layerData[value];
      // If this filter is active, it's parent should be active too
      if (map.visibleLayers[layerId][value]) {
        document.getElementById(layerId).classList.add("active");
      }
      if (!Object.values(map.visibleLayers[layerId]).some(function (item) {
        return item;
      })) {
        document.getElementById(layerId).classList.remove("active");
      }

      var activeFilterLayers = Object.keys(layerData).filter(function (key) {
        return layerData[key];
      });
      if (activeFilterLayers.length > 0) {
        map.setLayoutProperty(layerId, "visibility", "visible");
        // build the filter query, using filterOn for the field to filter on,
        // and spreading the activeFilterLayers
        return map.setFilter(layerId, [activeFilterLayers.length === 1 ? "==" : "in", layerConfig.filterOn].concat(_toConsumableArray(activeFilterLayers)));
      }

      // TODO: Until we figure out how to setFilter of none?
      return map.setLayoutProperty(layerId, "visibility", "none");
    }
  };
};

/**
 * To reset the entire layer/filter state
 */
var getShowAllHandler = exports.getShowAllHandler = function getShowAllHandler(map) {
  return function () {
    map.filteredLayers.map(function (layer) {
      return map.setLayoutProperty(layer.name, "visibility", "visible");
    });
    map.filteredLayers.map(function (_ref) {
      var name = _ref.name;
      return map.setFilter(name, null);
    });
    map.visibleLayers = (0, _utils.getVisibleLayers)(map.layerList, true);
    var legendItemEls = document.querySelectorAll(".legend-item");
    [].forEach.call(legendItemEls, function (item) {
      item.classList.add("active");
    });
  };
};

/**
 * To hide the entire layer/filter state
 */
var getHideAllHandler = exports.getHideAllHandler = function getHideAllHandler(map) {
  return function () {
    map.filteredLayers.map(function (layer) {
      return map.setLayoutProperty(layer.name, "visibility", "none");
    });
    map.visibleLayers = (0, _utils.getVisibleLayers)(map.layerList);
    var legendItemEls = document.querySelectorAll(".legend-item");
    [].forEach.call(legendItemEls, function (item) {
      item.classList.remove("active");
    });
  };
};
},{"./config":"src/config/index.js","./utils":"src/utils.js"}],"src/components/legend.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(["<div id=\"legend-wrapper\" class=\"legend-wrapper\">\n    <h4 class=\"overlay-box toggle-button\" onclick=\"", "\">\n        ", "\n        <span id=\"legend-toggle-icon\"></span>\n    </h4>\n    <div class=\"flex-child legend-inner\">\n\t\t\t<div id=\"legend-items\" class=\"overlay-box toggle-content\">\n          ", "\n\t\t\t</div>\n      <div id=\"legend-footer\" class=\"overlay-box toggle-content\">\n        <button class=\"button button-block-on-mobile\" onclick=", ">", "</button>\n        <button class=\"button button-block-on-mobile\" onclick=", ">", "</button>\n      </div>\n\t</div>\n</div>"], ["<div id=\"legend-wrapper\" class=\"legend-wrapper\">\n    <h4 class=\"overlay-box toggle-button\" onclick=\"", "\">\n        ", "\n        <span id=\"legend-toggle-icon\"></span>\n    </h4>\n    <div class=\"flex-child legend-inner\">\n\t\t\t<div id=\"legend-items\" class=\"overlay-box toggle-content\">\n          ", "\n\t\t\t</div>\n      <div id=\"legend-footer\" class=\"overlay-box toggle-content\">\n        <button class=\"button button-block-on-mobile\" onclick=", ">", "</button>\n        <button class=\"button button-block-on-mobile\" onclick=", ">", "</button>\n      </div>\n\t</div>\n</div>"]),
    _templateObject2 = _taggedTemplateLiteral(["\n  <div\n    title=\"", " ", "\"\n    class=\"legend-item\"\n    id=\"", "\"\n    onclick=", "\n  >\n    <span class=\"legend-key\" style=\"background-color: ", "\"></span>\n    <span class=\"label\">", "</span>\n  </div>"], ["\n  <div\n    title=\"", " ", "\"\n    class=\"legend-item\"\n    id=\"", "\"\n    onclick=", "\n  >\n    <span class=\"legend-key\" style=\"background-color: ", "\"></span>\n    <span class=\"label\">", "</span>\n  </div>"]),
    _templateObject3 = _taggedTemplateLiteral(["\n    <div\n      title=\"", " ", ": ", "\"\n      class=\"legend-item\"\n      id=\"", "-", "\"\n      onclick=", "\n    >\n      <span class=\"legend-key\" style=\"background-color: ", "\"></span>\n      <span class=\"label\">", "</span>\n    </div>\n"], ["\n    <div\n      title=\"", " ", ": ", "\"\n      class=\"legend-item\"\n      id=\"", "-", "\"\n      onclick=", "\n    >\n      <span class=\"legend-key\" style=\"background-color: ", "\"></span>\n      <span class=\"label\">", "</span>\n    </div>\n"]),
    _templateObject4 = _taggedTemplateLiteral(["\n  <div\n    class=\"legend-item\"\n    id=\"", "\"\n  >\n    <span class=\"legend-key\" style=\"background-color: ", "\"></span>\n    <span\n        class=\"label\"\n        title=\"", " ", "\"\n        onclick=", "\n      >\n        ", "\n      </span>\n    <div class=\"legend-items\">\n      ", "\n    </div>\n  </div>\n"], ["\n  <div\n    class=\"legend-item\"\n    id=\"", "\"\n  >\n    <span class=\"legend-key\" style=\"background-color: ", "\"></span>\n    <span\n        class=\"label\"\n        title=\"", " ", "\"\n        onclick=", "\n      >\n        ", "\n      </span>\n    <div class=\"legend-items\">\n      ", "\n    </div>\n  </div>\n"]);

var _nanohtml = require("nanohtml");

var _nanohtml2 = _interopRequireDefault(_nanohtml);

var _handlers = require("../handlers");

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// const getArg = arg => (arg ? `'${arg}'` : null);

function getLayerToggle(layerId) {
  return function toggleLayer(e) {
    e.preventDefault();
    window.tcat.handleLayerToggle(layerId);
  };
}
function getFilterLayerToggle(layerId) {
  return function toggleFilterLayer(e) {
    e.preventDefault();
    window.tcat.handleFilterLayerToggle(layerId);
  };
}

function getFilterItemToggle(layerId, value) {
  return function toggleFilterItem(e) {
    e.preventDefault();
    window.tcat.handleFilterToggle(layerId, value);
  };
}

exports.default = function (allLayers) {
  return (0, _nanohtml2.default)(_templateObject, _handlers.toggleLegend, _config.TEXT.LEGEND_TITLE, allLayers.map(function (layer) {
    if (layer.hasFilters) {
      return legendItemWithFilters(layer);
    }
    return legendItem(layer);
  }), window.tcat.handleShowAll, _config.TEXT.LEGEND_VIEW_ALL, window.tcat.handleHideAll, _config.TEXT.LEGEND_VIEW_NONE);
};

var legendItem = function legendItem(_ref) {
  var name = _ref.name,
      color = _ref.color,
      label = _ref.label;
  return (0, _nanohtml2.default)(_templateObject2, _config.TEXT.LEGEND_ITEM_TOOLTIP_PREFIX, label, name, getLayerToggle(name), color, label);
};

var legendItemChild = function legendItemChild(_ref2) {
  var value = _ref2.value,
      layerId = _ref2.layerId,
      color = _ref2.color,
      label = _ref2.label;
  return (0, _nanohtml2.default)(_templateObject3, _config.TEXT.LEGEND_ITEM_TOOLTIP_PREFIX, _config.LAYERS[layerId].label, value, layerId, value, getFilterItemToggle(layerId, value), color, label);
};

var legendItemWithFilters = function legendItemWithFilters(_ref3) {
  var name = _ref3.name,
      color = _ref3.color,
      label = _ref3.label,
      filters = _ref3.filters;
  return (0, _nanohtml2.default)(_templateObject4, name, color, _config.TEXT.LEGEND_ITEM_TOOLTIP_PREFIX, label, getFilterLayerToggle(name), label, filters.map(legendItemChild));
};
},{"nanohtml":"../../node_modules/nanohtml/lib/browser.js","../handlers":"src/handlers.js","../config":"src/config/index.js"}],"src/components/popup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require("../config");

exports.default = function (feature) {
  return "<div class=\"popup-header\">\n    <h3>\n        <a\n          href=\"" + feature.properties.link + "\"\n          >\n          " + feature.properties.Estación + "\n        </a>\n    </h3>\n    <div class=\"popup-image\">\n        <a\n          href=\"" + feature.properties.link + "\"\n          >\n          <img\n            src=\"" + feature.properties.Image + "\"\n            alt=\"" + _config.TEXT.POPUP_IMAGE_ALT_PREFIX + " " + feature.properties.Estación + "\"\n          />\n        </a>\n\n    </div>\n  </div>\n  <div class=\"popup-content\">\n    <div class=\"popup-description\">\n      <p>" + feature.properties.description + "</p>\n    </div>\n    <a\n      class=\"button button-block\"\n      href=\"" + feature.properties.link + "\"\n      >\n      " + _config.TEXT.POPUP_MORE_INFO + "\n    </a>\n  </div>\n  ";
};
},{"../config":"src/config/index.js"}],"src/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleLayer = exports.handleInitialLoad = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _templateObject = _taggedTemplateLiteral(["<div class=\"mapboxgl-ctrl mapboxgl-ctrl-group\">\n      <button class=\"mapboxgl-ctrl-icon mapboxgl-ctrl-compass\" type=\"button\" aria-label=\"Reset North\">\u2028\n      <span class=\"mapboxgl-ctrl-compass-arrow\" style=\"transform: rotate(0deg);\"></span>\u2028\n    </button>\u2028\n  </div>"], ["<div class=\"mapboxgl-ctrl mapboxgl-ctrl-group\">\n      <button class=\"mapboxgl-ctrl-icon mapboxgl-ctrl-compass\" type=\"button\" aria-label=\"Reset North\">\u2028\n      <span class=\"mapboxgl-ctrl-compass-arrow\" style=\"transform: rotate(0deg);\"></span>\u2028\n    </button>\u2028\n  </div>"]);

exports.createCompass = createCompass;
exports.default = getMap;

var _popup = require("./components/popup");

var _popup2 = _interopRequireDefault(_popup);

var _nanohtml = require("nanohtml");

var _nanohtml2 = _interopRequireDefault(_nanohtml);

var _utils = require("./utils");

var _handlers = require("./handlers");

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); } /* global mapboxgl */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-undef */

mapboxgl.accessToken = _config.ACCESS_TOKEN;

var DEFAULT_MAP = {
  container: "map"
};

var handleInitialLoad = exports.handleInitialLoad = function handleInitialLoad(map) {
  Object.keys(_config.LAYERS).forEach(function (layerId) {
    return toggleLayer(map, layerId, _config.LAYERS_ACTIVE);
  });
  map.layerList = map.getStyle().layers;

  map.visibleLayers = (0, _utils.getVisibleLayers)(map.layerList, false);
  map.filteredLayers = (0, _utils.getFilteredLayers)(map.layerList);
  // HANDLE MAP LOAD
  window.tcat.handleLayerToggle = (0, _handlers.getLayerToggleHandler)(map);
  window.tcat.handleFilterToggle = (0, _handlers.getFilterToggleHandler)(map);
  window.tcat.handleFilterLayerToggle = (0, _handlers.getFilterLayerToggleHandler)(map);
  window.tcat.handleShowAll = (0, _handlers.getShowAllHandler)(map);
  window.tcat.handleHideAll = (0, _handlers.getHideAllHandler)(map);
};

var toggleLayer = exports.toggleLayer = function toggleLayer(map, layerId) {
  var isVisible = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var visibility = isVisible ? "visible" : "none";
  map.setLayoutProperty(layerId, "visibility", visibility);
};

function createCompass(map) {
  var leftEl = document.querySelector(".mapboxgl-ctrl-bottom-left");

  var compass = (0, _nanohtml2.default)(_templateObject);

  compass.onclick = function () {
    map.flyTo({
      center: _config.MAP.center
    });
  };
  leftEl.appendChild(compass);
}

function getMap() {
  var map = new mapboxgl.Map(
  // Set defaults, allow the config to override
  Object.assign(DEFAULT_MAP, _config.MAP));

  var popup = new mapboxgl.Popup({
    maxWidth: "240px"
  });

  // Create a mapboxgl.Popup from the default popup component.
  var showPopup = function showPopup(feature) {
    popup.setLngLat(feature.geometry.coordinates).setHTML((0, _popup2.default)(feature)).addTo(map);
    popup.on("close", function () {
      // map.flyTo({
      //   center: DEFAULT_MAP.center,
      //   duration: ANIMATION_DURATION
      // });
    });

    return popup;
  };

  // HANDLE MAP EVENTS

  Object.entries(_config.LAYERS) // [['toggle-sectores', { hasPopus: false}]]
  .filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        layerConfig = _ref2[1];

    return layerConfig.hasPopups;
  }).forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        layerId = _ref4[0];

    map.on("click", layerId, function (e) {
      var feature = e.features[0];
      setTimeout(function () {
        map.flyTo({
          center: feature.geometry.coordinates,
          duration: _config.ANIMATION_DURATION
        });
        showPopup(feature);
      }, 200);
    });
  });

  //FULL SCREEN MODE
  map.addControl(new mapboxgl.FullscreenControl());
  // Add zoom conntrol
  var nav = new mapboxgl.NavigationControl({ showCompass: false });
  map.addControl(nav, "top-left");
  // disable scrollZoom
  map.scrollZoom.disable();
  createCompass(map);
  return map;
}
},{"./components/popup":"src/components/popup.js","nanohtml":"../../node_modules/nanohtml/lib/browser.js","./utils":"src/utils.js","./handlers":"src/handlers.js","./config":"src/config/index.js"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
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
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"assets/styles/index.scss":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../svg/up-arrow.svg":[["up-arrow.d75f0b9a.svg","assets/svg/up-arrow.svg"],"assets/svg/up-arrow.svg"],"./../svg/down-arrow.svg":[["down-arrow.fff45b58.svg","assets/svg/down-arrow.svg"],"assets/svg/down-arrow.svg"],"./../svg/park-11.svg":[["park-11.4a389092.svg","assets/svg/park-11.svg"],"assets/svg/park-11.svg"],"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _legend = require("./components/legend");

var _legend2 = _interopRequireDefault(_legend);

var _map = require("./map");

var _map2 = _interopRequireDefault(_map);

require("../assets/styles/index.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-irregular-whitespace */

// instantiate the map instance
var map = (0, _map2.default)();

map.initialLoaded = false;
map.visibleLayers = {};
map.layerList = [];

// debugging only
// window.map = map;
window.tcat = window.tcat || {};

map.on("data", function () {
  if (!map.initialLoaded && !map.loaded()) {
    (0, _map.handleInitialLoad)(map);
    map.initialLoaded = true;
  }
});

map.on("load", function () {
  window.map = map;
  var legendEl = document.getElementById("legend");
  var wrapperEl = document.getElementById("legend-wrapper");
  var legendInnerEl = (0, _legend2.default)([].concat(_toConsumableArray(map.filteredLayers)));
  wrapperEl ? legendEl.replaceChild(legendInnerEl, wrapperEl) : legendEl.appendChild(legendInnerEl);
});

// Press Command to Scrollzoom
document.body.addEventListener("keydown", function (event) {
  var metaKey = event.metaKey,
      ctrlKey = event.ctrlKey;

  if (metaKey || ctrlKey) {
    map.scrollZoom.enable();
  }
});
document.body.addEventListener("keyup", function (event) {
  var metaKey = event.metaKey,
      ctrlKey = event.ctrlKey;

  if (metaKey || ctrlKey) {
    map.scrollZoom.disable();
  }
});
},{"./components/legend":"src/components/legend.js","./map":"src/map.js","../assets/styles/index.scss":"assets/styles/index.scss"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '59007' + '/');
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
        parents.push(k);
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a928805a.map