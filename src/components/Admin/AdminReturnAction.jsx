import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  approveReturn,
  rejectReturn,
  getReturnRequests,
} from "../../actions/orderAction";
import BackdropLoader from "../Layouts/BackdropLoader";
import { useSnackbar } from "notistack";

const AdminReturnAction = () => {
  const { orderId, itemId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, returns, success } = useSelector(
    (state) => state.returnOrders
  );

  // 🔹 find current item
  const item = returns?.find(
    (i) => i.orderId === orderId && i.itemId === itemId
  );

  useEffect(() => {
    if (!item) {
      dispatch(getReturnRequests());
    }
  }, [dispatch, item]);

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Return processed successfully", { variant: "success" });

      dispatch(getReturnRequests()); // refresh admin list
      dispatch({ type: "RETURN_ACTION_RESET" });

      navigate("/admin/returns");
    }
  }, [success, dispatch, enqueueSnackbar, navigate]);

  const approveHandler = async () => {
    dispatch(approveReturn(orderId, itemId));
  };

  const rejectHandler = async () => {
    dispatch(rejectReturn(orderId, itemId));
  };

  if (!item) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {loading && <BackdropLoader />}

      <h2 className="text-lg font-semibold mb-6 uppercase">
        Return Request Details
      </h2>

      {/* 🔹 Order Info */}
      <div className="border rounded-lg p-4 mb-6 bg-gray-50">
        <p className="text-sm text-gray-600">
          Invoice No: <span className="font-medium">{item.invoiceNumber}</span>
        </p>
        <p className="text-sm text-gray-600">
          Order ID: <span className="font-medium">{item.orderId}</span>
        </p>
      </div>

      {/* 🔹 Product Info */}
      <div className="flex gap-4 mb-6">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 rounded object-cover border"
        />

        <div className="flex-1">
          <h3 className="font-medium">{item.name}</h3>

          <p className="text-sm text-gray-600 mt-1">
            Quantity: {item.quantity}
          </p>

          <p className="text-sm text-gray-600">
            Price: ₹{item.price.toLocaleString()}
          </p>

          <p className="text-sm font-semibold mt-1">
            Total: ₹{(item.price * item.quantity).toLocaleString()}
          </p>
        </div>

        <span
          className="self-start px-3 py-1 text-xs font-semibold rounded-full 
                 bg-yellow-100 text-yellow-800 border border-yellow-300"
        >
          Return Requested
        </span>
      </div>

      {/* 🔹 Actions */}
      <div className="flex gap-4">
        <button
          onClick={approveHandler}
          className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Approve
        </button>

        <button
          onClick={rejectHandler}
          className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default AdminReturnAction;
