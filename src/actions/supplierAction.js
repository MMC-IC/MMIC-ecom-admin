import { deleteCall, getCall, postCall, putCall } from "../api/HttpService";
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
} from "../constants/supplierConstants";

export const getSuppliers = () => async (dispatch) => {
  try {
    dispatch({ type: SUPPLIERS_REQUEST });

    const { data } = await getCall("/api/v1/admin/suppliers");

    dispatch({
      type: SUPPLIERS_SUCCESS,
      payload: data.suppliers,
    });
  } catch (error) {
    dispatch({
      type: SUPPLIERS_FAIL,
      payload:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  }
};

export const createSupplier = (supplierData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_SUPPLIER_REQUEST });

    const { data } = await postCall("/api/v1/admin/supplier/new", supplierData);

    dispatch({
      type: NEW_SUPPLIER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_SUPPLIER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updateSupplier = (id, supplierData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SUPPLIER_REQUEST });

    const { data } = await putCall(
      `/api/v1/admin/supplier/${id}`,
      supplierData
    );

    dispatch({
      type: UPDATE_SUPPLIER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SUPPLIER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteSupplier = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SUPPLIER_REQUEST });
    const { data } = await deleteCall(`/api/v1/admin/supplier/${id}`);

    dispatch({
      type: DELETE_SUPPLIER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_SUPPLIER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Supplier Details
export const getSupplierDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUPPLIER_DETAILS_REQUEST });

    const { data } = await getCall(`/api/v1/admin/supplier/${id}`);

    dispatch({
      type: SUPPLIER_DETAILS_SUCCESS,
      payload: data.supplier,
    });
  } catch (error) {
    dispatch({
      type: SUPPLIER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear All Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
