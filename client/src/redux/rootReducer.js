// const initialState = {
//    loading: false,
//    cartItems: [],
// };

// export const rootReducer = (state = initialState, action) => {
//    switch (action.type) {
//       case 'ADD_TO_CART':
//          const item = action.payload;

//          const existItem = state.cartItems.find((x) => x.item === item.product);
//          if (existItem) {
//             return {
//                ...state,
//                cartItems: state.cartItems.map((x) =>
//                   x.product === existItem.product ? item : x
//                ),
//             };
//          } else {
//             return {
//                ...state,
//                cartItems: [...state.cartItems, item],
//             };
//          }

//       return {
//          ...state,
//          cartItems: [...state.cartItems, action.payload],
//       };

//       case 'DELETE_ITEM_CART':
//          return {
//             ...state,
//             cartItems: state.cartItems.filter(
//                (item) => item._id !== action.payload._id
//             ),
//          };

//       case 'UPDATE_CART':
//          return {
//             ...state,
//             cartItems: state.cartItems.map((item) =>
//                item._id === action.payload._id
//                   ? { ...item, quantity: action.payload.quantity }
//                   : item
//             ),
//          };

//       case 'SHOW_LOADING':
//          return {
//             ...state,
//             loading: true,
//          };
//       case 'HIDE_LOADING':
//          return {
//             ...state,
//             loading: false,
//          };

//       default:
//          return state;
//    }
// };
