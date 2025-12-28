import { getCall, postCall, putCall } from "../api/HttpService";
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

// 🔹 Get all supplier returns (Admin)
export const getSupplierReturns = () => async (dispatch) => {
  try {
    dispatch({ type: SUPPLIER_RETURNS_REQUEST });

    const { data } = await getCall("/api/v1/admin/supplier-returns");

    dispatch({
      type: SUPPLIER_RETURNS_SUCCESS,
      payload: data.returns,
    });
  } catch (error) {
    dispatch({
      type: SUPPLIER_RETURNS_FAIL,
      payload:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  }
};

// 🔹 Create supplier return (after customer return approved)
export const createSupplierReturn =
  (orderId, itemId, supplierId) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_SUPPLIER_RETURN_REQUEST });

      const { data } = await postCall(`/api/v1/admin/supplier-return/new`, {
        orderId,
        itemId,
        supplierId,
      });

      dispatch({
        type: UPDATE_SUPPLIER_RETURN_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_SUPPLIER_RETURN_FAIL,
        payload:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    }
  };

// 🔹 Update supplier return status
export const updateSupplierReturnStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SUPPLIER_RETURN_REQUEST });

    const { data } = await putCall(`/api/v1/admin/supplier-return/${id}`, {
      status,
    });

    dispatch({
      type: UPDATE_SUPPLIER_RETURN_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SUPPLIER_RETURN_FAIL,
      payload:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  }
};

// 🔹 Reset supplier return state
export const resetSupplierReturn = () => (dispatch) => {
  dispatch({ type: SUPPLIER_RETURN_RESET });
};

// 🔹 Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
