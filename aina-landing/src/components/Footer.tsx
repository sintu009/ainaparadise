import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogoWhite } from "../assets";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Sitemap", href: "/sitemap" },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/#rooms" },
  { label: "Contact", href: "/#contact" },
];

const LOCATIONS = [
  {
    name: "Aina Paradise — Naal Badi",
    address: "Jaisalmer Road, Naal Badi, Bikaner, Rajasthan",
  },
  { name: "Aina Paradise — Belasar", address: "Belasar, Bikaner, Rajasthan" },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    }
  };

  return (
    <footer className="bg-primary text-white">
      {/* Main footer */}
      <div className="container mx-auto max-w-7xl px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <a href="/" aria-label="Aina Paradise Home">
            <img
              src={LogoWhite}
              alt="Aina Paradise"
              className="w-[150px] h-auto"
            />
          </a>
          <p className="text-sm text-white/60 leading-relaxed">
            Experience warm hospitality and comfortable stays at Aina Paradise
            — your home away from home in Bikaner, Rajasthan.
          </p>
        </div>

        {/* Locations */}
        <div>
          <h4 className="text-xs font-tertiary tracking-[3px] uppercase text-accent mb-4">
            Our Locations
          </h4>
          <ul className="space-y-4">
            {LOCATIONS.map(({ name, address }) => (
              <li key={name} className="flex gap-3 text-sm text-white/60">
                <HiLocationMarker className="text-accent mt-0.5 shrink-0 text-base" />
                <span>
                  <span className="text-white/90 block">{name}</span>
                  {address}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-tertiary tracking-[3px] uppercase text-accent mb-4">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex gap-3 items-center">
              <HiPhone className="text-accent shrink-0 text-base" />
              <a
                href="tel:+919739049452"
                className="hover:text-accent transition-colors"
              >
                +91 97390 49452
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <HiPhone className="text-accent shrink-0 text-base" />
              <a
                href="tel:+916376717799"
                className="hover:text-accent transition-colors"
              >
                +91 63767 17799
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <HiMail className="text-accent shrink-0 text-base" />
              <a
                href="mailto:info@ainaparadise.com"
                className="hover:text-accent transition-colors"
              >
                info@ainaparadise.com
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-tertiary tracking-[3px] uppercase text-accent mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                {href.startsWith('/#') ? (
                  <button onClick={() => handleNavClick(href)} className="hover:text-accent transition-colors">
                    {label}
                  </button>
                ) : (
                  <Link to={href} className="hover:text-accent transition-colors">{label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Aina Paradise. All rights
            reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="hover:text-accent transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
