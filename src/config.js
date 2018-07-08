const MAP = {
  // for creating mapboxgl.Map(). container defaults to 'map'
  style: 'mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x',
  zoom: 9.18,
  center: [-85.49304, 10.891421]
};

const ACCESS_TOKEN =
  'pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww';

export default {
  LAYER_ID: 'turismo',
  SOURCE_LAYER: 'Turismo',
  FLY_TO_ZOOM_LEVEL: 12,
  ANIMATION_DURATION: 2000,
  MAP,
  ACCESS_TOKEN,
  TYPES: [
    {
      name: 'biological',
      label: 'Biological'
    },
    {
      name: 'tourist',
      label: 'Touristo'
    }
  ]
};
