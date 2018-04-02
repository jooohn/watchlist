import validate from 'validate.js';

validate.validators.nested = (value, options) => {
  const errors = validate(value, options.constraints, { format: 'flat' });
  if (errors) {
    return `is invalid: ${errors.join(',')}`;
  }
};

export default validate;
