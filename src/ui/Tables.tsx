import AdminTable from "./AdminTable/AdminTable";
import KelasTable from "./AdminTable/KelasTable";
import MateriTable from "./AdminTable/MateriTable";
import StudentTable from "./AdminTable/StudentTable";
import TeacherTable from "./AdminTable/TeacherTable";

const Tables = () => {
  return (
    <div className="flex flex-col gap-5">
      <AdminTable />
      <TeacherTable />
      <StudentTable />
      <KelasTable />
      <MateriTable />
    </div>
  );
};

export default Tables;
