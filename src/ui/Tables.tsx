import AdminTable from "./AdminTable/AdminTable";
import KelasTable from "./AdminTable/KelasTable";
import MateriTable from "./AdminTable/MateriTable";
import StudentTable from "./AdminTable/StudentTable";

const Tables = () => {
  return (
    <div className="flex flex-col gap-5">
      <AdminTable />
      <StudentTable />
      <KelasTable />
      <MateriTable />
    </div>
  );
};

export default Tables;
