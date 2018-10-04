# guanacaste-map

Created with CodeSandbox

## Embed code

```html
<iframe src="https://tea-cat.github.io/guanacaste-map/" width="100%" height="400" />
```

## Configuration

Most of the files you'll ever want to bother with are in `src/config`! Changing these and rebuilding are all you need to do, essentially!

### `index.js` : General Config

- `MAP` is the config object that gets passed to the `new mapbox.Map()` instance

### `text.js`: Text strings

For now, use this to change text throughout the map that is not provided by mapbox source data layers. Button labels, etc. The object called `en` is the only one thats used.

### `layers.js`

```js
  "toggle-turismo": {
    label: "Turismo",
    color: "#CCCC00",
    filterOn: "symbol",
    hasPopups: true,
    filters: [
      {
        value: "biological",
        label: "Biological"
      },
      {
        value: "tourist",
        label: "Touristo"
      }
    ],
    // OR
    combineWithLayers: ['another-mapbox-layer', 'or-two']
  },
```

_Required:_

- The object key refers to the layer name
- `label` is the top-level filter label.
- `color` is used to render the icon next to the legend item

_Optional, for all:_

- `hasPopups` is a boolean that decides whether we should listen for popups for this layer

_For layers where we add subfilters_

- `filterOn` is the field to filter on with the filters[0].value
- `filters` is an array of label/value objects for display/filtering, respectively

_For layers where we want to combine layers into a single toggle:_

- `combineWithLayers` an array of strings of additional filters to add. Cannot be combined with subfilters.

## Development Setup

### Homebrew

- run `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

### NVM

- run `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
- run `nvm install 9 && nvm use 9`

### Yarn

- run `brew install yarn`

### Setup

- run `yarn` from the root of this repository.
- then, run `yarn start` to open the development server
