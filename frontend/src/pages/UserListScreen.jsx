import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { listUsers, deleteUser } from '../store/userActions'

const UserListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete, error: errorDelete } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userInfo, successDelete])

  const deleteHandler = (id, name) => {
    if (window.confirm(`Delete user "${name}"?`)) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <section className="admin-page">
      <h1 className="admin-title">Users</h1>

      {errorDelete && <div className="profile-error">{errorDelete}</div>}

      {loading ? (
        <div className="profile-loading">Loading users…</div>
      ) : error ? (
        <div className="profile-error">{error}</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="muted">{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>
                      {user.email}
                    </a>
                  </td>
                  <td>
                    {user.isAdmin ? 'Yes' : 'No'}
                  </td>
                  <td className="admin-actions">
                    <button
                      className="admin-action-btn"
                      onClick={() =>
                        alert(`Edit feature for ${user.name} coming soon`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="admin-action-btn danger"
                      disabled={user._id === userInfo._id}
                      onClick={() =>
                        deleteHandler(user._id, user.name)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default UserListScreen
