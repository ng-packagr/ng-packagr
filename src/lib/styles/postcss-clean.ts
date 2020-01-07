import * as postcss from 'postcss';
import * as cleanCss from 'clean-css';

import * as log from '../utils/log';

export default postcss.plugin('clean', (options = {}) => {
  const cleancss = new cleanCss(options);
  return (css, result) => {
    const { warnings, styles } = cleancss.minify(css.toString());
    warnings.forEach(log.warn);
    result.root = postcss.parse(styles);
  };
});
