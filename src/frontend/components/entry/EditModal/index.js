import React from 'react';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import validate from 'validate.js';
import EntryModel from '../../../../models/entry';
import EntryApi from '../../../apis/entry-api';
import steps from './steps';
import { allFrontendSources } from '../../../../sources/frontend';
import { allFrontendSinks } from '../../../../sinks/frontend';

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.spacing.unit * 100,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 4,
  },
  formControl: {
    minWidth: 120,
  },
  stepContent: {
    minHeight: theme.spacing.unit * 30,
  },
});

const lastStepIndex = steps.length - 1;

const defaultSourceType = Object.keys(allFrontendSources)[0];
const defaultSinkType = 'Slack';
const defaultEntry = {
  label: 'My awesome watchlist entry',
  sourceType: defaultSourceType,
  sourceParams: allFrontendSources[defaultSourceType].defaultParams,
  sinkType: defaultSinkType,
  sinkParams: allFrontendSinks[defaultSinkType].defaultParams,
  frequency: 'EVERY_15_MINUTES',
};
const defaultState = {
  activeStepIndex: 0,
  entry: defaultEntry,
  passedEntry: null,
};

const NextButton = withStyles(styles)(({ onClick, disabled, classes }) => (
  <Button
    onClick={onClick}
    variant="flat"
    color="default"
    disabled={disabled}
    className={classes.button}
  >
    Next
  </Button>
));

const SaveButton = withStyles(styles)(({ onClick, disabled, classes }) => (
  <Button
    onClick={onClick}
    variant="raised"
    color="primary"
    disabled={disabled}
    className={classes.button}
  >
    Save
  </Button>
));

class EditModal extends React.PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    const passedEntry = props.entry;
    if (props.entry === state.passedEntry) {
      return { passedEntry };
    } else {
      // Entry changed.
      const entry = props.entry;
      return {
        entry: entry || defaultState.entry,
        passedEntry,
        activeStepIndex: entry ? 1 : 0,
      };
    }
  };

  state = defaultState;

  handleChange = event => {
    const { name, value } = event.target;
    const currentEntry = this.state.entry;
    const nextEntry = {
      ...currentEntry,
      [name]: event.target.value,
      sourceParams:
        name === 'sourceType'
          ? allFrontendSources[value].defaultParams
          : currentEntry.sourceParams,
      sinkParams:
        name === 'sinkType'
          ? allFrontendSinks[value].defaultParams
          : currentEntry.sinkParams,
    };
    this.setState({ entry: nextEntry });
  };

  handleSourceParamsChange = event => {
    this.setState({
      entry: {
        ...this.state.entry,
        sourceParams: {
          ...this.state.entry.sourceParams,
          [event.target.name]: event.target.value,
        },
      },
    });
  };

  handleSinkParamsChange = event => {
    this.setState({
      entry: {
        ...this.state.entry,
        sinkParams: {
          ...this.state.entry.sinkParams,
          [event.target.name]: event.target.value,
        },
      },
    });
  };

  handleBack = () => {
    const { activeStepIndex } = this.state;
    this.setState({ activeStepIndex: activeStepIndex - 1 });
  };

  handleNext = () => {
    const { activeStepIndex } = this.state;
    if (activeStepIndex !== lastStepIndex) {
      this.setState({ activeStepIndex: activeStepIndex + 1 });
    } else {
    }
  };

  handleSave = async () => {
    const { entry } = this.state;
    try {
      const saved = this.editing()
        ? await EntryApi.update(entry._id)(entry)
        : await EntryApi.create(entry);
      this.handleClose(saved);
    } catch (e) {
      console.error(e);
    }
  };

  handleClose = (entry = null) => {
    this.setState(defaultState);
    this.props.onClose(entry);
  };

  editing = () => !!this.state.entry._id;

  render = () => {
    const { open, classes } = this.props;
    const { entry, activeStepIndex } = this.state;
    const activeStep = steps[activeStepIndex];
    const validated = validate(entry, EntryModel.constraints) || {};
    const canReturn =
      activeStepIndex > 1 || (activeStepIndex === 1 && !this.editing());
    return (
      <Modal
        open={open}
        onClose={this.handleClose}
        aria-labelledby="entry-edit-modal"
        aria-describedby="Edit entry"
      >
        <div className={classes.paper}>
          <form>
            <Stepper activeStep={activeStepIndex}>
              {steps.map(({ label }) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className={classes.stepContent}>
              <activeStep.Content
                entry={entry}
                validated={validated}
                onChange={this.handleChange}
                onSourceParamsChange={this.handleSourceParamsChange}
                onSinkParamsChange={this.handleSinkParamsChange}
              />
            </div>
            <div>
              <Button
                disabled={!canReturn}
                onClick={this.handleBack}
                className={classes.button}
              >
                Back
              </Button>
              {activeStepIndex === lastStepIndex && (
                <SaveButton
                  type="submit"
                  onClick={this.handleSave}
                  disabled={!activeStep.isValid(validated)}
                />
              )}
              {activeStepIndex !== lastStepIndex && (
                <NextButton
                  type="submit"
                  onClick={this.handleNext}
                  disabled={!activeStep.isValid(validated)}
                />
              )}
            </div>
          </form>
        </div>
      </Modal>
    );
  };
}

export default withStyles(styles)(EditModal);
