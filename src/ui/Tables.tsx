import AdminTable from "./AdminTable/AdminTable";
import MateriTable from "./AdminTable/MateriTable";
import StudentTable from "./AdminTable/StudentTable";

const Tables = () => {
  return (
    <div className="flex flex-col gap-5">
      <AdminTable />
      <StudentTable />
      <MateriTable />
    </div>
  );
};

export default Tables;
