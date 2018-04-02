import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import withRoot from '../src/frontend/withRoot';
import EntryApi from '../src/frontend/apis/entry-api';
import EditModal from '../src/frontend/components/entry/EditModal';
import EntryList from '../src/frontend/components/entry/EntryList';
import Layout, { gridSpacing } from '../src/frontend/components/Layout';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingRight: gridSpacing / 2,
    paddingLeft: gridSpacing / 2,
  },
  buttonContainer: {
    textAlign: 'center',
    margin: theme.spacing.unit * 4,
  },
});

class Index extends React.Component {
  static getInitialProps = async ({}) => {
    const { data } = await EntryApi.index();
    return { entries: data };
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const { entries } = nextProps;
    return { entries };
  };

  constructor(props, context) {
    super(props, context);

    const { entries } = props;
    this.state = {
      entries,
      editModalOpen: false,
      editingEntry: null,
    };
  }

  reload = async () => {
    const { data } = await EntryApi.index();
    this.setState({ entries: data });
  };

  handleEditModal = ({ open, entry = null }) => edited => {
    this.setState({
      editModalOpen: open,
      editingEntry: entry,
    });
    if (!open && edited) {
      this.reload().catch(console.error);
    }
  };

  render() {
    const { classes } = this.props;
    const { entries, editModalOpen, editingEntry } = this.state;
    return (
      <Layout>
        <div className={classes.root}>
          <EditModal
            open={editModalOpen}
            entry={editingEntry}
            onClose={this.handleEditModal({ open: false })}
          />
          <Grid container justify="center" spacing={gridSpacing}>
            <Grid item sm={8}>
              <div className={classes.buttonContainer}>
                <Button
                  size="large"
                  variant="raised"
                  color="primary"
                  onClick={this.handleEditModal({ open: true })}
                >
                  New Entry
                </Button>
              </div>
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={gridSpacing}>
            <Grid item sm={8}>
              <EntryList entries={entries} />
            </Grid>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default withRoot(withStyles(styles)(Index));
