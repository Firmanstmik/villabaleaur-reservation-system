import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Gem, LayoutDashboard, MapPin, Palmtree, Play, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

import EmptyState from "@/components/app/EmptyState";
import LoadingState from "@/components/app/LoadingState";
import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import VillaCard from "@/components/app/VillaCard";
import { Button } from "@/components/ui/button";
import { baleAurImages, baleAurProperty } from "@/data/baleAurContent";
import { fiturUtama } from "@/data/demoData";
import { useLanguage } from "@/contexts/LanguageContext";
import { villaApi } from "@/lib/api";
import type { Villa } from "@/types/app";
import heroIndexImage from "@/assets/hero-section-index.avif";

export default function HomePage() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useLanguage();
  const featureItems = translations.home.about.features.length > 0 ? translations.home.about.features : fiturUtama;

  useEffect(() => {
    villaApi
      .list()
      .then((response) => setVillas(response.villas.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroIndexImage} alt={baleAurProperty.name} className="h-full w-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="subtle-grid absolute inset-0 opacity-15" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F8F7F4] via-[#F8F7F4]/65 to-transparent" />
        <div className="app-shell relative flex min-h-screen flex-col justify-end pb-10 pt-32 md:pb-14 md:pt-40">
          <ScrollReveal className="max-w-3xl" distance={40}>
            <div className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.34em] text-[#E8C98B]">
              <span>{translations.home.heroTag}</span>
              <span className="h-px w-16 bg-[#E8C98B]/75" />
              <span className="text-sm leading-none">✦</span>
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-white md:text-6xl lg:text-7xl">
              {translations.home.heroTitleLine1}
              <br />
              {translations.home.heroTitleLine2} <span className="text-[#E8C98B]">{translations.home.heroTitleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white md:text-lg">
              {translations.home.heroDescription}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button asChild className="px-7 text-white hover:text-white">
                <Link to="/villas">
                  {translations.home.explore}
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Link
                to="/villas"
                className="inline-flex items-center gap-3 text-sm font-medium text-white transition-all duration-300 hover:text-[#F6E7C1]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/8 backdrop-blur-sm">
                  <Play size={16} className="ml-0.5" />
                </span>
                {translations.home.watchVideo}
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal
            className="mt-12 rounded-[2rem] border border-[rgba(217,179,106,0.16)] bg-[rgba(248,247,244,0.92)] p-3 shadow-[0_30px_80px_-30px_rgba(16,42,67,0.55)] backdrop-blur-xl"
            delay={0.1}
            distance={36}
          >
            <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr_1fr_0.8fr_auto]">
              {[
                { title: translations.home.search.location, value: translations.home.search.locationValue, icon: MapPin },
                { title: translations.home.search.checkIn, value: translations.home.search.dateValue, icon: CalendarDays },
                { title: translations.home.search.checkOut, value: translations.home.search.dateValue, icon: CalendarDays },
                { title: translations.home.search.guests, value: translations.home.search.guestsValue, icon: Users },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-[1.5rem] px-4 py-4 transition-all duration-300 hover:bg-white/70 lg:border-r lg:border-[rgba(217,179,106,0.12)] lg:last:border-r-0"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(246,231,193,0.7)] text-[#D9B36A]">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#102A43]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{item.value}</p>
                  </div>
                </div>
              ))}
              <Button asChild size="lg" className="h-full min-h-[72px] rounded-[1.4rem] px-8">
                <Link to="/villas">
                  {translations.home.search.button}
                  <Search size={18} />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="about" className="app-shell section-space">
        <PageHeader
          eyebrow={translations.home.about.eyebrow}
          title={translations.home.about.title}
          description={translations.home.about.description}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureItems.map((fitur) => (
            <ScrollReveal key={fitur} delay={0.05}>
              <article className="group relative overflow-hidden rounded-[2.2rem] border border-[rgba(214,194,159,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,247,244,0.92)_55%,rgba(243,239,232,0.94)_100%)] p-6 shadow-[0_26px_76px_-52px_rgba(16,42,67,0.28),0_10px_28px_-22px_rgba(111,84,38,0.16)] transition-all duration-500 before:pointer-events-none before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.92),transparent)] hover:-translate-y-1.5 hover:shadow-[0_44px_98px_-54px_rgba(16,42,67,0.34),0_16px_36px_-24px_rgba(111,84,38,0.22)] md:p-7">
                <div className="pointer-events-none absolute right-[-26px] top-[-26px] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(232,201,139,0.2),transparent_70%)] blur-2xl" />
                <div className="pointer-events-none absolute inset-x-6 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(16,42,67,0.03))]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(214,194,159,0.24)] bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#1F4E68] shadow-[0_18px_30px_-24px_rgba(16,42,67,0.18)]">
                    <span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#F6E7C1,#D9B36A)]" />
                    {translations.home.about.eyebrow}
                  </div>
                  <p className="mt-6 text-sm leading-8 text-[#6B7280] md:text-[15px]">{fitur}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="app-shell pb-16">
        <PageHeader
          eyebrow={translations.home.why.eyebrow}
          title={translations.home.why.title}
          description={translations.home.why.description}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { ...translations.home.why.items[0], icon: Gem },
            { ...translations.home.why.items[1], icon: LayoutDashboard },
            { ...translations.home.why.items[2], icon: Palmtree },
          ].map((item) => (
            <ScrollReveal key={item.title} delay={0.08}>
              <article className="group relative overflow-hidden rounded-[2.35rem] border border-[rgba(214,194,159,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,247,244,0.92)_55%,rgba(243,239,232,0.94)_100%)] p-7 shadow-[0_30px_86px_-58px_rgba(16,42,67,0.28),0_12px_32px_-24px_rgba(111,84,38,0.18)] transition-all duration-500 before:pointer-events-none before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)] hover:-translate-y-1.5 hover:shadow-[0_48px_110px_-60px_rgba(16,42,67,0.34),0_18px_38px_-26px_rgba(111,84,38,0.22)]">
                <div className="pointer-events-none absolute left-[-32px] top-[-40px] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(95,169,198,0.18),transparent_66%)] blur-2xl" />
                <div className="pointer-events-none absolute right-[-36px] bottom-[-44px] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(232,201,139,0.22),transparent_68%)] blur-2xl" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.7rem] border border-white/80 bg-[linear-gradient(135deg,rgba(246,231,193,0.9),rgba(232,201,139,0.36))] text-[#102A43] shadow-[0_18px_30px_-22px_rgba(16,42,67,0.22),inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <item.icon size={22} />
                    </div>
                    <div className="h-11 w-11 rounded-full border border-[rgba(214,194,159,0.22)] bg-white/65" />
                  </div>
                  <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#7B8794]">{translations.home.why.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#102A43]">{item.title}</h3>
                  <div className="mt-4 h-px w-16 bg-[linear-gradient(90deg,rgba(217,179,106,0.7),rgba(95,169,198,0.18))]" />
                  <p className="mt-5 text-sm leading-8 text-[#6B7280] md:text-[15px]">{item.text}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="app-shell pb-20">
        <PageHeader
          eyebrow={translations.home.featured.eyebrow}
          title={translations.home.featured.title}
          description={translations.home.featured.description}
          action={
            <Button asChild variant="outline">
              <Link to="/villas">{translations.home.featured.viewAll}</Link>
            </Button>
          }
        />
        {loading ? (
          <LoadingState label={translations.home.featured.loading} />
        ) : villas.length === 0 ? (
          <EmptyState
            title={translations.home.featured.emptyTitle}
            description={translations.home.featured.emptyDescription}
            action={
              <Button asChild>
                <Link to="/admin/villas">{translations.home.featured.manage}</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {villas.map((villa) => (
              <ScrollReveal key={villa.id} delay={0.08}>
                <VillaCard villa={villa} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
