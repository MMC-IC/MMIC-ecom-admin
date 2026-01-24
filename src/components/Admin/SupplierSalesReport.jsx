// SupplierReport.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import { getSupplierSales } from "../../actions/supplierAction";

export default function SupplierReport() {
  const dispatch = useDispatch();
  const { sales = [] } = useSelector((state) => state.supplierSales || {});

  const [supplierFilter, setSupplierFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getSupplierSales());
  }, [dispatch]);

  // ------------------
  // Prepare Supplier Table Rows
  // ------------------
  const supplierRows = useMemo(() => {
    let sno = 1;
    return sales
      .filter((s) =>
        s.supplierName
          .toLowerCase()
          .includes(supplierFilter.trim().toLowerCase())
      )
      .map((supplier) => ({
        id: supplier._id,
        sno: sno++,
        supplierName: supplier.supplierName,
        supplierEmail: supplier.supplierEmail,
        totalProduct: supplier.products.length,
        totalQuantity: supplier.totalQuantity,
        totalAmount: supplier.totalAmount,
      }));
  }, [sales, supplierFilter]);

  const supplierColumns = [
    { field: "sno", headerName: "S.No", flex: 0.4 },
    {
      field: "supplierName",
      headerName: "Supplier",
      flex: 1,
      renderCell: (params) => (
        <button
          className="text-blue-600 underline"
          onClick={() => {
            setSelectedSupplier(
              sales.find((s) => s._id === params.row.id) || null
            );
            setSelectedProduct(null);
            setProductFilter("");
          }}
        >
          {params.value}
        </button>
      ),
    },
    { field: "supplierEmail", headerName: "Email", flex: 1.2 },
    { field: "totalProduct", headerName: "Products", flex: 0.6 },
    { field: "totalQuantity", headerName: "Quantity", flex: 0.6 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 0.8,
      valueFormatter: (params) => `₹${params.value.toLocaleString()}`,
    },
  ];

  const exportSupplierExcel = () => {
    const excelRows = supplierRows.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, "Suppliers_Report.xlsx");
  };

  // ------------------
  // Prepare Product Table Rows (for selected supplier)
  // ------------------
  const productRows = useMemo(() => {
    if (!selectedSupplier) return [];
    let sno = 1;
    return selectedSupplier.products
      .filter((p) =>
        p.productName.toLowerCase().includes(productFilter.trim().toLowerCase())
      )
      .map((p) => {
        // Combine statuses (new) or default (old) for quantity & amount summary
        let totalQuantity = 0;
        let totalAmount = 0;
        if (p.statuses) {
          p.statuses.forEach((s) => {
            totalQuantity += s.totalQuantity || 0;
            totalAmount += s.totalAmount || 0;
          });
        } else {
          totalQuantity = p.totalQuantity || 0;
          totalAmount = p.totalAmount || 0;
        }
        return {
          id: p.productId,
          sno: sno++,
          productName: p.productName,
          totalQuantity,
          totalAmount,
          rawProduct: p, // keep full product object
        };
      });
  }, [selectedSupplier, productFilter]);

  const productColumns = [
    { field: "sno", headerName: "S.No", flex: 0.4 },
    {
      field: "productName",
      headerName: "Product",
      flex: 1.5,
      renderCell: (params) => (
        <button
          className="text-blue-600 underline"
          onClick={() => {
            setSelectedProduct(params.row.rawProduct);
          }}
        >
          {params.value}
        </button>
      ),
    },
    { field: "totalQuantity", headerName: "Quantity", flex: 0.6 },
    {
      field: "totalAmount",
      headerName: "Amount",
      flex: 0.8,
      valueFormatter: (params) => `₹${params.value.toLocaleString()}`,
    },
  ];

  const exportProductExcel = () => {
    const excelRows = productRows.map(({ id, rawProduct, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    const fname = selectedSupplier
      ? `${selectedSupplier.supplierName.replace(/\s+/g, "_")}_Products.xlsx`
      : "Products.xlsx";
    XLSX.writeFile(wb, fname);
  };

  // ------------------
  // Prepare Invoice Table Rows (for selected product)
  // ------------------
  const invoiceRows = useMemo(() => {
    if (!selectedProduct) return [];
    const rows = [];
    let sno = 1;

    const p = selectedProduct;
    if (p.statuses) {
      p.statuses.forEach((s) => {
        (s.invoices || []).forEach((inv) => {
          rows.push({
            id: inv.invoiceNumber,
            sno: sno++,
            status: s.status,
            invoiceNumber: inv.invoiceNumber,
            invoiceDate: new Date(inv.invoiceDate).toLocaleString(),
            quantity: inv.quantity,
            amount: inv.amount,
          });
        });
      });
    } else if (p.invoiceInfo) {
      (p.invoiceInfo || []).forEach((inv) => {
        rows.push({
          id: inv.invoiceNumber,
          sno: sno++,
          status: p.status,
          invoiceNumber: inv.invoiceNumber,
          invoiceDate: new Date(inv.invoiceDate).toLocaleString(),
          quantity: inv.quantity,
          amount: inv.amount,
        });
      });
    }
    return rows;
  }, [selectedProduct]);

  const invoiceColumns = [
    { field: "sno", headerName: "S.No", flex: 0.4 },
    { field: "invoiceNumber", headerName: "Invoice No", flex: 1.2 },
    { field: "invoiceDate", headerName: "Date", flex: 1 },
    { field: "status", headerName: "Status", flex: 0.8 },
    { field: "quantity", headerName: "Quantity", flex: 0.6 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.8,
      valueFormatter: (params) => `₹${params.value.toLocaleString()}`,
    },
  ];

  const exportInvoiceExcel = () => {
    const excelRows = invoiceRows.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    const supplierName = selectedSupplier
      ? selectedSupplier.supplierName.replace(/\s+/g, "_")
      : "Supplier";
    const productName = selectedProduct
      ? selectedProduct.productName.replace(/\s+/g, "_")
      : "Product";
    XLSX.writeFile(wb, `${supplierName}_${productName}_Invoices.xlsx`);
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Supplier Filter + Export */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Supplier Sales Report</h2>
        <IconButton
          onClick={exportSupplierExcel}
          className="text-green-600 hover:text-green-700"
        >
          <FileDownloadIcon />
        </IconButton>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search supplier..."
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
          className="border px-2 py-1 rounded w-full md:w-1/3"
        />
      </div>

      <DataGrid
        rows={supplierRows}
        columns={supplierColumns}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className="bg-white rounded shadow"
        sx={{
          "& .MuiDataGrid-cell": { padding: "6px 12px" },
          "& .MuiDataGrid-columnHeaders": { padding: "6px 12px" },
        }}
      />

      {/* Product section */}
      {selectedSupplier && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Products – {selectedSupplier.supplierName}
            </h3>
            <IconButton
              onClick={exportProductExcel}
              className="text-green-600 hover:text-green-700"
            >
              <FileDownloadIcon />
            </IconButton>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search product..."
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="border px-2 py-1 rounded w-full md:w-1/3"
            />
          </div>
          <DataGrid
            rows={productRows}
            columns={productColumns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            className="bg-white rounded shadow"
            sx={{
              "& .MuiDataGrid-cell": { padding: "6px 12px" },
              "& .MuiDataGrid-columnHeaders": { padding: "6px 12px" },
            }}
          />
        </div>
      )}

      {/* Invoice section */}
      {selectedProduct && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Invoices – {selectedProduct.productName}
            </h3>
            <IconButton
              onClick={exportInvoiceExcel}
              className="text-green-600 hover:text-green-700"
            >
              <FileDownloadIcon />
            </IconButton>
          </div>
          <DataGrid
            rows={invoiceRows}
            columns={invoiceColumns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            className="bg-white rounded shadow"
            sx={{
              "& .MuiDataGrid-cell": { padding: "6px 12px" },
              "& .MuiDataGrid-columnHeaders": { padding: "6px 12px" },
            }}
          />
        </div>
      )}
    </div>
  );
}
