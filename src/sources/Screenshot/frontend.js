import React from 'react';
import { withStyles } from 'material-ui/styles';
import validate from '../../helpers/ValidationHelper';
import { constraints } from './model';
import { TextField } from '../../helpers/FormHelper';

const Form = ({ params, onChange }) => {
  const validated = validate(params, constraints) || {};
  return (
    <TextField
      id="url"
      name="url"
      label="URL"
      value={params.url || ''}
      onChange={onChange}
      errors={validated.url}
      fullWidth
    />
  );
};

const Param = withStyles(theme => ({
  link: {
    color: theme.palette.secondary.main,
  }
}))(({ name, value, classes }) => {
  switch (name) {
    case 'url':
      return <a href={value} target="_blank" className={classes.link}>{value}</a>;
    default:
      return null;
  }
});

const diffStyles = {
  img: {
    width: '100%',
  },
};
export const Diff = withStyles(diffStyles)(({ entry, snapshot, classes }) => (
  <div>
    <img
      className={classes.img}
      src={`data:image/png;base64, ${snapshot.diff}`}
    />
  </div>
));

export const defaultParams = {
  url: 'https://example.com',
};

export default { Form, Param, Diff, defaultParams };
