import { ScrollToTop } from '../components';
import { useSEO } from '../hooks/useSEO';

const BASE = 'https://ainaparadise.com';

export default function PrivacyPolicy() {
  useSEO({
    title: 'Privacy Policy | Aina Paradise Hotel',
    description: 'Learn how Aina Paradise Hotel collects, uses, and protects your personal information. Our privacy policy covers data collection, cookies, retention, and your rights.',
    canonical: `${BASE}/privacy-policy`,
    keywords: 'Aina Paradise privacy policy, Aina Paradise data protection, Aina Paradise personal data, Aina Paradise cookies policy, Aina Paradise GDPR, Aina Paradise hotel privacy',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE}/privacy-policy#webpage`,
      'name': 'Privacy Policy — Aina Paradise Hotel',
      'description': 'Privacy policy for Aina Paradise Hotel detailing how guest data is collected, used, and protected.',
      'url': `${BASE}/privacy-policy`,
      'isPartOf': { '@id': `${BASE}/#website` },
      'about': { '@id': `${BASE}/#hotel` },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE },
          { '@type': 'ListItem', 'position': 2, 'name': 'Privacy Policy', 'item': `${BASE}/privacy-policy` },
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
        <h1 className="text-5xl text-white z-20 font-primary text-center">Privacy Policy</h1>
      </div>

      <div className="container mx-auto max-w-4xl py-16 px-4">
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2 className="h3 mb-3">1. Information We Collect</h2>
        <p className="mb-3">Aina Paradise collects the following types of personal information:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li><strong>Account data:</strong> name, email address, password (hashed)</li>
          <li><strong>Booking data:</strong> check-in/check-out dates, room preferences, guest count</li>
          <li><strong>Contact data:</strong> phone number (optional)</li>
          <li><strong>Usage data:</strong> pages visited, browser type, IP address (anonymized)</li>
        </ul>

        <h2 className="h3 mb-3">2. How Aina Paradise Uses Your Information</h2>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>To process and manage your Aina Paradise reservations</li>
          <li>To send Aina Paradise booking confirmations and updates</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="h3 mb-3">3. Data Sharing</h2>
        <p className="mb-6">Aina Paradise does not sell your personal data. We may share data with trusted service providers solely to fulfill your booking. All third parties are contractually obligated to protect your data.</p>

        <h2 className="h3 mb-3">4. Cookies</h2>
        <p className="mb-6">Aina Paradise uses essential cookies to maintain your session and preferences. No third-party advertising cookies are used. You can disable cookies in your browser settings, though some features may not function correctly.</p>

        <h2 className="h3 mb-3">5. Data Retention</h2>
        <p className="mb-6">Aina Paradise retains your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time.</p>

        <h2 className="h3 mb-3">6. Your Rights</h2>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Access the personal data Aina Paradise holds about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2 className="h3 mb-3">7. Security</h2>
        <p className="mb-6">Aina Paradise implements industry-standard security measures including HTTPS, hashed passwords, and access controls to protect your data from unauthorized access.</p>

        <h2 className="h3 mb-3">8. Contact</h2>
        <p>For privacy-related requests, contact the Aina Paradise Data Protection Officer at <a href="mailto:privacy@ainaparadise.com" className="text-accent hover:underline">privacy@ainaparadise.com</a>.</p>
      </div>
    </section>
  );
}
