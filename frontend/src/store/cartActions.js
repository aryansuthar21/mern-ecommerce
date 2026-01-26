import api from "../utils/api";

// Import constants (or define them here if you prefer a single file)
import { 
  CART_ADD_ITEM, 
  CART_REMOVE_ITEM, 
  CART_SAVE_SHIPPING_ADDRESS, 
  CART_SAVE_PAYMENT_METHOD 
} from '../store/cartReducers'; 

// 1. Add Item to Cart Action Creator
export const addToCart = (id, qty, size, color) => async (dispatch, getState) => {
  // Fetch product details from the API
  const { data } = await api.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
      size,  // ✅ Saved Size
      color, // ✅ Saved Color (Fixed spelling from 'colour')
    },
  });

  // Save to localStorage
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// 2. Remove Item from Cart Action Creator
export const removeFromCart = (id, size, color) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: { id, size, color } // ✅ Remove specific variant
  });

  // Save to localStorage
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// 3. Save Shipping Address
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

// 4. Save Payment Method
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};