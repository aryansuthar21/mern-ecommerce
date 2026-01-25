import api from "../utils/api";

// ================= CONSTANTS =================
export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";
export const USER_LOGOUT = "USER_LOGOUT";

export const USER_REGISTER_REQUEST = "USER_REGISTER_REQUEST";
export const USER_REGISTER_SUCCESS = "USER_REGISTER_SUCCESS";
export const USER_REGISTER_FAIL = "USER_REGISTER_FAIL";

export const USER_PROFILE_REQUEST = "USER_PROFILE_REQUEST";
export const USER_PROFILE_SUCCESS = "USER_PROFILE_SUCCESS";
export const USER_PROFILE_FAIL = "USER_PROFILE_FAIL";
export const USER_PROFILE_RESET = "USER_PROFILE_RESET";

export const USER_PROFILE_UPDATE_REQUEST = "USER_PROFILE_UPDATE_REQUEST";
export const USER_PROFILE_UPDATE_SUCCESS = "USER_PROFILE_UPDATE_SUCCESS";
export const USER_PROFILE_UPDATE_FAIL = "USER_PROFILE_UPDATE_FAIL";

export const USER_LIST_REQUEST = "USER_LIST_REQUEST";
export const USER_LIST_SUCCESS = "USER_LIST_SUCCESS";
export const USER_LIST_FAIL = "USER_LIST_FAIL";
export const USER_LIST_RESET = "USER_LIST_RESET";

export const USER_DELETE_REQUEST = "USER_DELETE_REQUEST";
export const USER_DELETE_SUCCESS = "USER_DELETE_SUCCESS";
export const USER_DELETE_FAIL = "USER_DELETE_FAIL";

// ==================================================
// 🔐 EMAIL + PASSWORD LOGIN
// ==================================================
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await api.post(
      "/api/users/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } },
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ==================================================
// 🔵 GOOGLE LOGIN
// ==================================================
export const googleLogin = (token) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await api.post(
      "/api/auth/google",
      { token },
      { headers: { "Content-Type": "application/json" } },
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response?.data?.message || error.message || "Google login failed",
    });
  }
};

// ==================================================
// 📝 REGISTER
// ==================================================
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await api.post(
      "/api/users",
      { name, email, password },
      { headers: { "Content-Type": "application/json" } },
    );

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    // Automatically log in user after registration
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ==================================================
// 👤 GET USER PROFILE (With Admin Sync)
// ==================================================
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await api.get(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: USER_PROFILE_SUCCESS, payload: data });

    // 🔥 ZARA-LEVEL FIX: Sync admin status to userInfo if this is the logged-in user
    if (id === "profile") {
      const updatedUserInfo = { ...userInfo, ...data };
      dispatch({ type: USER_LOGIN_SUCCESS, payload: updatedUserInfo });
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    }
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ==================================================
// ✏️ UPDATE PROFILE
// ==================================================
export const updateProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PROFILE_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await api.put("/api/users/profile", user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: USER_PROFILE_UPDATE_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_PROFILE_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ==================================================
// 🚪 LOGOUT (Resets all state)
// ==================================================
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_PROFILE_RESET });
  dispatch({ type: USER_LIST_RESET });
  // Optional: Reset orders or cart as well
  dispatch({ type: "ORDER_LIST_MY_RESET" });
};

// ==================================================
// 🧑‍💼 ADMIN: LIST USERS
// ==================================================
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await api.get("/api/users", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ==================================================
// 🗑 ADMIN: DELETE USER
// ==================================================
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    await api.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
