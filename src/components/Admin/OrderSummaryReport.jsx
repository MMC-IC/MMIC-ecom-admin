import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";

const OrderSummaryReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [], loading } = useSelector((state) => state.allOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const rows = orders.map((order) => ({
    invoiceNumber: order.invoiceNumber,
    id: order._id,
    oid: order._id,
    customer: order.shippingInfo.name,
    email: order.shippingInfo.email,
    phone: order.shippingInfo.mobileNo,
    price: Number(
      order.orderItems.reduce((total, item) => total + item.price, 0).toFixed(2)
    ),
    sgst: Number(order.SGST.toFixed(2)),
    cgst: Number(order.CGST.toFixed(2)),
    discount: Number(order.discount.toFixed(2)),
    totalAmount: Number(order.totalPrice.toFixed(2)),
    date: new Date(order.createdAt).toLocaleDateString("en-IN"),
  }));

  const columns = [
    {
      field: "invoiceNumber",
      headerName: "Invoice number",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <button
          className="text-blue-600 underline"
          onClick={() => {
            setSelectedOrder(
              orders.find((o) => o._id === params.row.id) || null
            );
          }}
        >
          {params.value}
        </button>
      ),
    },
    { field: "customer", headerName: "Customer", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 130 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: "sgst",
      headerName: "SGST",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: "cgst",
      headerName: "CGST",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: "discount",
      headerName: "Discount",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: "date",
      headerName: "Ordered On",
      flex: 1,
      minWidth: 160,
    },
  ];

  const exportExcel = () => {
    const excelRows = rows.map(({ id, oid, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Summary Report");
    XLSX.writeFile(wb, "Order_Summary_Report.xlsx");
  };

  const orderRows = useMemo(() => {
    if (!selectedOrder) return [];
    return selectedOrder.orderItems.map((order) => ({
      invoiceNumber: selectedOrder.invoiceNumber,
      id: order._id,
      oid: order._id,
      productName: order.name,
      price: Number(order.price.toFixed(2)),
      quantity: order.quantity,
      totalAmount: Number(order.price * order.quantity).toFixed(2),
      status: order.status,
    }));
  }, [selectedOrder]);

  const orderColumns = [
    {
      field: "invoiceNumber",
      headerName: "Invoice number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "productName",
      headerName: "Product name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => `₹${params.value}`,
    },
    { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 150 },
    {
      field: "totalAmount",
      headerName: "Total amount",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => `₹${params.value}`,
    },
    { field: "status", headerName: "status", flex: 1, minWidth: 150 },
  ];

  const exportItemStatusExcel = () => {
    const excelItemStatusRows = orderRows.map(({ id, oid, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(excelItemStatusRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Item Status Report");
    XLSX.writeFile(wb, "Order_Item_Status_Report.xlsx");
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Order Summary Report</h2>
        <IconButton
          onClick={exportExcel}
          className="text-green-600 hover:text-green-700"
        >
          <FileDownloadIcon />
        </IconButton>
      </div>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          pageSize={10}
          disableRowSelectionOnClick
        />
      </div>
      {selectedOrder && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Order Item Status Report</h2>
            <IconButton
              onClick={exportItemStatusExcel}
              className="text-green-600 hover:text-green-700"
            >
              <FileDownloadIcon />
            </IconButton>
          </div>
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={orderRows}
              columns={orderColumns}
              loading={loading}
              autoHeight
              pageSize={10}
              disableRowSelectionOnClick
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryReport;
