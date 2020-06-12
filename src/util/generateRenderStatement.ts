import {REACT, COMPONENT, PROPS} from '../constants';
import {EnhancerCombination} from './combineEnhancerResults';
import {RenderTransform} from '../types';

const DEFAULT = `${REACT}.createElement(${COMPONENT}, ${PROPS})`;

export default (results: EnhancerCombination): string => {
  const statement = results.renderTransforms.reduce(
    (acc: string, transformRender: RenderTransform) => transformRender(acc),
    DEFAULT,
  );

  return `return ${statement};`;
};
