/* global mapboxgl */

import config from './config';
import popupComponent from './components/popup';
// import legendComponent from './components/legend';

const { ACCESS_TOKEN, MAP, LAYER_ID, ANIMATION_DURATION } = config;

const DEFAULT_MAP = {
    container: 'map',
    center:[-85.61365526723557, 10.838261234356153],
    zoom: 9.619976883678385
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

// When the map loads, generate the markers
map.on('load', () => {
  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-left');
  map.scrollZoom.disable();

  //
  // const legend = document.getElementById(`legend`);
  // legend.innerHTML = legendComponent(TYPES);
});

map.setCenter(DEFAULT_MAP.center);
map.setZoom(DEFAULT_MAP.zoom);



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

// ADD ZOOM CONTROLS TO MAP 
const nav = new mapboxgl.NavigationControl(); 
// DISABLE MAP ROTATION USING RIGHT CLICK + DRAG
  map.dragRotate.disable(); 
// DISABLE MAP ROTATIONS USING TOUCH ROTATION GESTURE
  map.touchZoomRotate.disableRotation(); 
//add zoom control with your options



// const legend = document.getElementById(`legend`);
// legend.innerHTML = legendComponent(TYPES); 

