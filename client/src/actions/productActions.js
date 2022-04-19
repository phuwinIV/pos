import axios from 'axios';
import {
   PRODUCT_CREATE_FAIL,
   PRODUCT_CREATE_REQUEST,
   PRODUCT_CREATE_SUCCESS,
   PRODUCT_DELETE_FAIL,
   PRODUCT_DELETE_REQUEST,
   PRODUCT_DELETE_SUCCESS,
   PRODUCT_LIST_FAIL,
   PRODUCT_LIST_REQUEST,
   PRODUCT_LIST_SUCCESS,
} from '../constans/productConstans';

export const listProducts = () => async (dispatch) => {
   try {
      dispatch({ type: PRODUCT_LIST_REQUEST });

      const { data } = await axios.get('/api/products');

      dispatch({
         type: PRODUCT_LIST_SUCCESS,
         payload: data,
      });
   } catch (error) {
      dispatch({
         type: PRODUCT_LIST_FAIL,
         payload:
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message,
      });
   }
};

export const createProduct = (values) => async (dispatch, getState) => {
   try {
      dispatch({
         type: PRODUCT_CREATE_REQUEST,
      });

      const {
         userLogin: { posUser },
      } = getState();

      const config = {
         headers: {
            Authorization: `Bearer ${posUser.token}`,
         },
      };

      const { data } = await axios.post(`/api/products/`, values, config);
      dispatch({
         type: PRODUCT_CREATE_SUCCESS,
         payload: data,
      });
   } catch (error) {
      dispatch({
         type: PRODUCT_CREATE_FAIL,
         payload:
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message,
      });
   }
};

export const deleteProduct = (itemId) => async (dispatch, getState) => {
   try {
      dispatch({
         type: PRODUCT_DELETE_REQUEST,
      });

      const {
         userLogin: { posUser },
      } = getState();

      const config = {
         headers: {
            Authorization: `Bearer ${posUser.token}`,
         },
      };

      await axios.delete(`/api/products/${itemId}`, config);
      dispatch({
         type: PRODUCT_DELETE_SUCCESS,
      });
   } catch (error) {
      dispatch({
         type: PRODUCT_DELETE_FAIL,
         payload:
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message,
      });
   }
};
