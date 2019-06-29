import {PROPS} from '../util/constants';
import isFunction from '../util/isFunction';

const lazyStaticProps = (props, generateNewVariable) => {
  const helperAlias = generateNewVariable();
  const helper = {};

  return {
    dependencies: {
      [helperAlias]: helper,
    },
    initialize: `
      ${helperAlias}.getProps = function() {
        return ${PROPS};
      };
    `,
    props: [],
    staticProps: props(helper),
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
