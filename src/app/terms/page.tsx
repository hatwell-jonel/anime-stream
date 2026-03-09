import Image from "next/image";

const summaryCards = [
  {
    title: "Account rules",
    items: [
      "Keep your login secure and accurate",
      "One person per account unless stated",
      "Report unauthorized access quickly",
    ],
  },
  {
    title: "Content use",
    items: [
      "Stream for personal, non-commercial use",
      "Do not redistribute or scrape content",
      "Respect rights holders and licenses",
    ],
  },
  {
    title: "Community conduct",
    items: [
      "No harassment, abuse, or threats",
      "No cheating, bots, or exploits",
      "Follow applicable laws and policies",
    ],
  },
];

const termsSections = [
  {
    title: "Acceptance of terms",
    body:
      "By accessing or using Anime Stream, you agree to these Terms of Service. If you do not agree, do not use the service.",
  },
  {
    title: "Eligibility",
    body:
      "You must be at least 13 years old to use Anime Stream. If you are under the age of majority in your jurisdiction, you must have permission from a parent or guardian.",
  },
  {
    title: "Accounts and security",
    body:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.",
  },
  {
    title: "Subscriptions and billing",
    body:
      "Paid features, if offered, are billed on a recurring basis unless canceled. Prices, taxes, and billing cycles will be disclosed at checkout. Refunds are handled according to the policy presented at purchase.",
  },
  {
    title: "Streaming and content",
    body:
      "Anime Stream provides access to licensed content and metadata. You may stream content for personal, non-commercial use only. You may not download, copy, redistribute, or create derivative works except where explicitly permitted.",
  },
  {
    title: "Prohibited conduct",
    body:
      "You may not interfere with the service, attempt to access non-public systems, scrape data, bypass geo-restrictions, or use automated tools in a way that harms the service or other users.",
  },
  {
    title: "User content",
    body:
      "If you submit reviews, comments, or other content, you grant us a non-exclusive, worldwide, royalty-free license to display and distribute that content in connection with the service.",
  },
  {
    title: "Termination",
    body:
      "We may suspend or terminate your account if you violate these terms or if required by law. You may cancel your account at any time through settings.",
  },
  {
    title: "Disclaimers",
    body:
      "The service is provided on an " +
      "AS IS" +
      " and " +
      "AS AVAILABLE" +
      " basis. We do not warrant that the service will be uninterrupted or error-free.",
  },
  {
    title: "Limitation of liability",
    body:
      "To the fullest extent permitted by law, Anime Stream will not be liable for indirect, incidental, or consequential damages arising from your use of the service.",
  },
  {
    title: "Changes to terms",
    body:
      "We may update these terms from time to time. We will post the updated terms and revise the effective date below.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative">
        <div className="relative h-[32vh] md:h-[40vh] overflow-hidden">
          <Image
            src="/images/bg-1.webp"
            alt=""
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent" />

          <div className="absolute inset-0 flex items-end pb-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-2 w-16 bg-red-500 rounded-full" />
                <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
                  Legal
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white">
                Terms of Service
              </h1>
              <p className="text-gray-400 mt-3 max-w-2xl">
                These terms govern your use of Anime Stream. Please read them carefully
                before using the service.
              </p>
              <p className="text-xs text-gray-500 mt-4">Effective: March 9, 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border/60 bg-foreground/5 p-6 backdrop-blur"
            >
              <h2 className="text-lg font-semibold mb-3">{card.title}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {card.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            {termsSections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-border/50 bg-background/80 p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-foreground/5 p-6">
              <h3 className="text-lg font-semibold">Questions?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Contact us if you need clarification on these terms.
              </p>
              <a
                href="mailto:support@anime-stream.app"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-400"
              >
                support@anime-stream.app
              </a>
            </div>

            <div className="rounded-2xl border border-border/60 bg-foreground/5 p-6">
              <h3 className="text-lg font-semibold">Service policies</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>Use the service responsibly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>Keep your account information accurate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>Respect regional availability</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/60 bg-red-500/10 p-6">
              <h3 className="text-lg font-semibold text-red-500">Violations</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Repeated or severe violations may result in suspension or account
                termination.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
