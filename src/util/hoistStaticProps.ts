import {ReactNode} from 'react';

export default (component: ReactNode, hoc: Function): void => {
  Object.keys(component).forEach((key: string): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    hoc[key] = component[key];
  });
};
