import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { allFrontendSources } from '../../../sources/frontend';

const styles = {};

const EmptySnapshot = () => <div>Wait until first snapshot...</div>;

const SnapshotDiff = ({ entry }) => {
  const source = allFrontendSources[entry.sourceType];
  const snapshot = entry.latestSnapshot;
  if (!snapshot) {
    return <EmptySnapshot />;
  }

  return (
    <React.Fragment>
      <Typography variant="headline">
        {entry.latestSnapshot.createdAt}
      </Typography>
      <source.Diff entry={entry} snapshot={snapshot} />
    </React.Fragment>
  );
};

export default withStyles(styles)(SnapshotDiff);
