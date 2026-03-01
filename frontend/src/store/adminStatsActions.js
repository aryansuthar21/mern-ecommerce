import api from "../utils/api";

export const getAdminStats = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "ADMIN_STATS_REQUEST" });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await api.get("/admin/stats", config);

    dispatch({
      type: "ADMIN_STATS_SUCCESS",
      payload: {
        totalSales: data.totalSales,
        totalOrders: data.totalOrders,
        totalUsers: data.totalUsers,
        monthlySales: data.monthlySales,
      },
    });
  } catch (error) {
    dispatch({
      type: "ADMIN_STATS_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};
