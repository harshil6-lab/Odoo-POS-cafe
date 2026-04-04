import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

export default function DashboardLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex min-h-[calc(100vh-96px)] flex-col">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
