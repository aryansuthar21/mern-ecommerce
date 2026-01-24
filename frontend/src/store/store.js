import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { cartReducer } from './cartReducers';
import { productListReducer, productDetailsReducer,productDeleteReducer,productCreateReducer,productUpdateReducer, productRelatedReducer} from './productReducers'; 
import { userLoginReducer, userDetailsReducer, userUpdateProfileReducer,userListReducer,userDeleteReducer } from './userReducers'; 
import { orderCreateReducer } from './orderReducers'
import { orderDetailsReducer } from './orderReducers'
import {orderListReducer,  orderDeliverReducer,} from './orderReducers'
import { adminStatsReducer } from './adminReducers'
import { orderListMyReducer } from './orderReducers'
import { wishlistReducer } from './wishlistReducers'


const initialState = {
  userLogin: { 
    userInfo: localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null 
  },


  cart: cartReducer(undefined, { type: '__INIT__' }), // <-- Initialize cart state
};



const reducer = combineReducers({
  // User Reducers
  userLogin: userLoginReducer, 
  userDetails: userDetailsReducer, 
  userUpdateProfile: userUpdateProfileReducer, 
  userList: userListReducer,         
  userDelete: userDeleteReducer,     
  // Product Reducers <-- NEW ADDITIONS
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,   
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productRelated: productRelatedReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,
  adminStats: adminStatsReducer,
  orderListMy: orderListMyReducer,
  wishlist: wishlistReducer,
});

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;

