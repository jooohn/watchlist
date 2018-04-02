import React from 'react';

import MuiTextField from 'material-ui/TextField';
import MuiSelect from 'material-ui/Select';
import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export const withErrors = render => {
  class Wrapped extends React.Component {
    static getDerivedStateFromProps = (nextProps, prevState) => {
      const { value } = nextProps;
      const showError = value !== prevState.value || prevState.showError;
      return { value, showError };
    };

    constructor(props, context) {
      super(props, context);
      this.state = {
        value: props.value,
        showError: false,
      };
    }

    onBlur = e => {
      const { onBlur } = this.props;
      if (onBlur) {
        onBlur(e);
      }
      this.setState({ showError: true });
    };

    render = () => {
      const props = this.props;
      const { errors } = props;
      const { showError } = this.state;
      const error = showError && !!errors && errors.length > 0;
      const message = error && errors[0];
      return render({ props, error, message, onBlur: this.onBlur });
    };
  }
  return Wrapped;
};

export const TextField = withErrors(({ props, error, message, onBlur }) => (
  <MuiTextField
    {...{
      ...props,
      error,
      helperText: message,
      onBlur,
    }}
  />
));

export const Select = withErrors(({ props, error, message, onBlur }) => {
  const { formControlProps } = props;
  const reducedProps = { ...props };
  delete reducedProps.formControlProps;
  return (
    <FormControl
      {...{
        ...(formControlProps || {}),
        error,
      }}
    >
      <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
      <MuiSelect
        {...{
          ...reducedProps,
          error,
          onBlur,
        }}
      />
      <FormHelperText>{message}</FormHelperText>
    </FormControl>
  );
});

export default { TextField, Select };
