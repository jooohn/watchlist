import { moduleOfType } from '../helpers/ModuleHelper';
import * as models from './**/model.js';
export const allSinkModels = models;
export const sinkModelOfType = moduleOfType(allSinkModels);

export default { allSinkModels, sinkModelOfType };
