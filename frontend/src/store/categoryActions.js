import api from '../utils/api'
import {
  CATEGORY_TREE_REQUEST,
  CATEGORY_TREE_SUCCESS,
  CATEGORY_TREE_FAIL,
} from './categoryConstants'

export const listCategoryTree = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_TREE_REQUEST })

    const { data } = await api.get('/categories/tree')

    dispatch({
      type: CATEGORY_TREE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_TREE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}