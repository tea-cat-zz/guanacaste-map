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
  <div class="popup-content">
    <div class="popup-description">
      <p>${feature.properties.description}</p>
    </div>
    <a
      class="popup-button"
      href="${feature.properties.link}"
      target="_new"
      >
      Más informacíon
    </a>
  </div>
  `;
