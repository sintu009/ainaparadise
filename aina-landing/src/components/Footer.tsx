import { Link } from 'react-router-dom';
import { LogoWhite } from '../assets';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Sitemap', href: '/sitemap' },
];

export default function Footer() {
  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto max-w-7xl text-white flex flex-col gap-8 sm:flex-row sm:justify-between sm:items-start">
        <a href="/" aria-label="Aina Paradise Home">
          <LogoWhite />
        </a>

        <nav aria-label="Legal links" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link key={href} to={href} className="hover:text-accent transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <div className="text-sm text-white/70 text-center sm:text-right">
          <p>&copy; {new Date().getFullYear()} Aina Paradise. All rights reserved.</p>
          <p className="mt-1">Luxury Hotel &amp; Suites</p>
        </div>
      </div>
    </footer>
  );
}
