import React from "react";
import CreateAdmin from "../components/AdminOperations";
import LogOut from "../authentication/logout/page";
import ChangeUser from "../components/ChangeUser";
import AdminOperations from "../components/AdminOperations";

const page = () => {
  return (
    <>
      <div className="">
        <LogOut />
        <AdminOperations/>
    <div>
     </div>
      </div>
    </>
  );
};

export default page;
