import { styleText } from 'node:util';

type ColorFn = (text: string) => string;

interface Colors {
  red: ColorFn;
  yellow: ColorFn;
  green: ColorFn;
  blue: ColorFn;
  white: ColorFn;
  bold: ColorFn;
  inverse: {
    cyan: ColorFn;
  };
}

type Format = Parameters<typeof styleText>[0];

const color = (format: Format): ColorFn => {
  return (text: string): string => styleText(format, text);
};

export const colors: Colors = {
  red: color('red'),
  yellow: color('yellow'),
  green: color('green'),
  blue: color('blue'),
  white: color('white'),
  bold: color('bold'),
  inverse: {
    cyan: color(['inverse', 'cyan']),
  },
};
