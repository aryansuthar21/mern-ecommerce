import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

import { getAdminStats } from '../store/adminStatsActions'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ================= AUTH =================
  const { userInfo } = useSelector((state) => state.userLogin)

  // ================= STATS =================
  const adminStatsState = useSelector((state) => state.adminStats || {})
  const {
    loading = false,
    error = null,
    totalSales = 0,
    totalOrders = 0,
    totalUsers = 0,
    monthlySales = [],
  } = adminStatsState

  // ================= REVIEW COUNTER =================
  const [pendingReviewCount, setPendingReviewCount] = useState(0)

  const fetchPendingReviewCount = async () => {
  try {
    const { data } = await api.get('/reviews', {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })

    const pending = data.filter((r) => !r.isApproved)
    setPendingReviewCount(pending.length)
  } catch (error) {
    console.error(error)
  }
}
  // ================= EFFECT =================
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    } else {
      dispatch(getAdminStats())
      fetchPendingReviewCount()
    }
  }, [dispatch, navigate, userInfo])

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {loading && <p className="page-message">Loading dashboard...</p>}
      {error && <p className="page-error">{error}</p>}

      {!loading && !error && (
        <>
          {/* ================= STATS ================= */}
          <div className="admin-stats-grid">

            <div className="stat-card">
              <span>Total Sales</span>
              <h3>₹{totalSales.toFixed(2)}</h3>
            </div>

            <div className="stat-card">
              <span>Total Orders</span>
              <h3>{totalOrders}</h3>
            </div>

            <div className="stat-card">
              <span>Total Users</span>
              <h3>{totalUsers}</h3>
            </div>

            {/* 🔥 NEW REVIEW COUNTER CARD */}
            <div
              className="stat-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/admin/reviews')}
            >
              <span>Pending Reviews</span>
              <h3>{pendingReviewCount}</h3>

              {pendingReviewCount > 0 && (
                <small style={{ color: 'orange' }}>
                  Needs Approval
                </small>
              )}
            </div>

          </div>

          {/* ================= ANALYTICS ================= */}
          <div className="admin-analytics">

            {/* SALES TREND */}
            <div className="analytics-card">
              <h2>Sales Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="#000" stopOpacity={0.3} />
                      <stop offset="90%" stopColor="#000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="totalSales"
                    stroke="#000"
                    fill="url(#salesFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* MONTHLY COMPARISON */}
            <div className="analytics-card">
              <h2>Monthly Comparison</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalSales" fill="#000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* SALES DISTRIBUTION */}
            <div className="analytics-card">
              <h2>Sales Distribution</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={monthlySales}
                    dataKey="totalSales"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {monthlySales.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index % 2 === 0 ? '#000' : '#666'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard