import axios from 'axios'

export const getAdminDashboard = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ADMIN_DASHBOARD_REQUEST' })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(
      '/api/orders/admin/summary',
      config
    )

    dispatch({
      type: 'ADMIN_DASHBOARD_SUCCESS',
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: 'ADMIN_DASHBOARD_FAIL',
      payload:
        error.response?.data.message || error.message,
    })
  }
}
