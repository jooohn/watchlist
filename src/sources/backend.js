import { moduleOfType } from '../helpers/ModuleHelper';
import * as sources from './*/backend.js';
export const allBackendSources = sources;
export const backendSourceOfType = moduleOfType(allBackendSources);

export default { allBackendSources, backendSourceOfType };
