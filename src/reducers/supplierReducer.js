import {
  NEW_SUPPLIER_RESET,
  DELETE_SUPPLIER_RESET,
  UPDATE_SUPPLIER_RESET,
  REMOVE_SUPPLIER_DETAILS,
  CLEAR_ERRORS,
  SUPPLIERS_REQUEST,
  SUPPLIERS_SUCCESS,
  SUPPLIERS_FAIL,
  NEW_SUPPLIER_REQUEST,
  NEW_SUPPLIER_SUCCESS,
  NEW_SUPPLIER_FAIL,
  UPDATE_SUPPLIER_REQUEST,
  UPDATE_SUPPLIER_SUCCESS,
  UPDATE_SUPPLIER_FAIL,
  DELETE_SUPPLIER_REQUEST,
  DELETE_SUPPLIER_SUCCESS,
  DELETE_SUPPLIER_FAIL,
  SUPPLIER_DETAILS_REQUEST,
  SUPPLIER_DETAILS_SUCCESS,
  SUPPLIER_DETAILS_FAIL,
  SUPPLIER_SALES_REQUEST,
  SUPPLIER_SALES_SUCCESS,
  SUPPLIER_SALES_FAIL,
} from "../constants/supplierConstants";

export const suppliersReducer = (
  state = { suppliers: [] },
  { type, payload }
) => {
  switch (type) {
    case SUPPLIERS_REQUEST:
      return {
        ...state,
        loading: true,
        suppliers: [],
      };

    case SUPPLIERS_SUCCESS:
      return {
        loading: false,
        suppliers: payload,
      };

    case SUPPLIERS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
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

export const supplierDetailsReducer = (
  state = { supplier: {} },
  { type, payload }
) => {
  switch (type) {
    case SUPPLIER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SUPPLIER_DETAILS_SUCCESS:
      return {
        loading: false,
        supplier: payload,
      };
    case SUPPLIER_DETAILS_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case REMOVE_SUPPLIER_DETAILS:
      return {
        ...state,
        supplier: {},
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

// New Supplier Reducer
export const newSupplierReducer = (
  state = { supplier: {} },
  { type, payload }
) => {
  switch (type) {
    case NEW_SUPPLIER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_SUPPLIER_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        supplier: payload.supplier,
      };
    case NEW_SUPPLIER_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case NEW_SUPPLIER_RESET:
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

// New Supplier Reducer
export const supplierReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_SUPPLIER_REQUEST:
    case DELETE_SUPPLIER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_SUPPLIER_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: payload,
      };
    case DELETE_SUPPLIER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: payload,
      };
    case UPDATE_SUPPLIER_FAIL:
    case DELETE_SUPPLIER_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case UPDATE_SUPPLIER_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case DELETE_SUPPLIER_RESET:
      return {
        ...state,
        isDeleted: false,
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

export const supplierSalesReducer = (
  state = {
    loading: false,
    sales: [],
    error: null,
  },
  { type, payload }
) => {
  switch (type) {
    case SUPPLIER_SALES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SUPPLIER_SALES_SUCCESS:
      return {
        loading: false,
        sales: payload,
      };
    case SUPPLIER_SALES_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
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
