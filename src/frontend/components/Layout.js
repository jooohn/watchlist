import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Link from 'next/link';

export const gridSpacing = 24;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  title: {
    textDecoration: 'none',
    color: 'white',
  },
});

const Layout = ({ classes, children }) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit" className={classes.flex}>
          <Link href="/">
            <a className={classes.title}>Watchlist</a>
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
    {children}
  </div>
);
export default withStyles(styles)(Layout);
