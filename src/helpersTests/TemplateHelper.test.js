import test from 'ava';
import TemplateHelper from '../helpers/TemplateHelper';

test('embed', t => {
  const format = 'I am {{ user.name }}. {{ one }} is 1.';
  const embedded = TemplateHelper.embed(format)({
    one: 1,
    user: { name: 'jooohn' },
  });
  const expected = 'I am jooohn. 1 is 1.';
  t.is(embedded, expected);
});
