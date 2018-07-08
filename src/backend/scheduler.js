import checker from './checker';
import { allFrequencies } from '../models/frequency';

const millisInMinute = 1000 * 60;
const baseInterval = 15;
const tickPerDay = (60 / baseInterval) * 24;

const nextTick = tick => (tick + 1) % tickPerDay;
const shouldCheckOn = tick => entry =>
  (tick * baseInterval) % allFrequencies[entry.frequency].duration === 0;

export default injection => {
  let tick = 0;

  const check = checker(injection);

  const interval = setInterval(() => {
    const shouldCheck = shouldCheckOn(tick);

    injection.repositories.entryRepository
      .resolveAll()
      .then(entries => {
        const promises = entries.filter(shouldCheck).map(check);
        return Promise.all(promises);
      })
      .catch(console.error);

    tick = nextTick(tick);
  }, millisInMinute * baseInterval);
  return () => clearInterval(interval);
};
