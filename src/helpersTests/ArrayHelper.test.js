import test from 'ava';
import ArrayHelper from '../helpers/ArrayHelper';

test('groupBy groups array by func', t => {
  const actual = ArrayHelper.groupBy(['ABC', 'DEFG', 'HI', 'JKL', 'MN'])(
    s => s.length,
  );
  const expected = {
    3: ['ABC', 'JKL'],
    4: ['DEFG'],
    2: ['HI', 'MN'],
  };
  t.deepEqual(actual, expected);
});

test('sortBy sorts array by func', t => {
  const actual = ArrayHelper.sortBy(['ABC', 'DEFG', 'HI', 'JKL', 'MN'])(
    s => s.length,
  );
  const expected = ['HI', 'MN', 'ABC', 'JKL', 'DEFG'];
  t.deepEqual(actual, expected);
});

test('sortBy sorts array in reverse order if specified', t => {
  const actual = ArrayHelper.sortBy(['ABC', 'DEFG', 'HI', 'JKL', 'MN'])(
    s => s.length,
    { reverse: true },
  );
  const expected = ['DEFG', 'ABC', 'JKL', 'HI', 'MN'];
  t.deepEqual(actual, expected);
});
