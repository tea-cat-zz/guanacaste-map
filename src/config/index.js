import { default as layers } from "./layers";
import { default as text } from "./text";

const MAP = {
  // for creating mapboxgl.Map(). container defaults to 'map'
  style: "mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x",
  center: [-85.61365526723557, 10.838261234356153],
  zoom: 9.619976883678385,
  scrollZoom: false
  //"sprite": "mapbox://sprites/mapbox/bright-v8"
};

const ACCESS_TOKEN =
  "pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww";

module.exports = {
  LAYERS_ACTIVE: false,
  ANIMATION_DURATION: 2000,
  ACCESS_TOKEN,
  MAP,
  LAYERS: layers,
  TEXT: text
};
