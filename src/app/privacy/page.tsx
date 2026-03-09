import Image from "next/image";

const infoCards = [
  {
    title: "What we collect",
    items: [
      "Account identifiers like email and display name",
      "Watch activity such as episode progress and preferences",
      "Device and app details for performance and debugging",
    ],
  },
  {
    title: "How we use it",
    items: [
      "Personalize recommendations and resume playback",
      "Maintain security and prevent abuse",
      "Improve app performance and fix issues",
    ],
  },
  {
    title: "What we do not do",
    items: [
      "Sell personal data to third parties",
      "Share watch history for advertising profiles",
      "Collect sensitive categories without consent",
    ],
  },
];

const policySections = [
  {
    title: "Information we collect",
    body:
      "We collect information you provide when you create an account and use the app. This includes account details, watch progress, and preferences. We also collect limited technical data like device type, app version, and basic diagnostics to keep the service reliable.",
  },
  {
    title: "Cookies and tracking",
    body:
      "We use essential cookies and local storage to keep you signed in, remember settings, and resume playback. Analytics cookies may be used to understand feature usage and improve the experience. You can adjust cookie settings in your browser at any time.",
  },
  {
    title: "Sharing and disclosure",
    body:
      "We share information only with service providers that help us operate the app, and only for the purposes described in this policy. We may disclose information if required by law or to protect the rights and safety of the community.",
  },
  {
    title: "Data retention",
    body:
      "We retain account data while your account is active. If you delete your account, we remove or anonymize personal data within a reasonable timeframe, unless we are required to keep it for legal reasons.",
  },
  {
    title: "Your choices",
    body:
      "You can access, update, or delete your account information in your settings. You can also request a copy of your data or ask us to delete it by contacting us.",
  },
  {
    title: "Security",
    body:
      "We use industry standard safeguards to protect your data, including encryption in transit and access controls. No system is perfectly secure, but we continuously improve our protections.",
  },
  {
    title: "Children's privacy",
    body:
      "Anime Stream is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided data, please contact us so we can remove it.",
  },
  {
    title: "Policy changes",
    body:
      "We may update this policy to reflect new features or legal requirements. We will post updates on this page and update the effective date below.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative">
        <div className="relative h-[32vh] md:h-[40vh] overflow-hidden">
          <Image
            src="/images/bg-2.webp"
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
                  Trust and Safety
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white">
                Privacy Policy
              </h1>
              <p className="text-gray-400 mt-3 max-w-2xl">
                Your privacy matters. This policy explains what we collect, how we use it,
                and the choices you have when using Anime Stream.
              </p>
              <p className="text-xs text-gray-500 mt-4">Effective: March 9, 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {infoCards.map((card) => (
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
            {policySections.map((section) => (
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
              <h3 className="text-lg font-semibold">Contact us</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Questions about privacy or data requests? Reach us anytime.
              </p>
              <a
                href="mailto:privacy@anime-stream.app"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-400"
              >
                privacy@anime-stream.app
              </a>
            </div>

            <div className="rounded-2xl border border-border/60 bg-foreground/5 p-6">
              <h3 className="text-lg font-semibold">Quick highlights</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>Control your account data in settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>Request export or deletion anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>We only share data with trusted providers</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/60 bg-red-500/10 p-6">
              <h3 className="text-lg font-semibold text-red-500">Need to delete your data?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Email us with your account email and request. We will verify ownership
                and complete the request promptly.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
