import { default as layers } from "./layers";
import { default as text } from "./text";

// TODO: Get these coordinates right
// const maxBounds = [
//   [-86.06044269571538, 10.42373421696972], // SW
//   [11.241447566507844, -85.16795975566262] // NE
// ];

// Inital config object for creating mapboxgl.Map().
// container defaults to 'map'
const MAP = {
  style: "mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x",
  center: [-85.61365526723557, 10.838261234356153],
  zoom: 9.619976883678385,
  scrollZoom: false,
  maxZoom: 12.5,
  minZoom: 9.619976883678385
  //maxBounds
};

const ACCESS_TOKEN =
  "pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww";

module.exports = Object.freeze({
  LAYER_PREFIX: "toggle-",
  LAYERS_ACTIVE: false,
  ANIMATION_DURATION: 2000,
  ACCESS_TOKEN,
  MAP,
  LAYERS: layers,
  TEXT: text
});
