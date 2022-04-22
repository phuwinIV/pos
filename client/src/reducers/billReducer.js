import {
   BILL_CREATE_FAIL,
   BILL_CREATE_REQUEST,
   BILL_CREATE_RESET,
   BILL_CREATE_SUCCESS,
   BILL_LIST_FAIL,
   BILL_LIST_REQUEST,
   BILL_LIST_SUCCESS,
   BILL_UPDATE_FAIL,
   BILL_UPDATE_REQUEST,
   BILL_UPDATE_SUCCESS,
} from '../constans/billConstans';

export const orderCreateReducer = (state = {}, action) => {
   switch (action.type) {
      case BILL_CREATE_REQUEST:
         return {
            loading: true,
         };
      case BILL_CREATE_SUCCESS:
         return {
            loading: false,
            success: true,
            order: action.payload,
         };
      case BILL_CREATE_FAIL:
         return {
            loading: false,
            error: action.payload,
         };
      case BILL_CREATE_RESET:
         return {};
      default:
         return state;
   }
};

export const orderListReducer = (state = { orders: [] }, action) => {
   switch (action.type) {
      case BILL_LIST_REQUEST:
         return {
            loading: true,
         };
      case BILL_LIST_SUCCESS:
         return {
            loading: false,
            orders: action.payload,
         };
      case BILL_LIST_FAIL:
         return {
            loading: false,
            error: action.payload,
         };
      default:
         return state;
   }
};

export const billUpdateRecuder = (state = {}, action) => {
   switch (action.type) {
      case BILL_UPDATE_REQUEST:
         return {
            loading: true,
         };
      case BILL_UPDATE_SUCCESS:
         return { loading: false, success: true };
      case BILL_UPDATE_FAIL:
         return { loading: false, error: action.payload };

      default:
         return state;
   }
};
