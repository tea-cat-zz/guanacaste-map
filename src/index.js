import config from './config';
import popupComponent from './components/popup';

const { ACCESS_TOKEN, MAP, SOURCE_LAYER, TYPES } = config;

mapboxgl.accessToken = ACCESS_TOKEN;

// instantiate the map instance
const map = new mapboxgl.Map(
  // Set defaults, allow the config to override
  Object.assign(
    MAP,
    {
      container: 'map',
      center: [-85.49304, 10.891421],
      zoom: 9.18
    },
    {}
  )
);

// Retrieve the source feature data from mapbox
const getFeatures = symbolType =>
  map.querySourceFeatures('composite', {
    sourceLayer: SOURCE_LAYER,
    filter: ['==', 'symbol', symbolType]
  });

// Generate the marker element on the fly in the DOM, using createElement
const getMarkerElement = (feature, className) => {
  // create a HTML element for each feature
  const markerElement = document.createElement('div');
  // append default marker classname to provided class name
  markerElement.className = `marker ${className}`;
  return markerElement;
};

// Create a mapboxgl.Popup from the default popup component.
const getPopup = feature => new mapboxgl.Popup().setHTML(popupComponent(feature));

const createLegendItems = featureSet => {
  const div = document.createElement('div');
  const span = document.createElement('span');
  span.className = `marker ${featureSet.name}-marker`;
  span.innerHTML = featureSet.label || 'No label specified';
  div.appendChild(span);
  document.getElementById('legend-items').appendChild(div);
};

// make a marker for each feature and add to the map
const createMarkers = (features, className) =>
  features.map(feature =>
    new mapboxgl.Marker(getMarkerElement(feature, className))
      .setLngLat(feature.geometry.coordinates)
      .setPopup(getPopup(feature))
      .addTo(map)
  );
// When the map loads, generate the markers
map.on('load', () => {
  const data =
    TYPES &&
    TYPES.map((type = 'biological') => {
      // default is 'biological'
      const features = getFeatures(type.name);
      createLegendItems(type, `${type.name}-marker`);

      // get the feature data and then create markers
      return createMarkers(features, `${type.name}-marker`);
    });

  if (data.length === TYPES.length) {
    console.log(
      `${data.length} types of markers generated for ${TYPES.map(
        (type, i) => `${type.name} (${data[i].length})`
      ).join(', ')}`
    );
  }
});
