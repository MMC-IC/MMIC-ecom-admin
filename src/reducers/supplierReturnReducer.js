import {
  SUPPLIER_RETURNS_REQUEST,
  SUPPLIER_RETURNS_SUCCESS,
  SUPPLIER_RETURNS_FAIL,
  UPDATE_SUPPLIER_RETURN_REQUEST,
  UPDATE_SUPPLIER_RETURN_SUCCESS,
  UPDATE_SUPPLIER_RETURN_FAIL,
  SUPPLIER_RETURN_RESET,
  CLEAR_ERRORS,
} from "../constants/supplierReturnConstants";

export const supplierReturnReducer = (
  state = { supplierReturns: [] },
  action
) => {
  switch (action.type) {
    case SUPPLIER_RETURNS_REQUEST:
    case UPDATE_SUPPLIER_RETURN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SUPPLIER_RETURNS_SUCCESS:
      return {
        loading: false,
        supplierReturns: action.payload,
      };

    case UPDATE_SUPPLIER_RETURN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };

    case SUPPLIER_RETURNS_FAIL:
    case UPDATE_SUPPLIER_RETURN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SUPPLIER_RETURN_RESET:
      return {
        ...state,
        success: false,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
