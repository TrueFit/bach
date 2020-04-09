import {PROPS} from '../constants';
import {DependencyList} from '../types';

export default <T>(conditions: DependencyList<T>): string =>
  conditions ? conditions.map((x) => `${PROPS}.${x}`).join(',') : PROPS;
