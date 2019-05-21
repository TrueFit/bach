import {useRef} from 'react';

export default (refName, initialValue) => ({generateNewVariable}) => {
  const initialValueAlias = generateNewVariable();

  return {
    dependencies: {
      useRef,
      [initialValueAlias]: initialValue,
    },
    initialize: `const ${refName} = useRef(${initialValueAlias});`,
    props: [refName],
  };
};
