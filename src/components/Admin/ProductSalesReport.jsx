import React, { useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { getAdminProducts } from "../../actions/productAction";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import IconButton from "@mui/material/IconButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ProductSalesReport = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.allOrders);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAdminProducts());
  }, [dispatch]);
  const rows = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    const sales = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!sales[item.product]) {
          const matchingProduct = products?.find((p) => p._id === item.product);

          sales[item.product] = {
            id: item.product,
            name: item.name,
            revenue: 0,
            stock: matchingProduct?.stock ?? "N/A",
            availableBaseStock: matchingProduct?.availableBaseStock ?? "N/A",
            quantity: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
          };
        }

        sales[item.product].revenue += item.quantity * item.price;
        sales[item.product].quantity += item.quantity;
        sales[item.product].shipped +=
          item.status === "Shipped" ? item.quantity : 0;
        sales[item.product].delivered +=
          item.status === "Delivered" ? item.quantity : 0;
        sales[item.product].cancelled +=
          item.status === "Cancelled" ? item.quantity : 0;
      });
    });

    return Object.values(sales).map((item, index) => ({
      ...item,
      id: index + 1,
    }));
  }, [orders, products]);

  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    {
      field: "revenue",
      headerName: "Revenue",
      type: "number",
      flex: 1,
      valueFormatter: (params) => `₹${params.value.toFixed(2)}`,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 1,
    },
    {
      field: "availableBaseStock",
      headerName: "Available Stock",
      type: "number",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Ordered",
      type: "number",
      flex: 1,
    },
    {
      field: "shipped",
      headerName: "Shipped",
      type: "number",
      flex: 1,
    },
    {
      field: "delivered",
      headerName: "Delivered",
      type: "number",
      flex: 1,
    },
    {
      field: "cancelled",
      headerName: "Cancelled",
      type: "number",
      flex: 1,
    },
  ];

  const exportToExcel = () => {
    const exportData = rows.map((item) => ({
      "Product Name": item.name,
      "Revenue (₹)": item.revenue.toFixed(2),
      Stock: item.stock,
      "Available Stock": item.availableBaseStock,
      Ordered: item.quantity,
      Shipped: item.shipped,
      Delivered: item.delivered,
      Cancelled: item.cancelled,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ProductSalesReport");
    XLSX.writeFile(workbook, "ProductSalesReport.xlsx");
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Product Sales Report</h2>
        <IconButton
          onClick={exportToExcel}
          className="text-green-600 hover:text-green-700"
        >
          <FileDownloadIcon />
        </IconButton>
      </div>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          className="bg-white rounded shadow"
        />
      </div>
    </div>
  );
};

export default ProductSalesReport;
