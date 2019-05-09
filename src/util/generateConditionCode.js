import {PROPS} from './constants';

export default conditions =>
  conditions ? conditions.map(x => `${PROPS}.${x}`).join(',') : PROPS;
