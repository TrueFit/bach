import React from 'react';
import {REACT, PROPS} from '../util/constants';
import newVariable from '../util/newVariable';

export default (lifecycle = {}) => {
  const dependencies = {[REACT]: React};

  const map = {
    componentDidMount: null,
    componentDidUpdate: null,
    componentWillUnmount: null,
  };

  const mapLifecycle = event => {
    map[event] = newVariable();
    dependencies[map[event]] = lifecycle[event];
  };

  mapLifecycle('componentDidMount');
  mapLifecycle('componentDidUpdate');
  mapLifecycle('componentWillUnmount');

  return {
    dependencies,
    initialize: `
      const didMount = ${map.componentDidMount};
      const didUpdate = ${map.componentDidUpdate};
      const willUnmount = ${map.componentWillUnmount};

      const mounted = ${REACT}.useRef(false);
      const previousProps = ${REACT}.useRef(null);

      ${REACT}.useEffect(function () {
        if (mounted.current && didUpdate) {
          didUpdate(${PROPS}, previousProps.current);
          previousProps.current = ${PROPS};
        }
      }, [${PROPS}]);

      ${REACT}.useEffect(function () {
        if (didMount) {
          didMount(${PROPS});

          mounted.current = true;
          previousProps.current = ${PROPS};
        }

        if (willUnmount) {
          return function () {
            willUnmount(previousProps.current);
          };
        }
      }, []);
    `,
    props: [],
  };
};
