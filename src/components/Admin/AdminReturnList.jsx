import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import { getReturnRequests, clearErrors } from "../../actions/orderAction";

const AdminReturnList = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, returns, error } = useSelector(
    (state) => state.returnOrders
  );

  useEffect(() => {
    dispatch(getReturnRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
  }, [error, dispatch, enqueueSnackbar]);

  const columns = [
    {
      field: "invoice",
      headerName: "Invoice No",
      minWidth: 160,
      flex: 0.4,
    },
    {
      field: "name",
      headerName: "Product",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.image}
            alt={params.row.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {params.row.name}
        </div>
      ),
    },
    {
      field: "qty",
      headerName: "Qty",
      minWidth: 70,
      flex: 0.2,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.3,
      renderCell: (params) => <>₹{params.row.price.toLocaleString()}</>,
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 120,
      flex: 0.3,
      renderCell: (params) => (
        <>₹{(params.row.qty * params.row.price).toLocaleString()}</>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 160,
      flex: 0.4,
      renderCell: () => (
        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
          Return Requested
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Link
          to={`/admin/return/${params.row.orderId}/${params.row.itemId}`}
          className="text-blue-600 font-medium"
        >
          View
        </Link>
      ),
    },
  ];

  const rows = [];

  returns &&
    returns.forEach((item) => {
      rows.push({
        id: item.itemId,
        orderId: item.orderId,
        itemId: item.itemId,
        invoice: item.invoiceNumber,
        name: item.name,
        image: item.image,
        qty: item.quantity,
        price: item.price,
      });
    });

  return (
    <>
      <MetaData title="Return Requests | Admin" />

      {loading && <BackdropLoader />}

      <h1 className="text-lg font-semibold mb-4 uppercase">Return Requests</h1>

      <div className="bg-white rounded-xl shadow-lg" style={{ height: 480 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectIconOnClick
          sx={{ border: 0 }}
        />
      </div>
    </>
  );
};

export default AdminReturnList;
