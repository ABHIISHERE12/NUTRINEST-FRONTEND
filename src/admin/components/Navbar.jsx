import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { LogOut, Camera } from "lucide-react";

export default function Navbar() {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("Badal");
  const [avatar, setAvatar] = useState("/profile.jpg");

  // Load saved data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminData"));
    if (saved) {
      setName(saved.name || "Badal");
      setAvatar(saved.avatar || "/profile.jpg");
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("adminData", JSON.stringify({ name, avatar }));
  }, [name, avatar]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const hasCustomAvatar = avatar && avatar !== "" && avatar !== "/profile.jpg";

  return (
    <div className="position-relative" ref={menuRef}>
      {/* PROFILE ICON */}
      <button
        className="btn p-0 border-0 bg-transparent"
        onClick={() => setOpen(!open)}
      >
        {hasCustomAvatar ? (
          <img
            src={avatar}
            alt="profile"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
              border: "2px solid rgb(130,209,115)",
            }}
          />
        ) : (
          <CgProfile
            size={44}
            style={{
              color: "rgb(130,209,115)",
              cursor: "pointer",
            }}
          />
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="position-absolute end-0 mt-2 bg-white shadow rounded"
          style={{ width: 230, zIndex: 1000 }}
        >
          {/* PROFILE EDIT */}
          <div className="p-3 border-bottom text-center">
            <label style={{ cursor: "pointer" }}>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={avatar}
                  alt="avatar"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgb(130,209,115)",
                  }}
                />
                <Camera
                  size={16}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "rgb(130,209,115)",
                    color: "#fff",
                    borderRadius: "50%",
                    padding: 3,
                  }}
                />
              </div>
            </label>

            <input
              className="form-control form-control-sm mt-2 text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* LOGOUT */}
          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
