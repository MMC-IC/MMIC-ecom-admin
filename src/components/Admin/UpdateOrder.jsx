import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import {
  clearErrors,
  getOrderDetails,
  updateOrder,
} from "../../actions/orderAction";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";

import TrackStepper from "../Order/TrackStepper";
import Loading from "./Loading";
import MetaData from "../Layouts/MetaData";

const UpdateOrder = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const [itemStatus, setItemStatus] = useState({});

  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { isUpdated, error: updateError } = useSelector((state) => state.order);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    if (updateError) {
      enqueueSnackbar(updateError, { variant: "error" });
      dispatch(clearErrors());
    }

    if (isUpdated) {
      enqueueSnackbar("Order updated successfully", {
        variant: "success",
      });
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, updateError, isUpdated, enqueueSnackbar, id]);

  const getActiveStep = (status) => {
    if (status === "Cancelled") return -1;
    if (status === "Delivered") return 2;
    if (status === "Shipped") return 1;
    return 0;
  };

  const updateOrderSubmitHandler = (itemId) => {
    if (!itemStatus[itemId]) return;

    const formData = new FormData();
    formData.set("status", itemStatus[itemId]);

    dispatch(updateOrder(id, itemId, formData));
  };

  return (
    <>
      <MetaData title="Admin: Update Order | MMIC" />

      {loading ? (
        <Loading />
      ) : (
        <>
          {order && order.user && order.shippingInfo && (
            <div className="flex flex-col gap-4">
              {/* Back Button */}
              <Link
                to="/admin/orders"
                className="flex items-center font-medium text-primary-blue uppercase"
              >
                <ArrowBackIosIcon sx={{ fontSize: 18 }} />
                Go Back
              </Link>

              {/* Address */}
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2">Delivery Address</h3>
                  <h4 className="font-medium">{order.user.name}</h4>
                  <p className="text-sm">
                    {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                    {order.shippingInfo.pincode}
                  </p>
                  <p className="text-sm mt-1">Email: {order.user.email}</p>
                  <p className="text-sm">
                    Mobile: {order.shippingInfo.mobileNo}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              {order.orderItems.map((item) => {
                const {
                  _id,
                  image,
                  name,
                  price,
                  quantity,
                  status,
                  statusHistory,
                } = item;

                return (
                  <div
                    key={_id}
                    className="bg-white shadow rounded-lg p-4 flex flex-col gap-4"
                  >
                    {/* Product Info */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={image}
                        alt={name}
                        className="w-28 h-24 object-contain"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-gray-600">
                          Quantity: {quantity}
                        </p>
                        <p className="text-xs text-gray-600">Price: ₹{price}</p>
                        <p className="font-medium">
                          Total: ₹{price * quantity}
                        </p>
                      </div>

                      {/* Stepper */}
                      <div className="sm:w-1/2">
                        <TrackStepper statusHistory={item.statusHistory} />
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {status === "Cancelled" ||
                      status === "Delivered" ||
                      status === "Return Requested" ||
                      status === "Returned" ||
                      status === "Return Rejected" ? (
                        <span className="text-sm font-medium text-red-600">
                          {status === "Cancelled" && "This item is cancelled"}
                          {status === "Delivered" && "Item delivered"}
                          {status === "Return Requested" && "Return Requested"}
                          {status === "Returned" && "Item returned"}
                          {status === "Return Rejected" &&
                            "Item return rejected"}
                        </span>
                      ) : (
                        <>
                          <div className="flex flex-col sm:flex-row sm:w-full gap-3">
                            <div className="flex flex-col w-full sm:w-1/2">
                              <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                  value={itemStatus[_id] || ""}
                                  label="Status"
                                  onChange={(e) =>
                                    setItemStatus({
                                      ...itemStatus,
                                      [_id]: e.target.value,
                                    })
                                  }
                                >
                                  {status === "Ordered" && (
                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                  )}
                                  {status === "Shipped" && (
                                    <MenuItem value="Delivered">
                                      Delivered
                                    </MenuItem>
                                  )}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="flex flex-col w-full sm:w-1/2">
                              <button
                                type="button"
                                onClick={() => updateOrderSubmitHandler(_id)}
                                className="bg-primary-orange p-2.5 text-white font-medium rounded shadow hover:shadow-lg"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UpdateOrder;
