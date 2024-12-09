import React, { useState } from "react";
import AdminConsole from "./AdminConsole";
import AdminLogin from "./AdminLogin";

const AdminPage = ({ onLogin }) => {
    return <AdminLogin onLogin={onLogin} />;
};

export default AdminPage;
