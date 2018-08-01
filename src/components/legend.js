import { TEXT as T } from "../config";
const getArg = arg => (arg ? `'${arg}'` : null);

export default allLayers =>
  `<div class="legend-wrapper">
    <h4 class="overlay-box toggle-button" onClick="tcat.toggleLegend()">
        ${T.LEGEND_TITLE}
        <span id="legend-toggle-icon"></span>
    </h4>
    <div class="flex-child legend-inner">
			<div id="legend-items" class="overlay-box toggle-content">
          ${allLayers
            .map(layer => {
              if (layer.hasFilters) {
                return legendItemWithFilters(layer);
              }
              return legendItem(layer);
            })
            .join("")}
			</div>
      <div id="legend-footer" class="overlay-box toggle-content">
        <div onClick="tcat.noFilter()">${T.LEGEND_VIEW_ALL}</div>
      </div>
	</div>
</div>`;

const legendItem = ({ name, color, label }) => `
  <div
    class="legend-item active"
    id="${name}"
    onClick="tcat.handleLayerToggle(${getArg(name)})"
  >
    <span class="legend-key" style="background-color: ${color}"></span>
    <span class="label">${label}</span>
  </div>`;

const legendItemChild = ({ value, layerId, color, label }) => `
    <div
      class="legend-item active"
      id="${layerId}-${value}"
      onClick="tcat.handleFilterToggle(${getArg(layerId)}, ${getArg(value)})"
    >
      <span class="legend-key" style="background-color: ${color}"></span>
      <span class="label">${label}</span>
    </div>
`;

const legendItemWithFilters = ({ name, color, label, filters }) => `
  <div class="legend-item active" id="${name}">
    <span class="legend-key" style="background-color: ${color}"></span>
    <span class="label" onClick="tcat.handleFilterLayerToggle(${getArg(
      name
    )})">${label}</span>
    <div class="legend-items">
      ${filters.map(legendItemChild).join("")}
    </div>
  </div>
`;
