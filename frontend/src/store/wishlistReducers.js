import api from "../utils/api";

// =========================================
// 1. CONSTANTS
// =========================================
export const WISHLIST_REQUEST = "WISHLIST_REQUEST";
export const WISHLIST_SUCCESS = "WISHLIST_SUCCESS";
export const WISHLIST_FAIL = "WISHLIST_FAIL";

export const WISHLIST_ADD_REQUEST = "WISHLIST_ADD_REQUEST";
export const WISHLIST_ADD_SUCCESS = "WISHLIST_ADD_SUCCESS";
export const WISHLIST_ADD_FAIL = "WISHLIST_ADD_FAIL";

export const WISHLIST_REMOVE_REQUEST = "WISHLIST_REMOVE_REQUEST";
export const WISHLIST_REMOVE_SUCCESS = "WISHLIST_REMOVE_SUCCESS";
export const WISHLIST_REMOVE_FAIL = "WISHLIST_REMOVE_FAIL";

// =========================================
// 2. REDUCER
// =========================================
export const wishlistReducer = (state = { wishlist: [] }, action) => {
  switch (action.type) {
    case WISHLIST_REQUEST:
    case WISHLIST_ADD_REQUEST:
    case WISHLIST_REMOVE_REQUEST:
      return { ...state, loading: true };

    case WISHLIST_SUCCESS:
      return { loading: false, wishlist: action.payload.products };

    case WISHLIST_ADD_SUCCESS:
      // Optimistically update or replace with server response
      return { loading: false, wishlist: action.payload.products };

    case WISHLIST_REMOVE_SUCCESS:
      return { loading: false, wishlist: action.payload.products };

    case WISHLIST_FAIL:
    case WISHLIST_ADD_FAIL:
    case WISHLIST_REMOVE_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

// =========================================
// 3. ACTIONS
// =========================================

// @desc    Get user wishlist
export const getUserWishlist = () => async (dispatch, getState) => {
  try {
    dispatch({ type: WISHLIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    // Only fetch if logged in
    if (!userInfo) return;

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await api.get("/wishlist", config);

    dispatch({ type: WISHLIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WISHLIST_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// @desc    Add item to wishlist
export const addToWishlist = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: WISHLIST_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo) {
      // Logic for guest wishlist could go here (e.g., localStorage)
      // For now, we will require login
      return;
    }

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await api.post("/wishlist", { productId }, config);

    dispatch({ type: WISHLIST_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WISHLIST_ADD_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// @desc    Remove item from wishlist
export const removeFromWishlist = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: WISHLIST_REMOVE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await api.delete(`/wishlist/${productId}`, config);

    dispatch({ type: WISHLIST_REMOVE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WISHLIST_REMOVE_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};
