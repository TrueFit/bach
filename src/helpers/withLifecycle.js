import React from 'react';
import {REACT, PROPS} from '../util/constants';

export default (map = {}) => {
  return {
    dependencies: {
      [REACT]: React,
    },
    initialize: `
      const didMount = ${map.componentDidMount.toString()};
      const didUpdate = ${map.componentDidUpdate.toString()};
      const willUnmount = ${map.componentWillUnmount.toString()};

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
