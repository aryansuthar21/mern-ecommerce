import axios from 'axios';
import {
  PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL,
  PRODUCT_RELATED_REQUEST,PRODUCT_RELATED_SUCCESS,PRODUCT_RELATED_FAIL,
} from './productReducers';

// @desc Fetch PUBLIC products (Home, Category, Search, Filters)
export const listProducts = (keyword = '', category = '', filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })

    let url = `/api/products/public?keyword=${keyword}&category=${category}`

    if (filters.minPrice) url += `&minPrice=${filters.minPrice}`
    if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`
    if (filters.sort) url += `&sort=${filters.sort}`

    const { data } = await axios.get(url)

    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message,
    })
  }
}


// @desc    Get single product details
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: PRODUCT_DETAILS_FAIL, 
      payload: error.response?.data.message || error.message 
    });
  }
};

// @desc    Admin: Create sample product
export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    
    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    
    const { data } = await axios.post('/api/products', {}, config);
    
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: PRODUCT_CREATE_FAIL, 
      payload: error.response?.data.message || error.message 
    });
  }
};

// @desc    Admin: Delete product
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    
    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    
    await axios.delete(`/api/products/${id}`, config);
    
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({ 
      type: PRODUCT_DELETE_FAIL, 
      payload: error.response?.data.message || error.message 
    });
  }
};

// @desc    Admin: Update product details
export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST });
    
    const { userLogin: { userInfo } } = getState();
    const config = {
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${userInfo.token}` 
      },
    };
    
    const { data } = await axios.put(`/api/products/${product._id}`, product, config);
    
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: PRODUCT_UPDATE_FAIL, 
      payload: error.response?.data.message || error.message 
    });
  }
};
// @desc    Get related products
export const listRelatedProducts = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_RELATED_REQUEST });
    const { data } = await axios.get(`/api/products/${id}/related`);
    dispatch({ type: PRODUCT_RELATED_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_RELATED_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};