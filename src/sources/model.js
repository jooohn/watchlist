import { moduleOfType } from '../helpers/ModuleHelper';
import * as models from './**/model.js';
export const allSourceModels = models;
export const sourceModelOfType = moduleOfType(allSourceModels);

export default { allSourceModels, sourceModelOfType };
