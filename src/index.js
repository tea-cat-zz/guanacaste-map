/* global mapboxgl */
/* eslint-disable no-irregular-whitespace */

import config from './config';
import popupComponent from './components/popup';
import legendComponent from './components/legend';
import './styles/index.scss';

const { ACCESS_TOKEN, MAP, LAYER_ID, ANIMATION_DURATION, SOURCE_TYPES, LAYERS } = config;

const DEFAULT_MAP = {
  container: 'map'
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

let state = {};

map.on('load', () => {
  const nav = new mapboxgl.NavigationControl({ showCompass: false });
  map.addControl(nav, 'top-left');
  map.scrollZoom.disable();
  createCompass();

  const layerList = map.getStyle().layers;
  let filteredLayers = layerList.filter(layer => {
    const layerName = layer.id;
    if (layerName.substring(0, 7) === 'toggle-' && layerName !== 'toggle-turismo') {
      return true;
    }
    return false;
  });

  filteredLayers = filteredLayers.map(layer => {
    return {
      name: layer.id,
      label: LAYERS[layer.id] ? LAYERS[layer.id].label : layer.id.substring(7),
      type: 'layer',
      color: LAYERS[layer.id] ? LAYERS[layer.id].color : 'darkgrey'
    };
  });
  const legend = document.getElementById(`legend`);
  legend.innerHTML = legendComponent([...SOURCE_TYPES, ...filteredLayers]);

  // HANDLE MAP LOAD
  window.handleFilter = (layerOrSymbolType, type = null) => {
    state[layerOrSymbolType] = !state[layerOrSymbolType];
    const isToggledOn = state[layerOrSymbolType];
    // Toggle Active Class
    const legendItem = document.getElementById(layerOrSymbolType);
    legendItem.classList.toggle('active');
    // If Symbol, toggle for the symbol in the layer filter
    if (type === 'symbol') {
      const activeFilters = Object.keys(state).filter(key => state[key]);
      map.setFilter(LAYER_ID, [isToggledOn ? 'in' : '!in', 'symbol', ...activeFilters]);
      return;
    }
    // Toggle Layers
    map.setLayoutProperty(layerOrSymbolType, 'visibility', isToggledOn ? 'none' : 'visible');
    return;
  };

  window.noFilter = () => {
    map.setFilter(LAYER_ID, null);
    filteredLayers.map(layer => map.setLayoutProperty(layer.name, 'visibility', 'visible'));
    state = {};
    document.querySelector('.legend-item').classList.add('active');
  };
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
