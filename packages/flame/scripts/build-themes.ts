import { theme as flameTheme, themeUI as flameThemeUI } from '../themes/flame';
import { theme as oldSkoolTheme } from '../themes/oldskool';
import { theme as darkTheme } from '../themes/dark';

// @ts-ignore
const fs = require('fs');

// lifted directly from https://raw.githubusercontent.com/hughsk/flat/master/index.js
function flatten(target: any, opts = {}) {
  // @ts-ignore
  const delimiter = opts.delimiter || '.';
  // @ts-ignore
  const maxDepth = opts.maxDepth;
  const output = {};

  function step(object?: any, prev?: any, currentDepth?: any) {
    // eslint-disable-next-line
    currentDepth = currentDepth || 1;
    // eslint-disable-next-line
    Object.keys(object).forEach((key: string) => {
      const value = object[key];
      // @ts-ignore
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isobject = type === '[object Object]' || type === '[object Array]';

      const newKey = prev ? prev + delimiter + key : key;

      if (
        !isarray &&
        isobject &&
        Object.keys(value).length &&
        // @ts-ignore
        (!opts.maxDepth || currentDepth < maxDepth)
      ) {
        return step(value, newKey, currentDepth + 1);
      }
      // @ts-ignore
      output[newKey] = value;
    });
  }

  step(target);

  return output;
}

function transform(object: any) {
  const output = `
// This file has been auto-generated. Do not modify directly!

const theme = ${JSON.stringify(object)};

export { theme };
  `;
  return output;
}

function generateTypedThemeGet(themes: { filename: string; themeObject: any }[]) {
  const types = themes
    .map(t => {
      const keys = Object.keys(flatten(t.themeObject));
      return `export type ${t.filename}Theme = ${keys.map(k => `'${k}'`).join(' | ')};`;
    })
    .join('\n');

  const output = `
// This file has been autogenerated. Do not modify directly!
import { themeGet as baseThemeGet } from '@styled-system/theme-get';

${types}

type ThemePath<T> = T | flameTheme;

function themeGet<T>(path: ThemePath<T>, defaultValue?: string) {
  return function drill(props: { theme? : any }) {
    return baseThemeGet(path as string, defaultValue)(props);
  };
}

export { themeGet };
  `;
  return output;
}

type ThemeList = { filename: string; themeObject: any }[];
const themeList: ThemeList = [
  {
    filename: 'flame',
    themeObject: flameTheme,
  },
  {
    filename: 'oldskool',
    themeObject: oldSkoolTheme,
  },
  {
    filename: 'dark',
    themeObject: darkTheme,
  },
];

// @ts-ignore
if (!fs.existsSync(`${__dirname}/../src/Core/themes/`)) {
  // @ts-ignore
  fs.mkdirSync(`${__dirname}/../src/Core/themes/`);
}

themeList.forEach(theme => {
  // @ts-ignore
  fs.writeFileSync(
    // @ts-ignore
    `${__dirname}/../src/Core/themes/${theme.filename}.ts`,
    `${transform(theme.themeObject)}`,
  );
});

const themeGetFile = generateTypedThemeGet([
  {
    filename: 'flame',
    themeObject: flameThemeUI,
  },
]);

// @ts-ignore
fs.writeFileSync(`${__dirname}/../src/Core/theme-get.ts`, `${themeGetFile}`);
