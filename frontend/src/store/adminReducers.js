// frontend/src/store/adminStatsReducer.js

export const adminStatsReducer = (
  state = {
    loading: true,
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    monthlySales: [],
  },
  action
) => {
  switch (action.type) {
    case 'ADMIN_STATS_REQUEST':
      return { ...state, loading: true }

    case 'ADMIN_STATS_SUCCESS':
      return {
        loading: false,
        error: null,

        totalSales: action.payload.totalSales || 0,
        totalOrders: action.payload.totalOrders || 0,
        totalUsers: action.payload.totalUsers || 0,

        monthlySales: action.payload.monthlySales || [],
      }

    case 'ADMIN_STATS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    default:
      return state
  }
}
