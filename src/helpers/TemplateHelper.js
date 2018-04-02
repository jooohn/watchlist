import Handlebars from 'handlebars';

export const embed = format => params => Handlebars.compile(format)(params);

export default { embed };
