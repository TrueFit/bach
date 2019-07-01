import {PROPS} from '../util/constants';
import isFunction from '../util/isFunction';

const lazyStaticProps = (props, generateNewVariable) => {
  const propsAlias = generateNewVariable();
  const propsRedirect = {};

  return {
    dependencies: {
      [propsAlias]: propsRedirect,
    },
    initialize: `
      Object.keys(${PROPS}).forEach(function(key) {
        ${propsAlias}[key] = ${PROPS}[key];
      });
    `,
    props: [],
    staticProps: props(propsRedirect),
  };
};

export default props => ({generateNewVariable}) => {
  if (isFunction(props)) {
    return lazyStaticProps(props, generateNewVariable);
  }

  return {
    dependencies: {},
    initialize: '',
    props: [],
    staticProps: props,
  };
};
