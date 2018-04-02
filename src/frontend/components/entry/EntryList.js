import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Link from 'next/link';
import { allFrequencies } from '../../../models/frequency';
import { withStyles } from 'material-ui/styles';

const entrySummary = ({ sourceType, sinkType, frequency }) =>
  `${sourceType} / ${sinkType} / ${allFrequencies[frequency].label}`;

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
});

class EntryList extends React.Component {
  render = () => {
    const { entries, classes } = this.props;
    return (
      <div className={classes.root}>
        <List component="ul">
          {entries.map(entry => (
            <Link
              key={entry._id}
              as={`/entries/${entry._id}`}
              href={{ pathname: '/entries/show', query: { id: entry._id } }}
              prefetch
            >
              <ListItem button>
                <ListItemText
                  primary={entry.label}
                  secondary={entrySummary(entry)}
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    );
  };
}

export default withStyles(styles)(EntryList);
