import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import {
  getSupplierReturns,
  clearErrors,
} from "../../actions/supplierReturnAction";

const AdminSupplierReturnList = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, supplierReturns, error } = useSelector(
    (state) => state.supplierReturns
  );

  useEffect(() => {
    dispatch(getSupplierReturns());
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
      field: "product",
      headerName: "Product",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.image}
            alt={params.row.name}
            className="w-10 h-10 rounded object-cover"
          />
          {params.row.name}
        </div>
      ),
    },
    {
      field: "supplier",
      headerName: "Supplier",
      minWidth: 180,
      flex: 0.6,
    },
    {
      field: "qty",
      headerName: "Qty",
      minWidth: 80,
      flex: 0.2,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 180,
      flex: 0.5,
      renderCell: (params) => (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
          {params.row.status}
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
          to={`/admin/supplier-return/${params.row.id}`}
          className="text-blue-600 font-medium"
        >
          View
        </Link>
      ),
    },
  ];

  const rows =
    supplierReturns?.map((item) => ({
      id: item._id,
      invoice: item.invoiceNumber,
      name: item.product.name,
      image: item.product.image,
      supplier: item.supplier.name,
      qty: item.quantity,
      status: item.status,
    })) || [];

  return (
    <>
      <MetaData title="Supplier Returns | Admin" />
      {loading && <BackdropLoader />}

      <h1 className="text-lg font-semibold mb-4 uppercase">Supplier Returns</h1>

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

export default AdminSupplierReturnList;
