const newFrequency = (value, label, duration) => ({ label, value, duration });

const frequencies = [
  newFrequency('EVERY_15_MINUTES', 'Every 15 minutes', 15),
  newFrequency('EVERY_HOUR', 'Every hour', 60),
  newFrequency('EVERY_DAY', 'Every day', 60 * 60),
];

export const allFrequencies = frequencies.reduce(
  (acc, f) =>
    Object.assign({
      ...acc,
      [f.value]: f,
    }),
  {},
);

export default { allFrequencies };
