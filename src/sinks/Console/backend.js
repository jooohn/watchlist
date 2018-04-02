import { embed } from '../../helpers/TemplateHelper';

const run = ({ before, after, params }) =>
  console.log(embed(params.format)({ before, after }));

export default { run };
