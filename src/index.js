/* global mapboxgl */
/* eslint-disable no-irregular-whitespace */

import popupComponent from './components/popup';
import legendComponent from './components/legend';
import { getVisibleLayers } from './utils';
import '../assets/styles/index.scss';
import { MAP, LAYER_ID, ANIMATION_DURATION, SOURCE_TYPES, LAYERS } from './config';

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

let visibleLayers = {};

map.on('load', () => {
  const nav = new mapboxgl.NavigationControl({ showCompass: false });
  map.addControl(nav, 'top-left');
  map.scrollZoom.disable();
  createCompass();

  const layerList = map.getStyle().layers;

  visibleLayers = getVisibleLayers(layerList);

  let filteredLayers = layerList
    .filter(layer => {
      const layerName = layer.id;
      if (layerName.substring(0, 7) === 'toggle-' && layerName !== 'toggle-turismo') {
        return true;
      }
      return false;
    })
    .map(layer => ({
      name: layer.id,
      label: LAYERS[layer.id] ? LAYERS[layer.id].label : layer.id.substring(7),
      type: 'layer',
      color: LAYERS[layer.id] ? LAYERS[layer.id].color : 'darkgrey'
    }));
  const legend = document.getElementById(`legend`);

  // This is where we combine the symbol layer SOURCE_TYPES with filteredLayers
  legend.innerHTML = legendComponent([...SOURCE_TYPES, ...filteredLayers]);

  // HANDLE MAP LOAD
  window.tcat.handleFilter = (layerOrSymbolType, type = null, layerId = null) => {
    // Toggle Active Class
    const legendItem = document.getElementById(layerOrSymbolType);
    legendItem.classList.toggle('active');
    // If Symbol, toggle for the symbol in the layer filter
    if (type === 'symbol' && layerId) {
      visibleLayers[layerId][layerOrSymbolType] = !visibleLayers[layerId][layerOrSymbolType];

      const activeSymbolLayers = Object.keys(visibleLayers[layerId]).filter(
        key => visibleLayers[layerId][key]
      );
      if (activeSymbolLayers.length > 0) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
        return map.setFilter(layerId, [
          activeSymbolLayers.length === 1 ? '==' : 'in',
          'symbol',
          ...activeSymbolLayers
        ]);
      }
      // TODO: Until we figure out how to setFilter of none?
      return map.setLayoutProperty(layerId, 'visibility', 'none');
    }
    visibleLayers[layerOrSymbolType] = !visibleLayers[layerOrSymbolType];
    const isToggledOn = visibleLayers[layerOrSymbolType];

    // Toggle Layers
    map.setLayoutProperty(layerOrSymbolType, 'visibility', isToggledOn ? 'visible' : 'none');
    return;
  };

  window.tcat.noFilter = () => {
    filteredLayers.map(layer => map.setLayoutProperty(layer.name, 'visibility', 'visible'));
    filteredLayers.map(({ name }) => map.setFilter(name, null));
    visibleLayers = getVisibleLayers(layerList);
    const legend = document.getElementById(`legend`);
    // This is where we combine the symbol layer SOURCE_TYPES with filteredLayers
    legend.innerHTML = legendComponent([...SOURCE_TYPES, ...filteredLayers]);
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
