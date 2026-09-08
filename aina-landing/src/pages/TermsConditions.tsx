import { ScrollToTop } from '../components';
import { useSEO } from '../hooks/useSEO';

const BASE = 'https://ainaparadise.com';

export default function TermsConditions() {
  useSEO({
    title: 'Terms & Conditions | Aina Paradise Hotel',
    description: 'Read the terms and conditions for Aina Paradise Hotel. Understand our booking policies, cancellation rules, check-in/check-out times, and guest conduct guidelines.',
    canonical: `${BASE}/terms-conditions`,
    keywords: 'Aina Paradise terms and conditions, Aina Paradise booking policy, Aina Paradise cancellation policy, Aina Paradise hotel rules, Aina Paradise guest policy',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE}/terms-conditions#webpage`,
      'name': 'Terms & Conditions — Aina Paradise Hotel',
      'description': 'Terms and conditions governing bookings, cancellations, and guest conduct at Aina Paradise Hotel.',
      'url': `${BASE}/terms-conditions`,
      'isPartOf': { '@id': `${BASE}/#website` },
      'about': { '@id': `${BASE}/#hotel` },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE },
          { '@type': 'ListItem', 'position': 2, 'name': 'Terms & Conditions', 'item': `${BASE}/terms-conditions` },
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
        <h1 className="text-5xl text-white z-20 font-primary text-center">Terms &amp; Conditions</h1>
      </div>

      <div className="container mx-auto max-w-4xl py-16 px-4">
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2 className="h3 mb-3">1. Acceptance of Terms</h2>
        <p className="mb-6">By accessing or using the Aina Paradise website and booking services, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our services.</p>

        <h2 className="h3 mb-3">2. Reservations &amp; Bookings</h2>
        <p className="mb-6">All Aina Paradise reservations are subject to availability. A booking is confirmed only upon receipt of a confirmation email from Aina Paradise. We reserve the right to cancel any booking that cannot be fulfilled due to unforeseen circumstances, with a full refund issued.</p>

        <h2 className="h3 mb-3">3. Check-In &amp; Check-Out</h2>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>Aina Paradise check-in time: 3:00 PM</li>
          <li>Aina Paradise check-out time: 11:00 AM</li>
          <li>Early check-in and late check-out are subject to availability and may incur additional charges.</li>
        </ul>

        <h2 className="h3 mb-3">4. Cancellation Policy</h2>
        <p className="mb-6">Cancellations made more than 48 hours before the check-in date will receive a full refund. Cancellations within 48 hours of check-in are non-refundable. No-shows will be charged the full Aina Paradise booking amount.</p>

        <h2 className="h3 mb-3">5. Guest Conduct</h2>
        <p className="mb-6">Guests are expected to behave respectfully toward Aina Paradise staff and other guests. Aina Paradise reserves the right to remove any guest whose conduct is deemed disruptive or harmful, without refund.</p>

        <h2 className="h3 mb-3">6. Liability</h2>
        <p className="mb-6">Aina Paradise is not liable for loss, theft, or damage to personal belongings during your stay. Guests are responsible for any damage caused to Aina Paradise property during their stay.</p>

        <h2 className="h3 mb-3">7. Privacy</h2>
        <p className="mb-6">Your personal data is handled in accordance with our <a href="/privacy-policy" className="text-accent hover:underline">Aina Paradise Privacy Policy</a>.</p>

        <h2 className="h3 mb-3">8. Changes to Terms</h2>
        <p className="mb-6">Aina Paradise reserves the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the revised terms.</p>

        <h2 className="h3 mb-3">9. Contact</h2>
        <p>For questions regarding these terms, contact Aina Paradise at <a href="mailto:info@ainaparadise.com" className="text-accent hover:underline">info@ainaparadise.com</a>.</p>
      </div>
    </section>
  );
}
