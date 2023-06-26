import {PROPS} from '../constants';
import {DependencyList} from '../types';

export default <T>(conditions?: DependencyList<T>): string => {
  if (!conditions) {
    return PROPS;
  }

  if (conditions.length === 0) {
    return '';
  }

  return (conditions as Array<keyof T>).map((x) => `${PROPS}.${String(x)}`).join(',');
};
