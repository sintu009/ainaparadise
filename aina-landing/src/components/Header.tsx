import { useRoomContext } from "../context/RoomContext";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogoDark, LogoWhite } from "../assets";
import { HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/#rooms" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const { resetRoomFilterData } = useRoomContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (isHome) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(
          () =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
          300,
        );
      }
    }
  };

  const isDark = scrolled || menuOpen;
  const textColor = isDark ? "text-primary" : "text-white";

  return (
    <header
      className={`fixed z-50 w-full transition-colors duration-300 ${isDark ? "bg-white shadow-lg" : "bg-transparent"}`}
    >
      <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link
          to="/"
          onClick={resetRoomFilterData}
          className="block w-[140px] shrink-0"
          aria-label="Home"
        >
          <img
            src={isDark ? LogoWhite : LogoDark}
            alt="Aina Paradise"
            className="w-[140px] h-auto block"
          />
        </Link>

        {/* Desktop Nav */}
        <nav
          className={`hidden lg:flex items-center gap-x-8 font-tertiary tracking-[3px] text-[15px] uppercase ${textColor}`}
        >
          {NAV_LINKS.map(({ label, href }) =>
            href.startsWith("/#") ? (
              <button
                key={label}
                onClick={() => handleNavClick(href)}
                className="transition hover:text-accent"
              >
                {label}
              </button>
            ) : (
              <Link
                key={label}
                to={href}
                onClick={resetRoomFilterData}
                className="transition hover:text-accent"
              >
                {label}
              </Link>
            ),
          )}
          {user ? (
            <>
              <Link to="/my-bookings" className="transition hover:text-accent">
                My Bookings
              </Link>
              <button
                onClick={logout}
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 text-[13px] tracking-[2px] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition hover:text-accent">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 text-[13px] tracking-[2px] transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`lg:hidden text-2xl ${textColor}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-lg px-6 pb-6 flex flex-col gap-y-4 font-tertiary tracking-[2px] text-[15px] uppercase text-primary">
          {NAV_LINKS.map(({ label, href }) =>
            href.startsWith("/#") ? (
              <button
                key={label}
                onClick={() => handleNavClick(href)}
                className="text-left py-2 border-b border-gray-100 hover:text-accent transition"
              >
                {label}
              </button>
            ) : (
              <Link
                key={label}
                to={href}
                onClick={resetRoomFilterData}
                className="py-2 border-b border-gray-100 hover:text-accent transition"
              >
                {label}
              </Link>
            ),
          )}
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className="py-2 border-b border-gray-100 hover:text-accent transition"
              >
                My Bookings
              </Link>
              <button
                onClick={logout}
                className="bg-accent text-white px-4 py-2 text-[13px] tracking-[2px] w-full mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="py-2 border-b border-gray-100 hover:text-accent transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-accent text-white px-4 py-2 text-[13px] tracking-[2px] text-center mt-2"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
