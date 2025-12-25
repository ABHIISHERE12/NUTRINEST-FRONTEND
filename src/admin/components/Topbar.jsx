import React from "react";
import { Menu, Bell } from "lucide-react";
import Navbar from "./Navbar";

export default function Topbar({ onToggleSidebar }) {
  const savedData = JSON.parse(localStorage.getItem("adminData")) || {};
  const avatarUrl = savedData.avatar || "/profile.jpg";

  return (
    <header className="topbar bg-white border-bottom d-flex align-items-center justify-content-between px-4 py-2">
      {/* LEFT SECTION */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-sm d-lg-none" onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>

        {/* LOGO TEXT (matches image) */}
        <div className="d-flex align-items-center">
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 1,
              color: "#111827", // dark text
            }}
          >
            NUTRI
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 1,
              color: "#7AC943", // green like logo
              marginLeft: 2,
            }}
          >
            NEST
          </span>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light position-relative">
          <Bell size={20} />
        </button>

        <Navbar avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
