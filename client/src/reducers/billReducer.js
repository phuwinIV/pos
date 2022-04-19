import {
   BILL_CREATE_FAIL,
   BILL_CREATE_REQUEST,
   BILL_CREATE_RESET,
   BILL_CREATE_SUCCESS,
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
