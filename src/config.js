const MAP = {
  // for creating mapboxgl.Map(). container defaults to 'map'
  style: 'mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x',
  center: [-85.61365526723557, 10.838261234356153],
  zoom: 9.619976883678385,
  scrollZoom: false
  //"sprite": "mapbox://sprites/mapbox/bright-v8"
};

const ACCESS_TOKEN =
  'pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww';

module.exports = {
  LAYER_ID: 'toggle-turismo',
  SYMBOL_LAYERS: ['toggle-turismo', 'toggle-ecosistemas'],
  //FLY_TO_ZOOM_LEVEL: 9.619976883678385,
  ANIMATION_DURATION: 2000,
  LEGEND_TITLE: 'Puestos Estaciónes y Tourismos',
  ACCESS_TOKEN,
  MAP,
  SOURCE_TYPES: [
    {
      name: 'biological',
      layerId: 'toggle-turismo',
      label: 'Biological'
    },
    {
      layerId: 'toggle-turismo',
      name: 'tourist',
      label: 'Touristo'
    }
  ],
  LAYERS: {
    'toggle-turismo': { label: 'Turismo', color: '#CCCC00' },
    'toggle-unesco': { label: 'UNESCO', color: '#CCCC00' },
    'toggle-sectores': { label: 'Sectores', color: '#449438' },
    'toggle-ecosistemas': { label: 'Ecosistemas', color: '#000000' }
  }
};
