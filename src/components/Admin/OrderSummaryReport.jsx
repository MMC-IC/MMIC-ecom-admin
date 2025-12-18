import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";

const OrderSummaryReport = () => {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.allOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const rows = orders.map((order) => ({
    id: order._id,
    invoiceNumber: order.invoiceNumber,
    customer: order.shippingInfo.name,
    email: order.shippingInfo.email,
    phone: order.shippingInfo.mobileNo,
    totalAmount: Number(order.totalPrice.toFixed(2)),
    date: new Date(order.createdAt).toLocaleDateString("en-IN"),
  }));

  const columns = [
    {
      field: "invoiceNumber",
      headerName: "Invoice Number",
      flex: 1,
      renderCell: (params) => (
        <button
          className="text-blue-600 underline"
          onClick={() =>
            setSelectedOrder(orders.find((o) => o._id === params.row.id))
          }
        >
          {params.value}
        </button>
      ),
    },
    { field: "customer", headerName: "Customer", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      renderCell: (params) => `₹${params.value}`,
    },
    { field: "date", headerName: "Ordered On", flex: 1 },
  ];

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Summary");
    XLSX.writeFile(wb, "Order_Summary_Report.xlsx");
  };

  const itemRows = useMemo(() => {
    if (!selectedOrder) return [];
    return selectedOrder.orderItems.map((item) => ({
      id: item._id,
      invoiceNumber: selectedOrder.invoiceNumber,
      product: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      status: item.status,
    }));
  }, [selectedOrder]);

  const itemColumns = [
    { field: "invoiceNumber", headerName: "Invoice", flex: 1 },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "quantity", headerName: "Qty", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (p) => `₹${p.value}`,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      renderCell: (p) => `₹${p.value}`,
    },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Order Summary Report</h2>
        <IconButton onClick={exportExcel}>
          <FileDownloadIcon />
        </IconButton>
      </div>

      <DataGrid rows={rows} columns={columns} autoHeight />

      {selectedOrder && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Order Item Status Report
          </h2>
          <DataGrid rows={itemRows} columns={itemColumns} autoHeight />
        </div>
      )}
    </div>
  );
};

export default OrderSummaryReport;
