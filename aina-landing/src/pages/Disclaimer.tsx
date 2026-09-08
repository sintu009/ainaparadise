import { ScrollToTop } from '../components';
import { useSEO } from '../hooks/useSEO';

const BASE = 'https://ainaparadise.com';

export default function Disclaimer() {
  useSEO({
    title: 'Disclaimer | Aina Paradise Hotel',
    description: 'Read the official disclaimer for Aina Paradise Hotel. Information about pricing accuracy, room image representations, third-party links, and limitations of liability.',
    canonical: `${BASE}/disclaimer`,
    keywords: 'Aina Paradise disclaimer, Aina Paradise liability, Aina Paradise website disclaimer, Aina Paradise hotel information, Aina Paradise pricing disclaimer',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE}/disclaimer#webpage`,
      'name': 'Disclaimer — Aina Paradise Hotel',
      'description': 'Official disclaimer for Aina Paradise Hotel website covering pricing, images, third-party links, and liability.',
      'url': `${BASE}/disclaimer`,
      'isPartOf': { '@id': `${BASE}/#website` },
      'about': { '@id': `${BASE}/#hotel` },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE },
          { '@type': 'ListItem', 'position': 2, 'name': 'Disclaimer', 'item': `${BASE}/disclaimer` },
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
        <h1 className="text-5xl text-white z-20 font-primary text-center">Disclaimer</h1>
      </div>

      <div className="container mx-auto max-w-4xl py-16 px-4">
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2 className="h3 mb-3">1. General Information</h2>
        <p className="mb-6">The information provided on the Aina Paradise website is for general informational purposes only. While Aina Paradise strives to keep information accurate and up to date, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the content.</p>

        <h2 className="h3 mb-3">2. Pricing &amp; Availability</h2>
        <p className="mb-6">Aina Paradise room rates, availability, and promotional offers displayed on this website are subject to change without notice. Confirmed pricing is only guaranteed upon receipt of an Aina Paradise booking confirmation email.</p>

        <h2 className="h3 mb-3">3. Images &amp; Descriptions</h2>
        <p className="mb-6">Aina Paradise room images and descriptions are representative and may vary slightly from the actual room assigned. We endeavor to provide accurate visual representations but cannot guarantee exact replication.</p>

        <h2 className="h3 mb-3">4. Third-Party Links</h2>
        <p className="mb-6">The Aina Paradise website may contain links to third-party websites for your convenience. Aina Paradise has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.</p>

        <h2 className="h3 mb-3">5. Limitation of Liability</h2>
        <p className="mb-6">To the fullest extent permitted by law, Aina Paradise shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or our services.</p>

        <h2 className="h3 mb-3">6. Medical &amp; Health Advice</h2>
        <p className="mb-6">Any wellness, spa, or health-related content on the Aina Paradise website is for informational purposes only and does not constitute professional medical advice. Consult a qualified health professional before undertaking any wellness program.</p>

        <h2 className="h3 mb-3">7. Contact</h2>
        <p>If you have questions about this disclaimer, please contact Aina Paradise at <a href="mailto:info@ainaparadise.com" className="text-accent hover:underline">info@ainaparadise.com</a>.</p>
      </div>
    </section>
  );
}
