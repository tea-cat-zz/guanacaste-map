/* eslint-disable */

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VhbmFjYXN0ZSIsImEiOiJjamowNzhuYnAwZXU2M2txczhsc21mbDVsIn0.amJMu3O1jfjcbg-B1qC7ww"; // replace this with your access token

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/guanacaste/cjj079axn0aqu2so55fx6ln2x", // replace this with your style URL
  center: [-85.49304, 10.891421],
  zoom: 10
});
// code from the next step will go here
map.on("click", function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ["turismo"] // replace this with the name of the layer
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];

  var popup = new mapboxgl.Popup()
    .setLngLat(feature.geometry.coordinates)
    // hey taylor
    .setHTML(
      '<div class="popup-header">' +
        "<h3>" +
        feature.properties.Estación +
        "</h3>" +
        '<div class="popup-image">' +
        '<img src="' +
        feature.properties.Image +
        '" alt="Image del Estación ' +
        feature.properties.Estación +
        '"/>' +
        "</div>" +
        "</div>" +
        '<div class="popup-description">' +
        "<p>" +
        feature.properties.description +
        "</p>" +
        "</div>"
    )
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
});
