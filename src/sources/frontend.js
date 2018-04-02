import { moduleOfType } from '../helpers/ModuleHelper';
import * as sources from './**/frontend.js';
export const allFrontendSources = sources;
export const frontendSourceOfType = moduleOfType(allFrontendSources);

export default { allFrontendSources, frontendSourceOfType };
