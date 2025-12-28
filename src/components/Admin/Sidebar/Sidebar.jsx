import { Link, useNavigate, useLocation } from "react-router-dom";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { logoutUser } from "../../../actions/userAction";
import { useState } from "react";

import "./Sidebar.css";

const Sidebar = ({ setToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.user);

  // 🔹 Auto open Reports only when on report pages
  const [showReports, setShowReports] = useState(
    location.pathname.startsWith("/admin/report")
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    enqueueSnackbar("Logout Successfully", { variant: "success" });
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar z-10 sm:z-0 block min-h-screen fixed left-0 pb-14 max-h-screen w-3/4 sm:w-1/5 bg-gray-800 text-white overflow-x-hidden border-r">
      {/* USER HEADER */}
      <div className="flex items-center gap-3 bg-gray-700 p-2 rounded-lg shadow-lg my-4 mx-3.5">
        <Avatar alt="Avatar" src={user?.avatar?.url} />
        <div className="flex flex-col">
          <span className="font-medium text-lg">{user?.name}</span>
          <span className="text-gray-300 text-sm">{user?.email}</span>
        </div>
        <button
          onClick={() => setToggleSidebar(false)}
          className="sm:hidden bg-gray-800 ml-auto rounded-full w-10 h-10 flex items-center justify-center"
        >
          <CloseIcon />
        </button>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-6 px-2">
        {/* DASHBOARD */}
        <MenuLink
          to="/admin/dashboard"
          icon={<EqualizerIcon />}
          label="Dashboard"
          active={isActive("/admin/dashboard")}
        />

        {/* SALES & ORDERS */}
        <MenuSection title="Sales & Orders">
          <MenuLink
            to="/admin/orders"
            icon={<ShoppingBagIcon />}
            label="Orders"
            active={isActive("/admin/orders")}
          />
          <MenuLink
            to="/admin/returns"
            icon={<InventoryIcon />}
            label="Customer Returns"
            active={isActive("/admin/returns")}
          />
          <MenuLink
            to="/admin/supplier-returns"
            icon={<InventoryIcon />}
            label="Supplier Returns"
            active={isActive("/admin/supplier-returns")}
          />
        </MenuSection>

        {/* CATALOG */}
        <MenuSection title="Catalog">
          <MenuLink
            to="/admin/products"
            icon={<InventoryIcon />}
            label="Products"
            active={isActive("/admin/products")}
          />
          <MenuLink
            to="/admin/new_product"
            icon={<AddBoxIcon />}
            label="Add Product"
            active={isActive("/admin/new_product")}
          />
          <MenuLink
            to="/admin/add_brand"
            icon={<AddBoxIcon />}
            label="Add Brand"
            active={isActive("/admin/add_brand")}
          />
          <MenuLink
            to="/admin/add_supplier"
            icon={<AddBoxIcon />}
            label="Add Supplier"
            active={isActive("/admin/add_supplier")}
          />
        </MenuSection>

        {/* USERS */}
        <MenuSection title="Users & Feedback">
          <MenuLink
            to="/admin/users"
            icon={<GroupIcon />}
            label="Users"
            active={isActive("/admin/users")}
          />
          <MenuLink
            to="/admin/reviews"
            icon={<ReviewsIcon />}
            label="Reviews"
            active={isActive("/admin/reviews")}
          />
        </MenuSection>

        {/* REPORTS */}
        <MenuSection title="Reports">
          <div
            onClick={() => setShowReports(!showReports)}
            className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-3">
              <EqualizerIcon />
              <span className="font-medium">Reports</span>
            </div>
            {showReports ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>

          {showReports && (
            <div className="ml-8 mt-2 flex flex-col gap-1 text-sm">
              <SubLink to="/admin/report/orderStatus" label="Order Summary" />
              <SubLink to="/admin/report/revenue" label="Revenue Report" />
              <SubLink to="/admin/report/invoices" label="Invoice Report" />
              <SubLink to="/admin/report/productSales" label="Product Sales" />
              <SubLink
                to="/admin/report/supplier-sales"
                label="Supplier Sales"
              />
            </div>
          )}
        </MenuSection>

        {/* LOGOUT */}
        <MenuSection title="System">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-red-600 text-red-400 hover:text-white transition"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </MenuSection>
      </div>
    </aside>
  );
};

export default Sidebar;

/* 🔹 Helper Components */

const MenuSection = ({ title, children }) => (
  <div>
    <p className="text-gray-400 uppercase text-xs px-4 mb-2">{title}</p>
    <div className="flex flex-col gap-1">{children}</div>
  </div>
);

const MenuLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex gap-3 items-center px-4 py-3 rounded font-medium ${
      active ? "bg-gray-700" : "hover:bg-gray-700"
    }`}
  >
    {icon}
    {label}
  </Link>
);

const SubLink = ({ to, label }) => (
  <Link to={to} className="px-3 py-2 rounded hover:bg-gray-700 text-gray-300">
    {label}
  </Link>
);
