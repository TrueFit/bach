import {Enhancer, EnhancerList} from './types';
import {flatten} from './util';

export default (...enhancers: EnhancerList): Enhancer[] => flatten(enhancers);
