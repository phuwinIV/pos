import axios from 'axios';
import {
   USER_DELETE_FAIL,
   USER_DELETE_REQUEST,
   USER_DELETE_SUCCESS,
   USER_DETAILS_RESET,
   USER_DETAILS_SUCCESS,
   USER_LIST_FAIL,
   USER_LIST_REQUEST,
   USER_LIST_RESET,
   USER_LIST_SUCCESS,
   USER_LOGIN_FAIL,
   USER_LOGIN_REQUEST,
   USER_LOGIN_SUCCESS,
   USER_LOGOUT,
   USER_REGISTER_FAIL,
   USER_REGISTER_REQUEST,
   USER_REGISTER_SUCCESS,
   USER_UPDATE_FAIL,
   USER_UPDATE_REQUEST,
   USER_UPDATE_SUCCESS,
} from '../constans/userConstans';

export const login = (values) => async (dispatch) => {
   const { userId, password } = values;
   try {
      dispatch({
         type: USER_LOGIN_REQUEST,
      });

      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      };

      const { data } = await axios.post(
         '/api/users/login',
         {
            userId,
            password,
         },
         config
      );
      dispatch({
         type: USER_LOGIN_SUCCESS,
         payload: data,
      });

      localStorage.setItem('posUser', JSON.stringify(data));
   } catch (error) {
      dispatch({
         type: USER_LOGIN_FAIL,
         payload:
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message,
      });
   }
};

export const logout = () => (dispatch) => {
   localStorage.removeItem('posUser');
   dispatch({ type: USER_LOGOUT });
   dispatch({ type: USER_DETAILS_RESET });
   dispatch({ type: USER_LIST_RESET });
};

export const register = (values) => async (dispatch) => {
   try {
      dispatch({
         type: USER_REGISTER_REQUEST,
      });

      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      };

      const { data } = await axios.post('/api/users', values, config);

      dispatch({
         type: USER_REGISTER_SUCCESS,
         payload: data,
      });

      dispatch({
         type: USER_LOGIN_SUCCESS,
         payload: data,
      });
   } catch (error) {
      dispatch({
         type: USER_REGISTER_FAIL,
         payload:
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message,
      });
   }
};

export const listUsers = () => async (dispatch, getState) => {
   try {
      dispatch({
         type: USER_LIST_REQUEST,
      });

      const {
         userLogin: { posUser },
      } = getState();

      const config = {
         headers: {
            Authorization: `Bearer ${posUser.token}`,
         },
      };

      const { data } = await axios.get(`/api/users`, config);

      dispatch({
         type: USER_LIST_SUCCESS,
         payload: data,
      });
   } catch (error) {
      const message =
         error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      if (message === 'Not authorized, token failed') {
         dispatch(logout());
      }
      dispatch({
         type: USER_LIST_FAIL,
         payload: message,
      });
   }
};

export const deleteUser = (id) => async (dispatch, getState) => {
   try {
      dispatch({
         type: USER_DELETE_REQUEST,
      });

      const {
         userLogin: { posUser },
      } = getState();

      const config = {
         headers: {
            Authorization: `Bearer ${posUser.token}`,
         },
      };

      await axios.delete(`/api/users/${id}`, config);

      dispatch({ type: USER_DELETE_SUCCESS });
   } catch (error) {
      const message =
         error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      if (message === 'Not authorized, token failed') {
         dispatch(logout());
      }
      dispatch({
         type: USER_DELETE_FAIL,
         payload: message,
      });
   }
};

export const updateUser = (user_id, values) => async (dispatch, getState) => {
   try {
      dispatch({
         type: USER_UPDATE_REQUEST,
      });

      const {
         userLogin: { posUser },
      } = getState();

      const config = {
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${posUser.token}`,
         },
      };

      const { data } = await axios.put(`/api/users/${user_id}`, values, config);

      dispatch({ type: USER_UPDATE_SUCCESS });

      dispatch({ type: USER_DETAILS_SUCCESS, payload: data });

      dispatch({ type: USER_DETAILS_RESET });
   } catch (error) {
      const message =
         error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      if (message === 'Not authorized, token failed') {
         dispatch(logout());
      }
      dispatch({
         type: USER_UPDATE_FAIL,
         payload: message,
      });
   }
};
