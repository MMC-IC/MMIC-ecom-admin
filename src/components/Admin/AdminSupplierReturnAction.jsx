import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateSupplierReturnStatus,
  getSupplierReturns,
} from "../../actions/supplierReturnAction";
import BackdropLoader from "../Layouts/BackdropLoader";
import { useSnackbar } from "notistack";

const AdminSupplierReturnAction = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, supplierReturns, success } = useSelector(
    (state) => state.supplierReturns
  );

  const item = supplierReturns?.find((i) => i._id === id);

  useEffect(() => {
    if (!item) dispatch(getSupplierReturns());
  }, [dispatch, item]);

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Supplier return updated", { variant: "success" });
      dispatch({ type: "SUPPLIER_RETURN_RESET" });
      navigate("/admin/supplier-returns");
    }
  }, [success, dispatch, enqueueSnackbar, navigate]);

  const updateStatus = (status) => {
    dispatch(updateSupplierReturnStatus(id, status));
  };

  if (!item) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {loading && <BackdropLoader />}

      <h2 className="text-lg font-semibold mb-6 uppercase">
        Supplier Return Details
      </h2>

      <div className="border rounded-lg p-4 mb-6 bg-gray-50">
        <p className="text-sm">
          Supplier: <b>{item.supplier.name}</b>
        </p>
        <p className="text-sm">
          Invoice: <b>{item.invoiceNumber}</b>
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 rounded border"
        />
        <div>
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm">Qty: {item.quantity}</p>
          <p className="text-sm">Status: {item.status}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => updateStatus("Shipped to Supplier")}
          className="flex-1 py-2 bg-indigo-600 text-white rounded"
        >
          Ship to Supplier
        </button>

        <button
          onClick={() => updateStatus("Received by Supplier")}
          className="flex-1 py-2 bg-blue-600 text-white rounded"
        >
          Supplier Received
        </button>

        <button
          onClick={() => updateStatus("Refund Received")}
          className="flex-1 py-2 bg-green-600 text-white rounded"
        >
          Refund Completed
        </button>
      </div>
    </div>
  );
};

export default AdminSupplierReturnAction;
