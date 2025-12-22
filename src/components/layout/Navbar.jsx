import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import WishlistDropdown from "../wishlist/WishlistDropdown";
import CartDropdown from "../cart/CartDropdown";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartDropdown, setCartDropdown] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [shadow, setShadow] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => setShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/products" },
    { name: "About Us", to: "/about" },
  ];

  return (
    <nav
      className={`bg-white sticky top-0 z-50 w-full transition-shadow ${
        shadow ? "shadow-md" : ""
      }`}
    >
      {/* Top Section */}
      <div className="py-3 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          {/* LOGO (UNCHANGED) */}
          <Link to="/" className="text-3xl font-extrabold tracking-wide">
            <span className="text-gray-900">NUTRI</span>
            <span className="text-[#82D173]">NEST</span>
          </Link>

          {/* RIGHT SIDE ICONS (UNCHANGED) */}
          <div className="flex items-center gap-6">
            {/* ACCOUNT */}
            <div className="hidden md:flex items-center gap-2 cursor-pointer text-black">
              <User className="w-6 h-6" />
              <div className="leading-tight text-sm">
                {user ? (
                  <>
                    <p className="font-semibold text-gray-900 mb-0">
                      {user.username}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 text-xs hover:text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div>
                    <p className="font-semibold text-gray-900">ACCOUNT</p>
                    <p className="text-gray-500 text-xs">
                      <Link to="/signup" className="hover:text-[#82D173]">
                        Register
                      </Link>
                      {" / "}
                      <Link to="/login" className="hover:text-[#82D173]">
                        Login
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* WISHLIST */}
            <div className="hidden md:flex items-center relative">
              <button
                onClick={() => setWishlistOpen(!wishlistOpen)}
                className="relative text-black"
              >
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1 -right-2 bg-yellow-400 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              </button>

              {wishlistOpen && (
                <div className="absolute top-8 right-0 z-50">
                  <WishlistDropdown onClose={() => setWishlistOpen(false)} />
                </div>
              )}
            </div>

            {/* CART */}
            <div className="relative hidden md:flex items-center">
              <button
                onClick={() => setCartDropdown(!cartDropdown)}
                className="relative text-black"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#82D173] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* NAV MENU (DESKTOP) – ✨ RESTYLED PART */}
      <div className="hidden md:flex justify-center bg-white border-t">
        <div className="flex gap-3 py-3">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.name}
                to={item.to}
                className={`px-5 py-2 rounded-full text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-[#82D173]/15 text-[#82D173]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Cart Sidebar Dropdown */}
      <AnimatePresence>
        {cartDropdown && (
          <CartDropdown onClose={() => setCartDropdown(false)} />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
