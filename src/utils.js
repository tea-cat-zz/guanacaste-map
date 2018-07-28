import { SOURCE_TYPES } from './config';

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
