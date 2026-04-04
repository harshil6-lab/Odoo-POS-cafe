import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function LandingLayout() {
  return (
    <div className="flex min-h-screen w-full max-w-screen flex-col overflow-x-hidden bg-[#020617] text-slate-100 font-sans">
      <Navbar isDashboard={false} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
