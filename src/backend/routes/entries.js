import express from 'express';
import Entry from '../../models/entry';
import fallback from '../fallback';
import validate from '../../helpers/ValidationHelper';

export default ({ repositories: { entryRepository, snapshotRepository } }) => {
  const router = express.Router();

  router
    .get(
      '/',
      fallback(async (req, res) => {
        // TODO: paging
        const entries = await entryRepository.resolveAll();
        res.send(entries);
      }),
    )
    .post(
      '/',
      fallback(async (req, res) => {
        const entry = req.body;
        const errors = validate(entry, Entry.constraints);
        if (errors) {
          return res.status(400).send({ errors });
        }

        const saved = await entryRepository.store(entry);
        res.status(201).send({ entry: saved });
      }),
    )
    .get(
      '/:id',
      fallback(async (req, res) => {
        const entry = await entryRepository.resolve(req.params.id);
        res.send(entry);
      }),
    )
    .put(
      '/:id',
      fallback(async (req, res) => {
        const entry = req.body;
        const errors = validate(entry, Entry.constraints);
        if (errors) {
          return res.status(400).send({ errors });
        }
        const saved = await entryRepository.update(req.params.id)(entry);
        res.send(saved);
      }),
    )
    .delete(
      '/:id',
      fallback(async (req, res) => {
        const entry = await entryRepository.resolve(req.params.id);
        await snapshotRepository.removeByEntryId(entry._id);
        await entryRepository.remove(entry._id);
        res.status(200).send(entry);
      }),
    )
    .get(
      '/:id/snapshots',
      fallback(async (req, res) => {
        const snapshots = await snapshotRepository.resolveAllForEntry(
          req.params.id,
        );
        res.send(snapshots);
      }),
    );

  return router;
};
