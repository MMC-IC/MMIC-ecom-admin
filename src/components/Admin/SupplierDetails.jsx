import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  NEW_SUPPLIER_RESET,
  DELETE_SUPPLIER_RESET,
  UPDATE_SUPPLIER_RESET,
  REMOVE_SUPPLIER_DETAILS,
} from "../../constants/supplierConstants";
import Actions from "./Actions";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import {
  clearErrors,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierDetails,
} from "../../actions/supplierAction";

const SupplierDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const { suppliers, error } = useSelector((state) => state.suppliers);
  const {
    loadingDelete,
    isDeleted,
    error: deleteError,
  } = useSelector((state) => state.supplier);
  const {
    loadingAdd,
    success,
    error: addError,
  } = useSelector((state) => state.newSupplier);
  const {
    loadingUpdate,
    supplier,
    error: loadupdateError,
  } = useSelector((state) => state.supplierDetails);
  const {
    loading: updateLoading,
    isUpdated,
    error: updateError,
  } = useSelector((state) => state.supplier);

  const [supplierInput, setSupplierInput] = useState({ name: "", email: "" });

  useEffect(() => {
    dispatch(getSuppliers());
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (loadupdateError) {
      enqueueSnackbar(loadupdateError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isDeleted) {
      enqueueSnackbar("Supplier Deleted Successfully", { variant: "success" });
      dispatch({ type: DELETE_SUPPLIER_RESET });
      dispatch(getSuppliers());

      setSupplierInput({ name: "", email: "" });
      navigate("/admin/add_supplier");
    }
  }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

  useEffect(() => {
    if (addError) {
      enqueueSnackbar(addError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Supplier Created", { variant: "success" });
      dispatch({ type: NEW_SUPPLIER_RESET });
      dispatch(getSuppliers());

      setSupplierInput({ name: "", email: "" });
    }
  }, [dispatch, addError, success, enqueueSnackbar]);

  useEffect(() => {
    if (updateError) {
      enqueueSnackbar(updateError, { variant: "error" });
      dispatch(clearErrors());
    }

    if (isUpdated) {
      enqueueSnackbar("Supplier Updated Successfully", { variant: "success" });
      dispatch({ type: UPDATE_SUPPLIER_RESET });
      dispatch({ type: REMOVE_SUPPLIER_DETAILS });
      dispatch(getSuppliers());

      setSupplierInput({ name: "", email: "" });
      navigate("/admin/add_supplier");
    }
  }, [isUpdated, updateError, dispatch, enqueueSnackbar, navigate]);

  useEffect(() => {
    if (!id) return;

    if (!supplier || supplier._id !== id) {
      dispatch(getSupplierDetails(id));
    } else {
      setSupplierInput({
        name: supplier.name,
        email: supplier.email,
      });
    }
  }, [dispatch, id, supplier]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierInput((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!supplierInput.name.trim()) {
      enqueueSnackbar("Enter Name", { variant: "warning" });
      return;
    }
    if (!supplierInput.email.trim()) {
      enqueueSnackbar("Enter Email", { variant: "warning" });
      return;
    }

    const formData = new FormData();
    formData.set("name", supplierInput.name);
    formData.set("email", supplierInput.email);

    if (!id) {
      dispatch(createSupplier(formData));
    } else {
      dispatch(updateSupplier(id, formData));
    }
  };

  const deleteSupplierHandler = (id) => {
    dispatch(deleteSupplier(id));
  };

  const columns = [
    {
      field: "id",
      headerName: "Supplier Id",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">{params.row.name}</div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Actions
          editRoute={"supplier"}
          deleteHandler={deleteSupplierHandler}
          id={params.row.id}
        />
      ),
    },
  ];

  const rows =
    suppliers?.map((item) => ({
      id: item._id,
      name: item.name,
      email: item.email,
    })) ?? [];

  return (
    <div className="flex flex-col gap-y-6 w-full mx-auto">
      {(loadingAdd || loadingDelete || updateLoading) && <BackdropLoader />}
      <div className="flex flex-col gap-y-6 w-full mx-auto">
        <form
          onSubmit={submitHandler}
          encType="multipart/form-data"
          id="mainform"
        >
          <h2 className="font-semibold text-lg text-gray-700">
            Supplier Details
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              label="Name"
              name="name"
              value={supplierInput.name}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={supplierInput.email}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            />
            <button className="bg-primary-blue text-white px-6 py-2 rounded hover:shadow">
              {id ? "Update" : "Add"}
            </button>
          </div>
        </form>

        <MetaData title="Admin Suppliers" />
        <div style={{ height: 470 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            sx={{ boxShadow: 0, border: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
