import {EnhancerResult, ComponentTransform, RenderTransform} from '../types';
import {PROPS} from '../constants';

export type EnhancerCombination = {
  dependencies: object;
  blocks: string[];
  renderTransforms: RenderTransform[];
  componentTransforms: ComponentTransform[];
};

export default <T>(results: EnhancerResult[]): EnhancerCombination => {
  const initial = {
    dependencies: {},
    blocks: Array<string>(),
    renderTransforms: Array<RenderTransform>(),
    componentTransforms: Array<ComponentTransform>(),
  };

  const generateAssignments = (variables: string[]): string =>
    variables.map((x) => `${PROPS}.${x} = ${x};`).join('\n');

  return results.reduce((acc: EnhancerCombination, item: EnhancerResult): EnhancerCombination => {
    acc.dependencies = Object.assign(acc.dependencies, item.dependencies);
    acc.blocks.push(item.initialize);
    acc.blocks.push(generateAssignments(item.props));

    if (item.transformRender) {
      acc.renderTransforms.push(item.transformRender);
    }

    if (item.transformComponent) {
      acc.componentTransforms.push(item.transformComponent);
    }

    return acc;
  }, initial);
};
