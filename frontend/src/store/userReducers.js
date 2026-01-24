// ADMIN USER LIST CONSTANTS (NEW)
const USER_LIST_REQUEST = 'USER_LIST_REQUEST';
const USER_LIST_SUCCESS = 'USER_LIST_SUCCESS';
const USER_LIST_FAIL = 'USER_LIST_FAIL';
const USER_LIST_RESET = 'USER_LIST_RESET'; // To clear the list upon logout

// ADMIN USER DELETE CONSTANTS (NEW)
const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST';
const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS';
const USER_DELETE_FAIL = 'USER_DELETE_FAIL';
// Constants (Combined for simplicity)
const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';
const USER_LOGOUT = 'USER_LOGOUT';

const USER_PROFILE_REQUEST = 'USER_PROFILE_REQUEST';
const USER_PROFILE_SUCCESS = 'USER_PROFILE_SUCCESS';
const USER_PROFILE_FAIL = 'USER_PROFILE_FAIL';

const USER_PROFILE_UPDATE_REQUEST = 'USER_PROFILE_UPDATE_REQUEST';
const USER_PROFILE_UPDATE_SUCCESS = 'USER_PROFILE_UPDATE_SUCCESS';
const USER_PROFILE_UPDATE_FAIL = 'USER_PROFILE_UPDATE_FAIL';


// 1. User Login Reducer
export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};


// 2. User Profile Details Reducer (for fetching the profile)
export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return { ...state, loading: true };
    case USER_PROFILE_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


// 3. User Profile Update Reducer
export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PROFILE_UPDATE_REQUEST:
      return { loading: true };
    case USER_PROFILE_UPDATE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };
    case USER_PROFILE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// 4. Admin User List Reducer
export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { loading: true };
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case USER_LIST_RESET:
      return { users: [] }; // Reset to empty array when logging out
    default:
      return state;
  }
};


// 5. Admin User Delete Reducer
export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { loading: true };
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};