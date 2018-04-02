import React from 'react';
import { Select, TextField } from '../../../../helpers/FormHelper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import { allFrontendSources } from '../../../../sources/frontend';
import { allFrontendSinks } from '../../../../sinks/frontend';
import { allFrequencies } from '../../../../models/frequency';

const styles = theme => ({
  formControl: {
    minWidth: 120,
  },
});

const SourceForm = ({ source, params, onChange }) => {
  if (source) {
    return <source.Form params={params} onChange={onChange} />;
  } else {
    return null;
  }
};

const SourceStep = ({
  entry,
  validated,
  onChange,
  onSourceParamsChange,
  classes,
}) => (
  <React.Fragment>
    <Select
      label="Source"
      name="source-type"
      displayEmpty
      value={entry.sourceType}
      errors={validated.sourceType}
      onChange={onChange}
      autoFocus
      formControlProps={{
        className: classes.formControl,
        margin: 'normal',
      }}
      inputProps={{
        name: 'sourceType',
        id: 'source-type',
      }}
    >
      {Object.keys(allFrontendSources).map(key => (
        <MenuItem key={key} value={key}>
          {key}
        </MenuItem>
      ))}
    </Select>
    <SourceForm
      source={allFrontendSources[entry.sourceType]}
      params={entry.sourceParams}
      onChange={onSourceParamsChange}
    />
  </React.Fragment>
);

const SinkForm = ({ sink, params, onChange }) => {
  if (sink) {
    return <sink.Form params={params} onChange={onChange} />;
  } else {
    return null;
  }
};

const SinkStep = ({ entry, onChange, onSinkParamsChange, classes }) => (
  <React.Fragment>
    <Select
      label="Sink"
      name="sink-type"
      displayEmpty
      value={entry.sinkType}
      onChange={onChange}
      autoFocus
      formControlProps={{
        className: classes.formControl,
        margin: 'normal',
      }}
      inputProps={{
        name: 'sinkType',
        id: 'sink-type',
      }}
    >
      {Object.keys(allFrontendSinks).map(key => (
        <MenuItem key={key} value={key}>
          {key}
        </MenuItem>
      ))}
    </Select>
    <SinkForm
      sink={allFrontendSinks[entry.sinkType]}
      params={entry.sinkParams}
      onChange={onSinkParamsChange}
    />
  </React.Fragment>
);

const FrequencyStep = ({ entry, onChange, validated, classes }) => (
  <Select
    name="frequency"
    label="frequency"
    displayEmpty
    value={entry.frequency}
    onChange={onChange}
    errors={validated.frequency}
    autoFocus
    formControlProps={{
      className: classes.formControl,
      margin: 'normal',
    }}
    inputProps={{
      name: 'frequency',
      id: 'frequency',
    }}
  >
    {Object.keys(allFrequencies).map(key => (
      <MenuItem key={key} value={key}>
        {allFrequencies[key].label}
      </MenuItem>
    ))}
  </Select>
);

const LabelStep = ({ entry, onChange, validated }) => (
  <TextField
    id="label"
    name="label"
    label="Label"
    value={entry.label}
    onChange={onChange}
    errors={validated.label}
    fullWidth
  />
);

const steps = [
  {
    label: 'Select source to watch',
    isValid: validated => !validated.sourceType && !validated.sourceParams,
    Content: withStyles(styles)(SourceStep),
  },
  {
    label: 'Select sink to execute when the source changed',
    isValid: validated => !validated.sinkType && !validated.sinkParams,
    Content: withStyles(styles)(SinkStep),
  },
  {
    label: 'Decide check frequency',
    isValid: validated => !validated.frequency,
    Content: withStyles(styles)(FrequencyStep),
  },
  {
    label: 'Name this entry',
    isValid: validated => !validated || Object.keys(validated).length === 0,
    Content: withStyles(styles)(LabelStep),
  },
];

export default steps;
