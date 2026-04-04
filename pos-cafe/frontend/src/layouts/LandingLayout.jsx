import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar isDashboard={false} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
