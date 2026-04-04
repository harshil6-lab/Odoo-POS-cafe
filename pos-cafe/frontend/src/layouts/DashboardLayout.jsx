import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function DashboardLayout() {
  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden bg-[#0B1220] text-slate-100">
      <Navbar isDashboard={true} />
      <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
        <main className="flex-1 overflow-hidden p-4">
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
