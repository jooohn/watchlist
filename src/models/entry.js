import { allSourceModels } from '../sources/model';
import { allSinkModels } from '../sinks/model';
import { allFrequencies } from './frequency';

export const constraints = {
  label: {
    presence: { allowEmpty: false },
  },
  sourceType: {
    presence: true,
    inclusion: Object.keys(allSourceModels),
  },
  sourceParams: (value, attributes) => {
    const sourceModel = allSourceModels[attributes.sourceType];
    return sourceModel
      ? { presence: true, nested: { constraints: sourceModel.constraints } }
      : null;
  },
  sinkType: {
    presence: true,
    inclusion: Object.keys(allSinkModels),
  },
  sinkParams: (value, attributes) => {
    const sinkModel = allSinkModels[attributes.sinkType];
    return sinkModel
      ? { presence: true, nested: { constraints: sinkModel.constraints } }
      : null;
  },
  frequency: {
    inclusion: Object.keys(allFrequencies),
  },
};

export default { constraints };
