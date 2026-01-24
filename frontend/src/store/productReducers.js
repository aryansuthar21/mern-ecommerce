 // frontend/src/store/productReducers.js

// --- CONSTANTS ---
export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS';
export const PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL';

export const PRODUCT_DETAILS_REQUEST = 'PRODUCT_DETAILS_REQUEST';
export const PRODUCT_DETAILS_SUCCESS = 'PRODUCT_DETAILS_SUCCESS';
export const PRODUCT_DETAILS_FAIL = 'PRODUCT_DETAILS_FAIL';

export const PRODUCT_DELETE_REQUEST = 'PRODUCT_DELETE_REQUEST';
export const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS';
export const PRODUCT_DELETE_FAIL = 'PRODUCT_DELETE_FAIL';

export const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST';
export const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS';
export const PRODUCT_CREATE_FAIL = 'PRODUCT_CREATE_FAIL';
export const PRODUCT_CREATE_RESET = 'PRODUCT_CREATE_RESET';

export const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST';
export const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS';
export const PRODUCT_UPDATE_FAIL = 'PRODUCT_UPDATE_FAIL';
export const PRODUCT_UPDATE_RESET = 'PRODUCT_UPDATE_RESET';

export const PRODUCT_RELATED_REQUEST = 'PRODUCT_RELATED_REQUEST';
export const PRODUCT_RELATED_SUCCESS = 'PRODUCT_RELATED_SUCCESS';
export const PRODUCT_RELATED_FAIL = 'PRODUCT_RELATED_FAIL';
// --- REDUCERS ---

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST: return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS: return { loading: false, products: action.payload };
    case PRODUCT_LIST_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};

export const productDetailsReducer = (state = { product: { reviews: [] } }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST: return { ...state, loading: true };
    case PRODUCT_DETAILS_SUCCESS: return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST: return { loading: true };
    case PRODUCT_DELETE_SUCCESS: return { loading: false, success: true };
    case PRODUCT_DELETE_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST: return { loading: true };
    case PRODUCT_CREATE_SUCCESS: return { loading: false, success: true, product: action.payload };
    case PRODUCT_CREATE_FAIL: return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET: return {};
    default: return state;
  }
};

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST: return { loading: true };
    case PRODUCT_UPDATE_SUCCESS: return { loading: false, success: true, product: action.payload };
    case PRODUCT_UPDATE_FAIL: return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET: return { product: {} };
    default: return state;
  }
};
export const productRelatedReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_RELATED_REQUEST: return { loading: true, products: [] };
    case PRODUCT_RELATED_SUCCESS: return { loading: false, products: action.payload };
    case PRODUCT_RELATED_FAIL: return { loading: false, error: action.payload };
    default: return state;
  }
};