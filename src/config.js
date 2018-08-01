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
  ANIMATION_DURATION: 2000,
  ACCESS_TOKEN,
  MAP,
  LAYERS: {
    "toggle-turismo": {
      label: "Turismo",
      color: "#CCCC00",
      filterOn: "symbol",
      hasPopups: true,
      filters: [
        {
          value: "biological",
          label: "Biological"
        },
        {
          value: "tourist",
          label: "Touristo"
        }
      ]
    },
    "toggle-unesco": { label: "UNESCO", color: "#CCCC00" },
    "toggle-sectores": { label: "Sectores", color: "#449438" },
    "toggle-ecosistemas": {
      label: "Ecosistemas",
      color: "#444",
      filterOn: "Name",
      filters: [
        {
          value: "Marino",
          label: "Marino",
          color: "hsl(221, 100%, 72%)"
        },
        {
          value: "Bosque Seco",
          label: "Bosque Seco",
          color: "hsl(64, 100%, 66%)"
        },
        {
          value: "Bosque Lluvioso",
          label: "Bosque Lluvioso",
          color: "hsl(127, 96%, 64%)"
        },
        {
          value: "Bosque Nuboso",
          label: "Bosque Nuboso",
          color: "hsl(305, 100%, 66%)"
        }
      ]
    }
  }
};
