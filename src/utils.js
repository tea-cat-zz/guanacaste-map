import { LAYERS, LAYERS_ACTIVE } from "./config";

const filteringLayers = Object.entries(LAYERS)
  .filter(
    ([, { filters, filterOn }]) =>
      filterOn && filters && filters.length && filters.length > 0
  )
  .map(([layerName, { filters = [], filterOn }]) => {
    return {
      name: layerName,
      filterOn,
      filters
    };
  });

export const filteringLayersList = filteringLayers.map(({ name }) => name);
const hasToggle = ({ id }) => id.substring(0, 7) === "toggle-";

export const getVisibleLayers = (layerList, forceValue = LAYERS_ACTIVE) =>
  layerList.filter(hasToggle).reduce((agg, layer) => {
    let result = { [layer.id]: forceValue };
    let layerIndex = filteringLayersList.indexOf(layer.id);
    if (layerIndex >= 0) {
      const layer = filteringLayers[layerIndex];
      result[layer.name] = layer.filters.reduce(
        (agg, { value }) => Object.assign({ [value]: forceValue }, agg),
        {}
      );
    }
    return Object.assign(result, agg);
  }, {});

export const getFilteredLayers = layerList =>
  layerList.filter(hasToggle).map(layer => {
    const layerC = LAYERS[layer.id];
    const hasFilters = layerC.filters && !!layerC.filters.length;
    return {
      ...layerC,
      hasFilters,
      filters:
        hasFilters &&
        layerC.filters.map(filter => ({ ...filter, layerId: layer.id })),
      name: layer.id,
      label: layerC && layerC.label ? layerC.label : layer.id.substring(7)
    };
  });
