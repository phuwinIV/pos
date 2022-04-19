import axios from 'axios';
import {
   BILL_CREATE_FAIL,
   BILL_CREATE_REQUEST,
   BILL_CREATE_SUCCESS,
   BILL_LIST_FAIL,
   BILL_LIST_REQUEST,
   BILL_LIST_SUCCESS,
} from '../constans/billConstans';
import { CART_CLEAR_ITEMS } from '../constans/cartConstants';
import { logout } from './userActions';

export const createOrder = (order) => async (dispatch, getState) => {

   try {
      dispatch({
         type: BILL_CREATE_REQUEST,
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

      const { data } = await axios.post(`/api/bills`, order , config);

      dispatch({
         type: BILL_CREATE_SUCCESS,
         payload: data,
      });
      dispatch({
         type: CART_CLEAR_ITEMS,
         payload: data,
      });
      localStorage.removeItem('cartItems');
   } catch (error) {
      const message =
         error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      if (message === 'Not authorized, token failed') {
         dispatch(logout());
      }
      dispatch({
         type: BILL_CREATE_FAIL,
         payload: message,
      });
   }
};

export const listOrders = () => async (dispatch, getState) => {
   try {
      dispatch({
         type: BILL_LIST_REQUEST,
      });

      const {
         userLogin: { posUser },
      } = getState();

      const config = {
         headers: {
            Authorization: `Bearer ${posUser.token}`,
         },
      };

      const { data } = await axios.get(`/api/bills`, config);

      dispatch({
         type: BILL_LIST_SUCCESS,
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
         type: BILL_LIST_FAIL,
         payload: message,
      });
   }
};
