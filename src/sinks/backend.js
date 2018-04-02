import { moduleOfType } from '../helpers/ModuleHelper';
import * as sinks from './**/backend.js';
export const allBackendSinks = sinks;
export const backendSinkOfType = moduleOfType(allBackendSinks);

export default { allBackendSinks, backendSinkOfType };
