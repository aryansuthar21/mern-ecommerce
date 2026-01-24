// Constants
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_SAVE_SHIPPING_ADDRESS = 'CART_SAVE_SHIPPING_ADDRESS';
export const CART_SAVE_PAYMENT_METHOD = 'CART_SAVE_PAYMENT_METHOD';
export const CART_CLEAR_ITEMS = 'CART_CLEAR_ITEMS';

// 1. Cart Reducer
export const cartReducer = (
  state = {
    // Load cart items from local storage
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    // Load shipping address from local storage
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    // Load payment method
    paymentMethod: localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : 'COD',
  },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;

      // ✅ FIX: Check ID + Size + Color to distinguish variants
      const existItem = state.cartItems.find(
        (x) => 
          x.product === item.product && 
          x.size === item.size && 
          x.color === item.color
      );

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product && x.size === existItem.size && x.color === existItem.color
              ? item
              : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case CART_REMOVE_ITEM:
      // ✅ FIX: Remove specific variant (ID + Size + Color)
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x) => 
            !(x.product === action.payload.id && 
              x.size === action.payload.size && 
              x.color === action.payload.color)
        ),
      };

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};