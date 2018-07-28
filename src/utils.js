import { SOURCE_TYPES, LAYERS } from './config';

export const getVisibleLayers = layerList =>
  layerList.filter(({ id }) => id.substring(0, 7) === 'toggle-').reduce((agg, layer) => {
    let result = { [layer.id]: true };
    if (layer.id === 'toggle-turismo') {
      result[layer.id] = SOURCE_TYPES.filter(({ layerId }) => layerId === layer.id).reduce(
        (agg, { name }) => Object.assign({ [name]: true }, agg),
        {}
      );
    }
    return Object.assign(result, agg);
  }, {});

export const getFilteredLayers = layerList =>
  layerList
    .filter(layer => {
      const layerName = layer.id;
      if (layerName.substring(0, 7) === 'toggle-' && layerName !== 'toggle-turismo') {
        return true;
      }
      return false;
    })
    .map(layer => ({
      name: layer.id,
      label: LAYERS[layer.id] ? LAYERS[layer.id].label : layer.id.substring(7),
      type: 'layer',
      color: LAYERS[layer.id] ? LAYERS[layer.id].color : 'darkgrey'
    }));
