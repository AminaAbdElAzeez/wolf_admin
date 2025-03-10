const branchesActions = {
  FETCH_BRANCHES_DATA: "FETCH_BRANCHES_DATA",

  fetchBranchesData: (branches: any[]) => ({
    type: branchesActions.FETCH_BRANCHES_DATA,
    payload: branches,
  }),
};

export default branchesActions;
