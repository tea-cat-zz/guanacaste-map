import nanoHtml from "nanohtml";

import { toggleLegend } from "../handlers";

import { TEXT as T, LAYERS } from "../config";
// const getArg = arg => (arg ? `'${arg}'` : null);

function getLayerToggle(layerId) {
  return function toggleLayer(e) {
    e.preventDefault();
    window.tcat.handleLayerToggle(layerId);
  };
}
function getFilterLayerToggle(layerId) {
  return function toggleFilterLayer(e) {
    e.preventDefault();
    window.tcat.handleFilterLayerToggle(layerId);
  };
}

function getFilterItemToggle(layerId, value) {
  return function toggleFilterItem(e) {
    e.preventDefault();
    window.tcat.handleFilterToggle(layerId, value);
  };
}

export default allLayers =>
  nanoHtml`<div id="legend-wrapper" class="legend-wrapper">
    <h4 class="overlay-box toggle-button" onclick="${toggleLegend}">
        ${T.LEGEND_TITLE}
        <span id="legend-toggle-icon"></span>
    </h4>
    <div class="flex-child legend-inner">
			<div id="legend-items" class="overlay-box toggle-content">
          ${allLayers.map(layer => {
            if (layer.hasFilters) {
              return legendItemWithFilters(layer);
            }
            return legendItem(layer);
          })}
			</div>
      <div id="legend-footer" class="overlay-box toggle-content">
        <button class="button button-block-on-mobile" onclick=${
          window.tcat.handleShowAll
        }>${T.LEGEND_VIEW_ALL}</button>
        <button class="button button-block-on-mobile" onclick=${
          window.tcat.handleHideAll
        }>${T.LEGEND_VIEW_NONE}</button>
      </div>
	</div>
</div>`;

const legendItem = ({ name, color, label }) => nanoHtml`
  <div
    title="${T.LEGEND_ITEM_TOOLTIP_PREFIX} ${label}"
    class="legend-item"
    id="${name}"
    onclick=${getLayerToggle(name)}
  >
    <span class="legend-key" style="background-color: ${color}"></span>
    <span class="label">${label}</span>
  </div>`;

const legendItemChild = ({ value, layerId, color, label }) => nanoHtml`
    <div
      title="${T.LEGEND_ITEM_TOOLTIP_PREFIX} ${LAYERS[layerId].label}: ${value}"
      class="legend-item"
      id="${layerId}-${value}"
      onclick=${getFilterItemToggle(layerId, value)}
    >
      <span class="legend-key" style="background-color: ${color}"></span>
      <span class="label">${label}</span>
    </div>
`;

const legendItemWithFilters = ({ name, color, label, filters }) => nanoHtml`
  <div
    class="legend-item"
    id="${name}"
  >
    <span class="legend-key" style="background-color: ${color}"></span>
    <span
        class="label"
        title="${T.LEGEND_ITEM_TOOLTIP_PREFIX} ${label}"
        onclick=${getFilterLayerToggle(name)}
      >
        ${label}
      </span>
    <div class="legend-items">
      ${filters.map(legendItemChild)}
    </div>
  </div>
`;
