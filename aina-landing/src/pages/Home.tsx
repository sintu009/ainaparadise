import { BookForm, HeroSlider, Rooms, ScrollToTop } from "../components";
import { useSEO } from "../hooks/useSEO";

const BASE = "https://ainaparadise.com";

export default function Home() {
  useSEO({
    title: "Aina Paradise — Hotel Rooms & Suites | Book Online",
    description:
      "Welcome to Aina Paradise — a premium hotel in Bikaner, Rajasthan with comfortable rooms and suites. Book your stay online at the best rates.",
    canonical: BASE,
    keywords:
      "Aina Paradise, Aina Paradise hotel, Aina Paradise booking, Aina Paradise rooms, Aina Paradise suites, hotel booking, hotel Bikaner, Rajasthan hotel, online room booking",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${BASE}/#webpage`,
      name: "Aina Paradise — Hotel & Suites",
      url: BASE,
      description:
        "Book comfortable rooms and suites at Aina Paradise Hotel in Bikaner, Rajasthan. Enjoy warm hospitality and premium accommodation.",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#hotel` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        ],
      },
    },
  });

  return (
    <div>
      <ScrollToTop />
      <HeroSlider />
      <div className="container mx-auto max-w-7xl relative">
        <div className="bg-accent/20 mt-4 p-4 lg:absolute lg:left-0 lg:right-0 lg:p-0 lg:-top-12 lg:z-30 lg:shadow-xl">
          <BookForm />
        </div>
      </div>
      <Rooms />

      {/* Contact section */}
      <section id="contact" className="bg-primary py-16 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <p className="font-tertiary uppercase tracking-[6px] text-[13px] text-accent mb-2">
            Get In Touch
          </p>
          <h2 className="font-primary text-[40px] mb-6">
            Contact Aina Paradise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-white/80 font-tertiary text-[15px]">
            <div>
              <p className="text-accent uppercase tracking-[3px] mb-2 text-[13px]">
                Address
              </p>
              <p>Jaisalmer Road, Naal Badi, Bikaner, Rajasthan</p>
            </div>
            <div>
              <p className="text-accent uppercase tracking-[3px] mb-2 text-[13px]">
                Phone
              </p>
              <p>+91 63767 17799</p>
              <p>+91 97390 49452</p>
            </div>
            <div>
              <p className="text-accent uppercase tracking-[3px] mb-2 text-[13px]">
                Email
              </p>
              <a
                href="mailto:info@ainaparadise.com"
                className="hover:text-accent transition-colors"
              >
                info@ainaparadise.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
