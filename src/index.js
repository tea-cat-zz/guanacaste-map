/* eslint-disable no-irregular-whitespace */

import legendComponent from "./components/legend";
import { getVisibleLayers, getFilteredLayers } from "./utils";
import {
  getLayerToggleHandler,
  getFilterToggleHandler,
  getNoFilterHandler,
  getFilterLayerToggleHandler
} from "./handlers";
import getMap from "./map";
import "../assets/styles/index.scss";

// instantiate the map instance
const map = getMap();
// debugging only
// window.map = map;
window.tcat = window.tcat || {};

window.tcat.toggleLegend = () => {
  const legendEl = document.getElementById("legend");
  legendEl.classList.toggle("active");
};

// HANDLE POPUPS

map.visibleLayers = {};

map.on("load", () => {
  const layerList = map.getStyle().layers;

  map.visibleLayers = getVisibleLayers(layerList);
  let filteredLayers = getFilteredLayers(layerList);

  const legendEl = document.getElementById(`legend`);

  // This is where we combine the symbol layer SOURCE_TYPES with filteredLayers
  legendEl.innerHTML = legendComponent([...filteredLayers]);

  // HANDLE MAP LOAD
  window.tcat.handleLayerToggle = getLayerToggleHandler(map);
  window.tcat.handleFilterToggle = getFilterToggleHandler(map);
  window.tcat.handleFilterLayerToggle = getFilterLayerToggleHandler(map);
  window.tcat.noFilter = getNoFilterHandler(map, { layerList, filteredLayers });
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
