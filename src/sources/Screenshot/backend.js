import util from 'util';
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import sharp from 'sharp';
import compareImages from 'resemblejs/compareImages';

const { promisify } = util;


const getSize = async base64 => {
  const png = new PNG();
  const { width, height } = await promisify(png.parse.bind(png))(Buffer.from(base64, 'base64'));
  return { width, height };
};

export const withParams = ({ url, selector = '', diffThreshold = 0.1 }) => {
  const hasSelector = selector && selector.length > 0;

  const takeScreenshot = async page => {
    const commonOptions = { type: 'png', encoding: 'base64'};
    if (hasSelector) {
      await page.mainFrame().waitForSelector(selector);
      const clip = await page.evaluate(sel => {
        const element = document.querySelector(sel);
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }, selector);
      return await page.screenshot({ ...commonOptions, clip });
    } else {
      return await page.screenshot({ ...commonOptions, fullPage: true });
    }
  };

  const detectDiff = async ({ before, after }) => {
    const options = {
      output: {
        largeImageThreshold: 2400,
      },
      scaleToSameSize: true,
      ignore: "antialiasing"
    };

    const [sizeBefore, sizeAfter] = await Promise.all([
      getSize(before),
      getSize(after),
    ]);

    const width = Math.max(sizeBefore.width, sizeAfter.width);
    const height = Math.max(sizeBefore.height, sizeAfter.height);
    const [resizedBefore, resizedAfter] = await Promise.all([
      sharp(Buffer.from(before, 'base64')).resize(width, height).toBuffer(),
      sharp(Buffer.from(after, 'base64')).resize(width, height).toBuffer(),
    ]);

    return await compareImages(resizedBefore, resizedAfter, options);
  };

  const fetch = async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      const screenshot = await takeScreenshot(page);
      return screenshot.toString('base64');
    } finally {
      browser.close().catch(console.error);
    }
  };

  const isChanged = async ({ before, after }) => {
    try {
      const diff = await detectDiff({ before, after });
      return Number(diff.misMatchPercentage) > diffThreshold;
    } catch (e) {
      console.error(e);
      return true;
    }
  };

  const diffOf = async ({ before, after }) => {
    if (!after) {
      return null;
    }
    if (!before) {
      return after;
    }

    try {
      const diff= await detectDiff({ before, after });
      return diff.getBuffer().toString('base64');
    } catch (e) {
      console.error(e);
      return after;
    }
  };

  return { fetch, diffOf, isChanged };
};

export default { withParams };
