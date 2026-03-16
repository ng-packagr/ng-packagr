import { StylesheetLanguage } from './stylesheet-plugin-factory';

export const CssStylesheetLanguage: Readonly<StylesheetLanguage> = Object.freeze<StylesheetLanguage>({
  name: 'css',
  componentFilter: /^css;/,
  fileFilter: /\.css$/,
});
