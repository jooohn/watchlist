import React from 'react';
import { withStyles } from 'material-ui/styles';
import config from '../../config';
import { constraints } from './model';
import { TextField } from '../../helpers/FormHelper';
import validate from '../../helpers/ValidationHelper';

export const Form = withStyles(theme => ({
  textField: {
    marginBottom: theme.spacing.unit * 2,
  },
}))(({ params, onChange, classes }) => {
  const validated = validate(params, constraints) || {};
  return (
    <React.Fragment>
      <TextField
        id="text"
        name="text"
        label="text"
        className={classes.textField}
        value={params.text || ''}
        onChange={onChange}
        errors={validated.text}
        fullWidth
      />
      <TextField
        id="channel"
        name="channel"
        label="channel"
        className={classes.textField}
        value={params.channel || ''}
        onChange={onChange}
        errors={validated.channel}
        fullWidth
      />
      <TextField
        id="iconEmoji"
        name="iconEmoji"
        label="icon emoji"
        className={classes.textField}
        value={params.iconEmoji || ''}
        onChange={onChange}
        errors={validated.iconEmoji}
        fullWidth
      />
    </React.Fragment>
  );
});

export const defaultParams = {
  text: `[{{ entry.label }}] change detected. Check ${config.app.baseURL}/entries/{{ entry._id }}`,
  iconEmoji: ':male-detective:',
};

export default { Form, defaultParams };
