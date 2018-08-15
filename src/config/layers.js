export default {
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
  "toggle-sectores": {
    label: "Sectores",
    color: "#449438",
    combineWithLayers: ["sectores-nombres", "sectores-nombres-6mdotv"]
  },
  "toggle-ecosistemas": {
    label: "Ecosistemas",
    color: "#444444",
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
};
