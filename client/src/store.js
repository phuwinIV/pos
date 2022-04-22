import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
   userLoginReducer,
   userRegisterReducer,
   userListReducer,
   userDeleteReducer,
   userUpdateReducer,
} from './reducers/userReducers';
import {
   productCreateReducer,
   productDeleteReducer,
   productListReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducer';
import {
   billUpdateRecuder,
   orderCreateReducer,
   orderListReducer,
} from './reducers/billReducer';

const reducer = combineReducers({
   userLogin: userLoginReducer,
   userRegister: userRegisterReducer,
   userList: userListReducer,
   userDelete: userDeleteReducer,
   userUpdate: userUpdateReducer,
   cart: cartReducer,
   productList: productListReducer,
   productCreate: productCreateReducer,
   productDelete: productDeleteReducer,
   orderCreate: orderCreateReducer,
   orderList: orderListReducer,
   billUpdate: billUpdateRecuder,
});

const cartItemsFromStorage = localStorage.getItem('cartItems')
   ? JSON.parse(localStorage.getItem('cartItems'))
   : [];

const userInfoFromStorage = localStorage.getItem('posUser')
   ? JSON.parse(localStorage.getItem('posUser'))
   : null;

const initialState = {
   cart: {
      cartItems: cartItemsFromStorage,
   },
   userLogin: { posUser: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
   reducer,
   initialState,
   composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
