/* eslint-disable no-irregular-whitespace */

import legendComponent from "./components/legend";

import getMap, { handleInitialLoad } from "./map";

import "../assets/styles/index.scss";

// instantiate the map instance
const map = getMap();

map.initialLoaded = false;
map.visibleLayers = {};
map.layerList = [];

// debugging only
// window.map = map;
window.tcat = window.tcat || {};

window.tcat.toggleLegend = () => {
  const legendEl = document.getElementById("legend");
  legendEl.classList.toggle("active");
};

map.on("data", () => {
  if (!map.initialLoaded) {
    handleInitialLoad(map);
  }
});

map.on("load", () => {
  const legendEl = document.getElementById(`legend`);

  // This is where we combine the symbol layer SOURCE_TYPES with filteredLayers
  legendEl.innerHTML = legendComponent([...map.filteredLayers]);
});

// Press Command to Scrollzoom
document.body.addEventListener("keydown", function(event) {
  const { metaKey, ctrlKey } = event;
  if (metaKey || ctrlKey) {
    map.scrollZoom.enable();
  }
});
document.body.addEventListener("keyup", function(event) {
  const { metaKey, ctrlKey } = event;
  if (metaKey || ctrlKey) {
    map.scrollZoom.disable();
  }
});
