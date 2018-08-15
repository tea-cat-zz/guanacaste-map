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

map.on("data", () => {
  if (!map.initialLoaded && !map.loaded()) {
    handleInitialLoad(map);
    map.initialLoaded = true;
  }
});

map.on("load", () => {
  window.map = map;
  const legendEl = document.getElementById(`legend`);
  const wrapperEl = document.getElementById(`legend-wrapper`);
  const legendInnerEl = legendComponent([...map.filteredLayers]);
  wrapperEl
    ? legendEl.replaceChild(legendInnerEl, wrapperEl)
    : legendEl.appendChild(legendInnerEl);
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
