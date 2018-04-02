export const mapBy = array => f =>
  array.reduce(
    (acc, item) => ({
      ...acc,
      [f(item)]: item,
    }),
    {},
  );

export const groupBy = array => f =>
  array.reduce((acc, item) => {
    const key = f(item);
    const next = [...(acc[key] || []), item];
    return { ...acc, [key]: next };
  }, {});

export const sortBy = array => (f, { reverse = false } = {}) => {
  const result = [...array];
  const direction = reverse ? -1 : 1;
  result.sort((a, b) => {
    const aVal = f(a);
    const bVal = f(b);
    if (aVal < bVal) {
      return direction * -1;
    } else if (bVal < aVal) {
      return direction;
    } else {
      return 0;
    }
  });
  return result;
};

export default { mapBy, groupBy, sortBy };
