import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  clearErrors,
  deleteOrder,
  getAllOrders,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import Actions from "./Actions";
import { formatDate } from "../../utils/functions";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";

const OrderTable = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { orders, error } = useSelector((state) => state.allOrders);
  const {
    loading,
    isDeleted,
    error: deleteError,
  } = useSelector((state) => state.order);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isDeleted) {
      enqueueSnackbar("Deleted Successfully", { variant: "success" });
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllOrders());
  }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 100,
      flex: 0.1,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 200,
      flex: 0.2,
      renderCell: (params) => {
        return <span>₹{params.row.amount.toLocaleString()}</span>;
      },
    },
    {
      field: "orderOn",
      headerName: "Order On",
      type: "date",
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.3,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Actions
            editRoute={"order"}
            deleteHandler={deleteOrderHandler}
            id={params.row.id}
          />
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((order) => {
      const totalQuantity = order.orderItems.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0);
      rows.unshift({
        id: order._id,
        itemsQty: totalQuantity,
        amount: order.totalPrice,
        orderOn: formatDate(order.createdAt),
      });
    });

  return (
    <>
      <MetaData title="Admin Orders | MMIC" />

      {loading && <BackdropLoader />}

      <h1 className="text-lg font-medium uppercase">orders</h1>
      <div
        className="bg-white rounded-xl shadow-lg w-full"
        style={{ height: 470 }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectIconOnClick
          sx={{
            boxShadow: 0,
            border: 0,
          }}
        />
      </div>
    </>
  );
};

export default OrderTable;
