import axios from 'axios';
import config from '../../config';
import { isBrowser } from '../../helpers/Universal';

const baseURL = isBrowser ? '' : `http://localhost:${config.web.port}`;

export const instance = axios.create({
  baseURL: `${baseURL}/api/`,
});
