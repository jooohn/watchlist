import util from 'util';
import puppeteer from 'puppeteer';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
const { promisify } = util;

export const fetch = async ({ url, fullPage = true }) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshot = await page.screenshot({ fullPage });
    return screenshot.toString('base64');
  } finally {
    browser.close().catch(console.error);
  }
};

const buildPNG = async base64 => {
  const png = new PNG();
  return await promisify(png.parse.bind(png))(Buffer.from(base64, 'base64'));
};

const readPNGData = png => {
  return new Promise((resolve, reject) => {
    png.pack();
    const chunks = [];
    png.on('data', chunks.push.bind(chunks));
    png.on('end', () => {
      try {
        resolve(Buffer.concat(chunks));
      } catch (e) {
        reject(e);
      }
    });
  });
};

export const compare = async ({ before, after }) => {
  if (!after.data) {
    return null;
  }
  if (!before.data) {
    return after.data;
  }

  const willBePngBefore = buildPNG(before.data);
  const willBePngAfter = buildPNG(after.data);
  const [pngBefore, pngAfter] = await Promise.all([
    willBePngBefore,
    willBePngAfter,
  ]);

  const { width, height } = pngAfter;
  const diff = new PNG({ width, height });
  pixelmatch(
    pngBefore.data,
    pngAfter.data,
    diff.data,
    pngAfter.width,
    pngAfter.height,
  );
  const diffData = await readPNGData(diff);
  return diffData.toString('base64');
};

export default { fetch, compare };
