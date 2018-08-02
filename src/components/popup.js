import { TEXT as T } from "../config";

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
            alt="${T.POPUP_IMAGE_ALT_PREFIX} ${feature.properties.Estación}"
          />
        </a>

    </div>
  </div>
  <div class="popup-content">
    <div class="popup-description">
      <p>${feature.properties.description}</p>
    </div>
    <a
      class="button button-block"
      href="${feature.properties.link}"
      >
      ${T.POPUP_MORE_INFO}
    </a>
  </div>
  `;
