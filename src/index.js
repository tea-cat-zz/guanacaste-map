/* global mapboxgl */

import config from './config';
import popupComponent from './components/popup';
import legendComponent from './components/legend';

const { ACCESS_TOKEN, MAP, TYPES, LAYER_ID, ANIMATION_DURATION } = config;

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

window.map = map;

// HANDLE POPUPS

const popup = new mapboxgl.Popup();

// Create a mapboxgl.Popup from the default popup component.
const showPopup = feature => {
  popup
    .setLngLat(feature.geometry.coordinates)
    .setHTML(popupComponent(feature))
    .addTo(map);
  popup.on('close', () => {
    map.flyTo({
      center: DEFAULT_MAP.center,
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
      duration: ANIMATION_DURATION
    });
    showPopup(feature);
  }, 200);
});
// HANDLE MAP LOAD

window.handleFilter = symbolType => {
  map.setFilter(LAYER_ID, ['==', 'symbol', symbolType]);
};

window.noFilter = () => {
  map.setFilter(LAYER_ID, null);
};

// When the map loads, generate the markers
map.on('load', () => {
  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-left');
  //
  // const legend = document.getElementById(`legend`);
  // legend.innerHTML = legendComponent(TYPES);
});
