import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearErrors,
  getOrderDetails,
  updateOrder,
} from "../../actions/orderAction";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import { formatDate } from "../../utils/functions";
import TrackStepper from "../Order/TrackStepper";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MetaData from "../Layouts/MetaData";

const UpdateOrder = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

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
      enqueueSnackbar("Order Updates Successfully", { variant: "success" });
      dispatch({ type: UPDATE_ORDER_RESET });
    }
    dispatch(getOrderDetails(params.id));
  }, [dispatch, error, params.id, isUpdated, updateError, enqueueSnackbar]);

  const updateOrderSubmitHandler = (itemId) => {
    const formData = new FormData();

    formData.set("status", itemStatus[itemId]);
    dispatch(updateOrder(params.id, itemId, formData));
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
              <Link
                to="/admin/orders"
                className="ml-1 flex items-center gap-0 font-medium text-primary-blue uppercase"
              >
                <ArrowBackIosIcon sx={{ fontSize: "18px" }} />
                Go Back
              </Link>

              <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg min-w-full">
                <div className="sm:w-1/2 border-r">
                  <div className="flex flex-col gap-3 my-8 mx-10">
                    <h3 className="font-medium text-lg">Delivery Address</h3>
                    <h4 className="font-medium">{order.user.name}</h4>
                    <p className="text-sm">
                      {order.shippingInfo.address}, {order.shippingInfo.city},
                      {/* {order.shippingInfo.state}, */}{" "}
                      {order.shippingInfo.pincode}
                    </p>

                    <div className="flex gap-2 text-sm">
                      <p className="font-medium">Email</p>
                      <p>{order.user.email}</p>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <p className="font-medium">Mobile Number</p>
                      <p>{order.shippingInfo.mobileNo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {order.orderItems &&
                order.orderItems.map((item) => {
                  const { _id, image, name, price, quantity, status } = item;

                  return (
                    <div
                      className="flex flex-col min-w-full shadow-lg rounded-lg bg-white px-2 py-5 gap-4"
                      key={_id}
                    >
                      {/* Row 1 - Product Image + Name + Qty + Price */}
                      <div className="flex flex-col sm:flex-row sm:w-full gap-3">
                        <div className="w-full sm:w-32 h-24">
                          <img
                            draggable="false"
                            className="h-full w-full object-contain"
                            src={image}
                            alt={name}
                          />
                        </div>

                        <div className="flex flex-col gap-1 overflow-hidden">
                          <p className="text-sm">
                            {name.length > 45
                              ? `${name.substring(0, 45)}...`
                              : name}
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            Quantity: {quantity}
                          </p>
                          <p className="text-xs text-gray-600">
                            Price: ₹{price.toLocaleString()}
                          </p>
                          <span className="font-medium">
                            Total: ₹{(quantity * price).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-col w-full sm:w-1/2">
                          <h3 className="font-medium sm:text-center">
                            Order Status
                          </h3>
                          <TrackStepper
                            orderOn={order.createdAt}
                            shippedAt={order.shippedAt}
                            deliveredAt={order.deliveredAt}
                            activeStep={
                              status === "Delivered"
                                ? 2
                                : status === "Shipped"
                                ? 1
                                : 0
                            }
                          />
                        </div>
                      </div>

                      {/* Row 2 - Dropdown + Update Button */}
                      <div className="flex flex-col sm:flex-row sm:w-full gap-3">
                        <div className="flex flex-col w-full sm:w-1/2">
                          <FormControl fullWidth sx={{ marginTop: 1 }}>
                            <InputLabel id={`status-${_id}`}>Status</InputLabel>
                            <Select
                              labelId={`status-${_id}`}
                              value={itemStatus[_id] || ""}
                              label="Status"
                              onChange={(e) =>
                                setItemStatus({
                                  ...itemStatus,
                                  [_id]: e.target.value,
                                })
                              }
                            >
                              {status === "Shipped" && (
                                <MenuItem value="Delivered">Delivered</MenuItem>
                              )}
                              {status === "Ordered" && (
                                <MenuItem value="Shipped">Shipped</MenuItem>
                              )}
                              {status === "Delivered" && (
                                <MenuItem value="Delivered">Delivered</MenuItem>
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
