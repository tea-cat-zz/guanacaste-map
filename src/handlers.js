import { LAYERS } from "./config";
import { getVisibleLayers } from "./utils";

/**
 Toggles the entire layer for a layer without a filter
**/
export const getLayerToggleHandler = map => layerId => {
  // toggle class
  const legendItem = document.getElementById(layerId);
  legendItem.classList.toggle("active");
  // toggle state
  map.visibleLayers[layerId] = !map.visibleLayers[layerId];
  const isToggledOn = map.visibleLayers[layerId];
  const visibility = isToggledOn ? "visible" : "none";
  // toggle layer visibility
  return map.setLayoutProperty(layerId, "visibility", visibility);
};

/**
 Toggles the entire layer for a layer with a filter
**/
export const getFilterLayerToggleHandler = map => layerId => {
  const legendItem = document.getElementById(layerId);
  legendItem.classList.toggle("active");
  const legendItemEls = document.querySelectorAll(`#${layerId} .legend-item`);
  const currentLayerState = map.visibleLayers[layerId];

  // if any items were active, they are now all inactive
  const isToggledOn = !Object.values(currentLayerState).some(item => item);

  // Toggle the active class for children

  [].forEach.call(legendItemEls, item => {
    isToggledOn
      ? item.classList.add("active")
      : item.classList.remove("active");
  });

  const visibility = isToggledOn ? "visible" : "none";

  // update map.visibleLayers state
  map.visibleLayers[layerId] = Object.keys(currentLayerState).reduce(
    (agg, value) => ({ ...agg, [value]: isToggledOn }),
    {}
  );

  // If we are toggling the layer back on, display everything
  isToggledOn && map.setFilter(layerId, null);

  // Toggle Layer visibility
  return map.setLayoutProperty(layerId, "visibility", visibility);
};

/**
 * Toggles just the filter item.
 */
export const getFilterToggleHandler = map => (layerId, value) => {
  // Toggle Active Class
  const legendItem = document.getElementById(`${layerId}-${value}`);
  legendItem.classList.toggle("active");

  if (layerId) {
    const layerConfig = LAYERS[layerId];
    const layerData = map.visibleLayers[layerId];
    map.visibleLayers[layerId][value] = !layerData[value];
    // If this filter is active, it's parent should be active too
    if (map.visibleLayers[layerId][value]) {
      document.getElementById(layerId).classList.add("active");
    }
    if (!Object.values(map.visibleLayers[layerId]).some(item => item)) {
      document.getElementById(layerId).classList.remove("active");
    }

    const activeFilterLayers = Object.keys(layerData).filter(
      key => layerData[key]
    );
    if (activeFilterLayers.length > 0) {
      map.setLayoutProperty(layerId, "visibility", "visible");
      // build the filter query, using filterOn for the field to filter on,
      // and spreading the activeFilterLayers
      return map.setFilter(layerId, [
        activeFilterLayers.length === 1 ? "==" : "in",
        layerConfig.filterOn,
        ...activeFilterLayers
      ]);
    }

    // TODO: Until we figure out how to setFilter of none?
    return map.setLayoutProperty(layerId, "visibility", "none");
  }
};

/**
 * To reset the entire layer/filter state
 */
export const getNoFilterHandler = (
  map,
  { filteredLayers, layerList }
) => () => {
  filteredLayers.map(layer =>
    map.setLayoutProperty(layer.name, "visibility", "visible")
  );
  filteredLayers.map(({ name }) => map.setFilter(name, null));
  map.visibleLayers = getVisibleLayers(layerList);
  const legendItemEls = document.querySelectorAll(`.legend-item`);
  [].forEach.call(legendItemEls, item => {
    item.classList.add("active");
  });
};
