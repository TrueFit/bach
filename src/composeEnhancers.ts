import {Enhancer} from './types';

export default (...enhancers: Enhancer[]): Enhancer[] => enhancers;
