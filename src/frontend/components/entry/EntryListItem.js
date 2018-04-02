import React from 'react';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { allFrequencies } from '../../../models/frequency';
import EntryDetail from './EntryDetail';
import SnapshotDiff from '../snapshot/SnapshotDiff';

const styles = theme => ({
  summary: {
    flexGrow: 1,
  },
  detail: {
    flexGrow: 1,
  },
  title: {},
  frequency: {
    textAlign: 'right',
  },
});

const EntryListItem = ({ entry, classes, expanded, onChange }) => (
  <ExpansionPanel expanded={expanded} onChange={onChange}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <div className={classes.summary}>
        <Grid container spacing={24}>
          <Grid item md>
            <Typography variant="title" className={classes.title}>
              {entry.label}
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Typography variant="subheading" className={classes.frequency}>
              {[
                entry.sourceType,
                entry.sinkType,
                allFrequencies[entry.frequency].label,
              ].join(' / ')}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <div className={classes.detail}>
        <Grid container spacing={24}>
          <Grid item sm={6}>
            <Typography variant="display1" gutterBottom>
              Latest Change
            </Typography>
            <SnapshotDiff entry={entry} />
          </Grid>
          <Grid item sm={6}>
            <EntryDetail entry={entry} />
          </Grid>
        </Grid>
      </div>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default withStyles(styles)(EntryListItem);
