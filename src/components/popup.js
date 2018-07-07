export default feature =>
  `<div class="popup-header">
    <h3>${feature.properties.Estación}</h3>
    <div class="popup-image">
      <img
        src="${feature.properties.Image}"
        alt="Image del Estación ${feature.properties.Estación}"
      />
    </div>
  </div>
  <div class="popup-description">
    <p>${feature.properties.description}</p>
    <a class="popup-button" href="${feature.properties.link}">Más informacíon</a>
  </div>
  `;
