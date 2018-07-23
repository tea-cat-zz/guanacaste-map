export default feature =>
  `<div class="popup-header">
    <h3>
        <a
          href="${feature.properties.link}"
          >
          ${feature.properties.Estación}
        </a>
    </h3>
    <div class="popup-image">
        <a
          href="${feature.properties.link}"
          >
          <img
            src="${feature.properties.Image}"
            alt="Image del Estación ${feature.properties.Estación}"
          />
        </a>
      
    </div>
  </div>
  <div class="popup-content">
    <div class="popup-description">
      <p>${feature.properties.description}</p>
    </div>
    <a
      class="popup-button"
      href="${feature.properties.link}"
      >
      Más informacíon
    </a>
  </div>
  `;
