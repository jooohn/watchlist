import { instance } from './base';

export const create = async ({
  label,
  sourceType,
  sourceParams,
  sinkType,
  sinkParams,
  frequency,
}) =>
  instance.post('/entries', {
    label,
    sourceType,
    sourceParams,
    sinkType,
    sinkParams,
    frequency,
  });

export const update = id => async ({
  label,
  sourceType,
  sourceParams,
  sinkType,
  sinkParams,
  frequency,
}) =>
  instance.put(`/entries/${id}`, {
    label,
    sourceType,
    sourceParams,
    sinkType,
    sinkParams,
    frequency,
  });

export const index = async () => instance.get('/entries');

export const show = async id => instance.get(`/entries/${id}`);

export const destroy = async id => instance.delete(`/entries/${id}`);

export default { create, update, index, show, destroy };
