import {
  CATEGORY_TREE_REQUEST,
  CATEGORY_TREE_SUCCESS,
  CATEGORY_TREE_FAIL,
} from './categoryConstants'

export const categoryTreeReducer = (
  state = { loading: false, tree: [] },
  action
) => {
  switch (action.type) {
    case CATEGORY_TREE_REQUEST:
      return { ...state, loading: true }

    case CATEGORY_TREE_SUCCESS:
      return {
        loading: false,
        tree: action.payload,
      }

    case CATEGORY_TREE_FAIL:
      return {
        loading: false,
        error: action.payload,
        tree: [],
      }

    default:
      return state
  }
}