import React from 'react';
import { constraints } from './model';
import { TextField } from '../../helpers/FormHelper';
import validate from '../../helpers/ValidationHelper';

export const Form = ({ params, onChange }) => {
  const validated = validate(params, constraints) || {};
  return (
    <TextField
      id="format"
      name="format"
      label="Format"
      value={params.format || ''}
      onChange={onChange}
      errors={validated.format}
      fullWidth
      multiline
    />
  );
};

export const defaultParams = {
  format: 'Something changed: {{ diff }}',
};

export default { Form, defaultParams };
