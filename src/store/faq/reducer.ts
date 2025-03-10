import branchesActions from "./actions";

const initialState = {
  branches: null,
};

export default function branchesReducer(state = initialState, action) {
  switch (action.type) {
    case branchesActions.FETCH_BRANCHES_DATA:
      return {
        ...state,
        branches: action.payload,
      };

    default:
      return state;
  }
}
