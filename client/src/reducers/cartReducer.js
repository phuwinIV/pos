import {
   CART_ADD_ITEM,
   CART_CLEAR_ITEMS,
   CART_REMOVE_ITEM,
} from '../constans/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
   switch (action.type) {
      case CART_ADD_ITEM:
         const item = action.payload;

         const existItem = state.cartItems.find(
            (x) => x.product === item.product
         );

         if (existItem) {
            return {
               ...state,
               cartItems: state.cartItems.map((x) =>
                  x.product === existItem.product ? item : x
               ),
            };
         } else {
            return {
               ...state,
               cartItems: [...state.cartItems, item],
            };
         }

      case CART_REMOVE_ITEM:
         return {
            ...state,
            cartItems: state.cartItems.filter(
               (x) => x.product !== action.payload
            ),
         };

      case 'UPDATE_CART':
         return {
            ...state,
            cartItems: state.cartItems.map((item) =>
               item.product === action.payload.product
                  ? { ...item, quantity: action.payload.quantity }
                  : item
            ),
         };

      case CART_CLEAR_ITEMS:
         return {
            ...state,
            cartItems: [],
         };
      default:
         return state;
   }
};
