/* global mapboxgl */

import config from './config';
import popupComponent from './components/popup';
// import legendComponent from './components/legend';

const { ACCESS_TOKEN, MAP, LAYER_ID, ANIMATION_DURATION } = config;

const DEFAULT_MAP = {
    container: 'map',
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

//FULL SCREEN MODE 

map.addControl(new mapboxgl.FullscreenControl());

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

//Create Compass Button that Flys to Center
function createCompass() {
  const leftEl = document.querySelector('.mapboxgl-ctrl-bottom-left');
  const compass = document.createElement('div'); 
  compass.innerHTML = `<div class="mapboxgl-ctrl mapboxgl-ctrl-group">
      <button class="mapboxgl-ctrl-icon mapboxgl-ctrl-compass" type="button" aria-label="Reset North">    
       <span class="mapboxgl-ctrl-compass-arrow" style="transform: rotate(0deg);"></span>   
    </button>  
  </div>`; 
  compass.onclick = e => {
    map.flyTo({
      center: DEFAULT_MAP.center,
    })
  }
leftEl.appendChild(compass);
}

map.on('load', () => {
  const nav = new mapboxgl.NavigationControl({showCompass: false});
  map.addControl(nav, 'top-left');
  map.scrollZoom.disable();
  createCompass();

  // const legend = document.getElementById(`legend`);
  // legend.innerHTML = legendComponent(TYPES);
});

// Press Command to Scrollzoom
document.body.addEventListener("keydown", function(event) {
    var key = event.key;
    var cmd_held = event.metaKey;
    var ctrl_held = event.ctrlKey;

    if(cmd_held || ctrl_held){
        map.scrollZoom.enable();
    }
});
document.body.addEventListener("keyup", function(event) {
    var key = event.key;
    var ctrl_held = event.ctrlKey;


    if(key=="Meta"|| key=="Control"){
        map.scrollZoom.disable();
    }
});


// const legend = document.getElementById(`legend`);
// legend.innerHTML = legendComponent(TYPES); 