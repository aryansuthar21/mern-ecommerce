import axios from 'axios'
import {
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
} from './orderReducers'

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ORDER_CREATE_REQUEST' })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/orders', order, config)

    dispatch({
      type: 'ORDER_CREATE_SUCCESS',
      payload: data,
    })

    dispatch({ type: 'CART_CLEAR_ITEMS' })
    localStorage.removeItem('cartItems')

  } catch (error) {
    dispatch({
      type: 'ORDER_CREATE_FAIL',
      payload:
        error.response?.data.message || error.message,
    })
  }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ORDER_DETAILS_REQUEST' })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/orders/${id}`, config)

    dispatch({
      type: 'ORDER_DETAILS_SUCCESS',
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: 'ORDER_DETAILS_FAIL',
      payload:
        error.response?.data.message || error.message,
    })
  }
}

// ADMIN: GET ALL ORDERS
export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ORDER_LIST_REQUEST' })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get('/api/orders', config)

    dispatch({
      type: 'ORDER_LIST_SUCCESS',
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: 'ORDER_LIST_FAIL',
      payload: error.response?.data.message || error.message,
    })
  }
}

// ADMIN: MARK DELIVERED
export const deliverOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ORDER_DELIVER_REQUEST' })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `/api/orders/${orderId}/deliver`,
      {},
      config
    )

    dispatch({
      type: 'ORDER_DELIVER_SUCCESS',
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: 'ORDER_DELIVER_FAIL',
      payload: error.response?.data.message || error.message,
    })
  }
}

// ✅ GET LOGGED-IN USER ORDERS
export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_MY_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get('/api/orders/myorders', config)

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
