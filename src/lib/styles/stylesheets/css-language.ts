import { StylesheetLanguage } from './stylesheet-plugin-factory';

export const CssStylesheetLanguage = Object.freeze<StylesheetLanguage>({
  name: 'css',
  componentFilter: /^css;/,
  fileFilter: /\.css$/,
});
