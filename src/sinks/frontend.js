import { moduleOfType } from '../helpers/ModuleHelper';
import * as sinks from './**/frontend.js';
export const allFrontendSinks = sinks;
export const frontendSinkOfType = moduleOfType(allFrontendSinks);

export default { allFrontendSinks, frontendSinkOfType };
