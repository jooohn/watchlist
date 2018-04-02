import test from 'ava';
import validate from '../helpers/ValidationHelper';
import { constraints } from './entry';

test('sourceType accepts one of source models.', t => {
  const valid = validate.single('Screenshot', constraints.sourceType);
  t.is(valid, undefined);
});

test('sourceType denys names which is not listed as source models', t => {
  const invalid = validate.single('SuperGreatModule', constraints.sourceType);
  t.deepEqual(invalid, ['SuperGreatModule is not included in the list']);
});

test('sourceParams is not checked if sourceType is absent.', t => {
  const validated = validate({}, constraints);
  t.is(validated.sourceParams, undefined);
});

test('sourceParams constraints depend on sourceType', t => {
  const validated = validate(
    {
      sourceType: 'Screenshot',
      sourceParams: {},
    },
    constraints,
  );
  t.deepEqual(validated.sourceParams, [
    "Source params is invalid: Url can't be blank",
  ]);
});

test('sinkType accepts one of sink modules.', t => {
  const valid = validate.single('Console', constraints.sinkType);
  t.is(valid, undefined);
});

test('sinkType denys names which is not listed as sink models', t => {
  const invalid = validate.single('SuperGreatModule', constraints.sinkType);
  t.deepEqual(invalid, ['SuperGreatModule is not included in the list']);
});

test('sinkParams is not checked if sinkType is absent', t => {
  const validated = validate({}, constraints);
  t.is(validated.sinkParams, undefined);
});

test('sinkParams constraints depend on sinkType', t => {
  const validated = validate(
    {
      sinkType: 'Console',
      sinkParams: {},
    },
    constraints,
  );
  t.deepEqual(validated.sinkParams, [
    "Sink params is invalid: Format can't be blank",
  ]);
});
