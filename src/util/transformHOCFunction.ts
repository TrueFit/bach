import {FunctionComponent} from 'react';
import {ComponentTransform} from '../types';

export default <T>(
  hoc: FunctionComponent<T>,
  transforms: ComponentTransform[],
): FunctionComponent<T> =>
  transforms.reduce(
    (acc: FunctionComponent<T>, transform: ComponentTransform): FunctionComponent<T> =>
      transform(acc),
    hoc,
  );
