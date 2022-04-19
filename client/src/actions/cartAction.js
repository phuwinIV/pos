import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constans/cartConstants';

export const addToCart = (id, quantity) => async (dispatch, getState) => {
   try {
      const { data } = await axios.get(`/api/products/${id}`);
      const item = {
         product: data._id,
         name: data.name,
         image: data.image,
         price: data.price,
         category: data.category,
         quantity,
      };
      // DISPATCH AND SAVE TO LOCAL STORAGE
      dispatch({ type: CART_ADD_ITEM, payload: item });
      localStorage.setItem(
         'cartItems',
         JSON.stringify(getState().cart.cartItems)
      );
   } catch (error) {
      console.log(error);
   }
};

export const removeFromCart = (id) => (dispatch, getState) => {
   dispatch({
      type: CART_REMOVE_ITEM,
      payload: id,
   });
   localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
