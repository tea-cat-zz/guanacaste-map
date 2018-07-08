import config from './config';
import popupComponent from './components/popup';

const {
  ACCESS_TOKEN,
  MAP,
  SOURCE_LAYER,
  TYPES,
  LAYER_ID,
  FLY_TO_ZOOM_LEVEL,
  ANIMATION_DURATION
} = config;

const DEFAULT_MAP = {
  container: 'map',
  center: [-85.49304, 10.891421],
  zoom: 9.18
};

mapboxgl.accessToken = ACCESS_TOKEN;

// instantiate the map instance
const map = new mapboxgl.Map(
  // Set defaults, allow the config to override
  Object.assign(DEFAULT_MAP, MAP)
);

window.exampleMap = map;

// MARKERS

const createMarker = (feature, className) =>
  new mapboxgl.Marker(getMarkerElement(feature, className))
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);

// make a marker for each feature and add to the map
const createMarkers = (features, className) =>
  features.map(feature => createMarker(feature, className));

// Generate the marker element on the fly in the DOM, using createElement
const getMarkerElement = (feature, className) => {
  // create a HTML element for each feature
  const markerElement = document.createElement('div');
  // append default marker classname to provided class name
  markerElement.className = `marker ${className}`;

  return markerElement;
};

// LEGEND ITEMS

const createLegendItem = symbolType => {
  const div = document.createElement('div');
  const span = document.createElement('span');
  const labelSpan = document.createElement('span');
  span.className = `marker ${symbolType.name}-marker`;
  labelSpan.innerHTML = symbolType.label || 'No label specified';
  div.appendChild(span);
  div.appendChild(labelSpan);
  document.getElementById('legend-items').appendChild(div);
};

// HANDLE POPUPS

const popup = new mapboxgl.Popup();

// Create a mapboxgl.Popup from the default popup component.
const showPopup = feature => {
  popup
    .setLngLat(feature.geometry.coordinates)
    .setHTML(popupComponent(feature))
    .addTo(map);
  popup.on('close', e => {
    map.flyTo({
      center: DEFAULT_MAP.center,
      zoom: DEFAULT_MAP.zoom,
      duration: ANIMATION_DURATION
    });
  });

  return popup;
};

// HANDLE MAP EVENTS

map.on('click', LAYER_ID, e => {
  const feature = e.features[0];
  setTimeout(() => {
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
const getFeatures = symbolType =>
  map.querySourceFeatures('composite', {
    sourceLayer: SOURCE_LAYER,
    filter: ['==', 'symbol', symbolType]
  });

// When the map loads, generate the markers
map.on('load', () => {
  const featureData =
    TYPES &&
    TYPES.map(symbolType => {
      const features = getFeatures(symbolType.name);
      createLegendItem(symbolType);

      // get the feature featureData and then create markers
      // return createMarkers(features, `${symbolType.name}-marker`);
    });
});
