export const stateReducer = (initialState, states) => (
  state = initialState,
  action
) => {
  const stateChange = states[action.type];
  if (stateChange) {
    return stateChange(state, action.payload);
  }

  return state;
};
