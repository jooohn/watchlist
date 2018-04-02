import { instance } from './base';

export const indexByEntryId = async entryId =>
  instance.get(`/entries/${entryId}/snapshots`);

export default { indexByEntryId };
