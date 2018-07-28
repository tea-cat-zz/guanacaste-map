import { getVisibleLayers } from './utils';

export const getFilterHandler = map => (layerOrSymbolType, type = null, layerId = null) => {
  // Toggle Active Class
  const legendItem = document.getElementById(layerOrSymbolType);
  legendItem.classList.toggle('active');
  // If Symbol, toggle for the symbol in the layer filter
  if (type === 'symbol' && layerId) {
    map.visibleLayers[layerId][layerOrSymbolType] = !map.visibleLayers[layerId][layerOrSymbolType];

    const activeSymbolLayers = Object.keys(map.visibleLayers[layerId]).filter(
      key => map.visibleLayers[layerId][key]
    );
    if (activeSymbolLayers.length > 0) {
      map.setLayoutProperty(layerId, 'visibility', 'visible');
      return map.setFilter(layerId, [
        activeSymbolLayers.length === 1 ? '==' : 'in',
        'symbol',
        ...activeSymbolLayers
      ]);
    }
    // TODO: Until we figure out how to setFilter of none?
    return map.setLayoutProperty(layerId, 'visibility', 'none');
  }
  map.visibleLayers[layerOrSymbolType] = !map.visibleLayers[layerOrSymbolType];
  const isToggledOn = map.visibleLayers[layerOrSymbolType];

  // Toggle Layers
  map.setLayoutProperty(layerOrSymbolType, 'visibility', isToggledOn ? 'visible' : 'none');
  return;
};

export const getNoFilterHandler = (map, { filteredLayers, layerList }) => () => {
  filteredLayers.map(layer => map.setLayoutProperty(layer.name, 'visibility', 'visible'));
  filteredLayers.map(({ name }) => map.setFilter(name, null));
  map.visibleLayers = getVisibleLayers(layerList);
  const legendItemEls = document.querySelectorAll(`.legend-item`);
  [].forEach.call(legendItemEls, item => {
    item.classList.add('active');
  });
};
