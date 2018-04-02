import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';
import Router from 'next/router';
import withRoot from '../../src/frontend/withRoot';
import EntryApi from '../../src/frontend/apis/entry-api';
import SnapshotApi from '../../src/frontend/apis/snapshot-api';
import Layout, { gridSpacing } from '../../src/frontend/components/Layout';
import EditModal from '../../src/frontend/components/entry/EditModal';
import EntryDetail from '../../src/frontend/components/entry/EntryDetail';
import Grid from 'material-ui/Grid';
import {
  frontendSourceOfType,
} from '../../src/sources/frontend';

const styles = theme => ({
  title: {
    textAlign: 'center',
    margin: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  icons: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  gridBase: {
    flexGrow: 1,
    marginRight: gridSpacing / 2,
    marginLeft: gridSpacing / 2,
  },
  snapshots: {
    marginTop: theme.spacing.unit * 2,
  },
});

const IconButton = withStyles(theme => ({
  button: {
    marginLeft: theme.spacing.unit * 2,
  },
  text: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  icon: {},
}))(({ icon, label, text, color, onClick, classes }) => (
  <Button
    variant="raised"
    size="small"
    color={color}
    area-label={label}
    onClick={onClick}
    className={classes.button}
  >
    <span className={classes.text}>{label}</span>
    <Icon className={classes.icon}>{icon}</Icon>
  </Button>
));

const SnapshotDiff = ({ entry, snapshot }) => {
  const Diff = frontendSourceOfType(entry.sourceType).Diff;
  return (
    <React.Fragment>
      <Typography variant="display1" gutterBottom>
        {snapshot.createdAt}
      </Typography>
      {snapshot.succeeded && (<Diff entry={entry} snapshot={snapshot} />)}
      {!snapshot.succeeded && (
        <Typography variant="body2" color="error">
          [FAILED] {snapshot.error}
        </Typography>
      )}
    </React.Fragment>
  );
};

const DeleteDialog = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose(false)}
    area-describedby="delete-dialog-description"
  >
    <DialogContent>
      <DialogContentText id="delete-dialog-description">
        Are you sure you want to delete this entry?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose(false)} color="default">
        Cancel
      </Button>
      <Button onClick={onClose(true)} color="secondary" variant="raised">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

class Show extends React.Component {
  static getInitialProps = async ({ query }) => {
    const entryId = query.id;
    const entryRequest = EntryApi.show(entryId);
    const snapshotRequest = SnapshotApi.indexByEntryId(entryId);
    const [entryResponse, snapshotResponse] = await Promise.all([
      entryRequest,
      snapshotRequest,
    ]);
    return { entry: entryResponse.data, snapshots: snapshotResponse.data };
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const { entry, snapshots } = nextProps;
    return { entry, snapshots };
  };

  state = {
    entry: null,
    tab: 0,
    editModalOpen: false,
    deleteDialogOpen: false,
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  handleEditModalOpen = () => {
    this.setState({ editModalOpen: true });
  };

  handleEditModalClose = edited => {
    this.setState({ editModalOpen: false });
    if (edited) {
      this.reload().catch(console.error);
    }
  };

  handleDeleteDialogOpen = () => {
    this.setState({
      deleteDialogOpen: true,
    });
  };

  handleDeleteDialogClose = shouldDelete => async () => {
    try {
      if (shouldDelete) {
        await EntryApi.destroy(this.props.entry._id);
        Router.push('/');
      }
      this.setState({
        deleteDialogOpen: false,
      });
    } catch (e) {
      console.error(e);
    }
  };

  reload = async () => {
    const { data } = await EntryApi.show(this.state.entry._id);
    this.setState({ entry: data });
  };

  render = () => {
    const { classes } = this.props;
    const {
      entry,
      snapshots,
      tab,
      editModalOpen,
      deleteDialogOpen,
    } = this.state;
    return (
      <Layout>
        <EditModal
          open={editModalOpen}
          onClose={this.handleEditModalClose}
          entry={entry}
        />
        <DeleteDialog
          open={deleteDialogOpen}
          onClose={this.handleDeleteDialogClose}
        />
        <div className={classes.title}>
          <Typography variant="display2" gutterBottom>
            {entry.label}
          </Typography>
        </div>
        <Paper className={classes.root}>
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Changes" />
            <Tab label="Definition" />
          </Tabs>
        </Paper>
        <Grid container justify="center" spacing={24}>
          <Grid item md={8}>
            <div className={classes.gridBase}>
              {tab === 0 && (
                <div className={classes.snapshots}>
                  <Paper className={classes.paper}>
                    <EntryDetail.Source entry={entry} concise />
                  </Paper>
                  {snapshots.map(snapshot => (
                    <Paper key={snapshot._id} className={classes.paper}>
                      <SnapshotDiff entry={entry} snapshot={snapshot} />
                    </Paper>
                  ))}
                </div>
              )}
              {tab === 1 && (
                <React.Fragment>
                  <div className={classes.icons}>
                    <IconButton
                      icon="mode_edit"
                      label="EDIT"
                      color="primary"
                      onClick={this.handleEditModalOpen}
                    />
                    <IconButton
                      icon="delete"
                      label="DELETE"
                      color="secondary"
                      alia-label="DELETE"
                      onClick={this.handleDeleteDialogOpen}
                    />
                  </div>
                  <Paper className={classes.paper}>
                    <EntryDetail.Source entry={entry} />
                  </Paper>
                  <Paper className={classes.paper}>
                    <EntryDetail.Sink entry={entry} />
                  </Paper>
                  <Paper className={classes.paper}>
                    <EntryDetail.Frequency entry={entry} />
                  </Paper>
                </React.Fragment>
              )}
            </div>
          </Grid>
        </Grid>
      </Layout>
    );
  };
}
export default withRoot(withStyles(styles)(Show));
