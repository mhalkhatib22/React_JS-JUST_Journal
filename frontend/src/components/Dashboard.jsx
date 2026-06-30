import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import "./DashboardLayout.css";

const Dashboard= () => {
  return (
    <>
      <style>
        {`.dashboard-layout {
            min-height: 100vh;
            background-color: #f8f9fa;
            }
            .dashboard-content {
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
            }`
        }
      </style>
      <div className="dashboard-layout">
        <Navbar />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
