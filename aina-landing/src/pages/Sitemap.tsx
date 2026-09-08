import { Link } from 'react-router-dom';
import { ScrollToTop } from '../components';
import { useSEO } from '../hooks/useSEO';

const BASE = 'https://ainaparadise.com';

const SITE_LINKS = [
  {
    category: 'Main Pages',
    links: [
      { label: 'Aina Paradise Home', href: '/' },
      { label: 'Aina Paradise Rooms & Suites', href: '/#rooms' },
      { label: 'Contact Aina Paradise', href: '/#contact' },
    ],
  },
  {
    category: 'Account',
    links: [
      { label: 'Login', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'My Bookings', href: '/my-bookings' },
    ],
  },
  {
    category: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-conditions' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
];

export default function Sitemap() {
  useSEO({
    title: 'Sitemap | Aina Paradise Hotel',
    description: 'Browse the complete sitemap of Aina Paradise Hotel. Find all pages including Aina Paradise rooms, bookings, legal information, and more.',
    canonical: `${BASE}/sitemap`,
    keywords: 'Aina Paradise sitemap, Aina Paradise pages, Aina Paradise website map, Aina Paradise hotel pages',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE}/sitemap#webpage`,
      'name': 'Sitemap — Aina Paradise Hotel',
      'description': 'Complete HTML sitemap for Aina Paradise Hotel website.',
      'url': `${BASE}/sitemap`,
      'isPartOf': { '@id': `${BASE}/#website` },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE },
          { '@type': 'ListItem', 'position': 2, 'name': 'Sitemap', 'item': `${BASE}/sitemap` },
        ],
      },
      'publisher': {
        '@type': 'Hotel',
        '@id': `${BASE}/#hotel`,
        'name': 'Aina Paradise',
      },
    },
  });

  return (
    <section>
      <ScrollToTop />
      <div className="bg-room h-[400px] relative flex justify-center items-center bg-cover bg-center">
        <div className="absolute w-full h-full bg-black/70" />
        <h1 className="text-5xl text-white z-20 font-primary text-center">Sitemap</h1>
      </div>

      <div className="container mx-auto max-w-4xl py-16 px-4">
        <p className="mb-10 text-gray-600">A complete overview of all pages available on the Aina Paradise website.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {SITE_LINKS.map(({ category, links }) => (
            <div key={category}>
              <h2 className="h3 mb-4 border-b border-accent pb-2">{category}</h2>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link to={href} className="text-primary hover:text-accent transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
