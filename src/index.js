/* global mapboxgl */
/* eslint-disable no-irregular-whitespace */

import popupComponent from './components/popup';
import legendComponent from './components/legend';
import { getVisibleLayers, getFilteredLayers } from './utils';
import { getFilterHandler, getNoFilterHandler } from './handlers';
import '../assets/styles/index.scss';
import { MAP, LAYER_ID, ANIMATION_DURATION, SOURCE_TYPES } from './config';

const DEFAULT_MAP = {
  container: 'map',
  style: 'mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x',
  center: [-85.61365526723557, 10.838261234356153],
  zoom: 9.619976883678385
};
mapboxgl.accessToken =
  'pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww';

// instantiate the map instance
const map = new mapboxgl.Map(
  // Set defaults, allow the config to override
  Object.assign(DEFAULT_MAP, MAP)
);
// debugging only
// window.map = map;
window.tcat = window.tcat || {};

window.tcat.toggleLegend = () => {
  const legendEl = document.getElementById('legend');
  legendEl.classList.toggle('active');
};

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

//FULL SCREEN MODE

map.addControl(new mapboxgl.FullscreenControl());

// function createLegend() {
//  const legendEl
//}

//Create Compass Button that Flys to Center
function createCompass() {
  const leftEl = document.querySelector('.mapboxgl-ctrl-bottom-left');
  const compass = document.createElement('div');

  compass.innerHTML = `<div class="mapboxgl-ctrl mapboxgl-ctrl-group">
      <button class="mapboxgl-ctrl-icon mapboxgl-ctrl-compass" type="button" aria-label="Reset North"> 
      <span class="mapboxgl-ctrl-compass-arrow" style="transform: rotate(0deg);"></span> 
    </button> 
  </div>`;

  compass.onclick = () => {
    map.flyTo({
      center: DEFAULT_MAP.center
    });
  };
  leftEl.appendChild(compass);
}

map.visibleLayers = {};

map.on('load', () => {
  const nav = new mapboxgl.NavigationControl({ showCompass: false });
  map.addControl(nav, 'top-left');
  map.scrollZoom.disable();
  createCompass();

  const layerList = map.getStyle().layers;

  map.visibleLayers = getVisibleLayers(layerList);
  let filteredLayers = getFilteredLayers(layerList);

  const legendEl = document.getElementById(`legend`);

  // This is where we combine the symbol layer SOURCE_TYPES with filteredLayers
  legendEl.innerHTML = legendComponent([...SOURCE_TYPES, ...filteredLayers]);

  // HANDLE MAP LOAD
  window.tcat.handleFilter = getFilterHandler(map);
  window.tcat.noFilter = getNoFilterHandler(map, { layerList, filteredLayers });
});

// Press Command to Scrollzoom
document.body.addEventListener('keydown', function(event) {
  const { metaKey, ctrlKey } = event;
  if (metaKey || ctrlKey) {
    map.scrollZoom.enable();
  }
});
document.body.addEventListener('keyup', function(event) {
  const { metaKey, ctrlKey } = event;
  if (metaKey || ctrlKey) {
    map.scrollZoom.disable();
  }
});
