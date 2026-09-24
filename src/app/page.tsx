


import SideBar from "@/components/ui/SideBar";
import TopBar from "@/components/ui/TopBar";
import DataDisplay from "@/components/ui/DataDisplay";
import Table, {
  type TableField,
  type TableRow,
} from "@/components/ui/Table";
const bugsFields: TableField[] = [
  { field: "name", label: "Name" },
  { field: "description", label: "Description" },
];
const recentActivityFields: TableField[] = [
  { field: "type", label: "Type" },
  { field: "name", label: "Name" },
  { field: "description", label: "Description" },
];
const recentActivity: TableRow[] = [
  {
    type: "Test case created",
    name: "Made button test",
    description: "Verified the confirmation button behavior.",
  },
  {
    type: "Test case updated",
    name: "Login validation",
    description: "Added invalid email and password checks.",
  },
  {
    type: "Test run completed",
    name: "Checkout flow",
    description: "Completed 12 checks with 10 passed and 2 failed.",
  },
];

const highPriorityBugs: TableRow[] = [
  {
    name: "Confirmation dialog spacing",
    description: "The action buttons are too close to the confirmation message.",
  },
  {
    name: "Progress bar overflow",
    description: "Progress values above 100% extend past the container.",
  },
  {
    name: "Login error not displayed",
    description: "Invalid credentials do not show an error message.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen pl-64">
      <TopBar name="Home" />
       
      <SideBar />
      <section className="px-8 py-12">
        <p className="dashboard-eyebrow">QA Tracker</p>
        <h1 className="welcome-text">Welcome back to your dashboard</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 place-items-center">
          <DataDisplay name="Project 1" />
          <DataDisplay name="Project 2" />
          <DataDisplay name="Project 3" />
          <DataDisplay name="Project 4" />
        </div>
        <Table name="High Priority Bugs" data={highPriorityBugs} fields={bugsFields} />
        <Table
          name="Recent Activity"
          data={recentActivity}
          fields={recentActivityFields}
        />
      </section>
    </main>
  );
}
