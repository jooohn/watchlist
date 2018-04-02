import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { allFrequencies } from '../../../models/frequency';
import { allFrontendSources } from '../../../sources/frontend';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';

const styles = theme => ({});

const ParamList = ({ params, CustomParam }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>key</TableCell>
        <TableCell>value</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Object.keys(params).map(key => (
        <TableRow key={key}>
          <TableCell>{key}</TableCell>
          <TableCell>{CustomParam ? <CustomParam name={key} value={params[key]} /> : params[key]}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const Source = withStyles(styles)(({ entry, classes, concise = false }) => (
  <section className={classes.section}>
    {!concise && (
      <Typography variant="display1" gutterBottom>
        Source
      </Typography>
    )}
    <Typography variant="headline">{entry.sourceType}</Typography>
    <div>
      <ParamList
        params={entry.sourceParams}
        CustomParam={allFrontendSources[entry.sourceType].Param}
      />
    </div>
  </section>
));

export const Sink = withStyles(styles)(({ entry, classes }) => (
  <section className={classes.section}>
    <Typography variant="display1" gutterBottom>
      Sink
    </Typography>
    <Typography variant="headline">{entry.sinkType}</Typography>
    <div>
      <ParamList params={entry.sinkParams} />
    </div>
  </section>
));

const Frequency = withStyles(styles)(({ entry, classes }) => (
  <section className={classes.section}>
    <Typography variant="display1" gutterBottom>
      Frequency
    </Typography>
    <Typography variant="headline">
      {allFrequencies[entry.frequency].label}
    </Typography>
  </section>
));

export default { Source, Sink, Frequency };
