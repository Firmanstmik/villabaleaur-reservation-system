import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarClock, CheckCircle2, Clock3, Compass, Heart, Hotel, MapPin, Sparkles, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import LoadingState from "@/components/app/LoadingState";
import ScrollReveal from "@/components/app/ScrollReveal";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { baleAurImages, baleAurProperty, getBaleAurRoomType } from "@/data/baleAurContent";
import { bookingApi, getUploadUrl } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { UserDashboardSummary } from "@/types/app";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import heroIndexImage from "@/assets/hero-section-index.avif";

const emptySummary: UserDashboardSummary = {
  totalBooking: 0,
  bookingAktif: 0,
  bookingSelesai: 0,
  bookingTerbaru: [],
};

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { translations } = useLanguage();
  const [summary, setSummary] = useState<UserDashboardSummary>(emptySummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi
      .userDashboard()
      .then((response) => setSummary(response.summary))
      .finally(() => setLoading(false));
  }, []);

  const pendingBookings = useMemo(
    () => summary.bookingTerbaru.filter((booking) => booking.status_booking === "menunggu").length,
    [summary.bookingTerbaru],
  );

  const favoriteVilla =
    (summary.bookingTerbaru[0] ? getBaleAurRoomType(summary.bookingTerbaru[0].villa_id)?.shortName : undefined) ??
    summary.bookingTerbaru[0]?.villa_nama ??
    translations.userDashboard.favoriteFallback;

  const statCards = [
    {
      title: translations.userDashboard.stats.activeTitle,
      value: summary.bookingAktif,
      subtitle: translations.userDashboard.stats.activeSubtitle,
      icon: Clock3,
      accent: "bg-[linear-gradient(135deg,rgba(232,201,139,0.34),rgba(217,179,106,0.18))] text-[#7A5D21]",
    },
    {
      title: translations.userDashboard.stats.completedTitle,
      value: summary.bookingSelesai,
      subtitle: translations.userDashboard.stats.completedSubtitle,
      icon: CheckCircle2,
      accent: "bg-[linear-gradient(135deg,rgba(169,215,232,0.28),rgba(95,169,198,0.12))] text-[#1F4E68]",
    },
    {
      title: translations.userDashboard.stats.pendingTitle,
      value: pendingBookings,
      subtitle: translations.userDashboard.stats.pendingSubtitle,
      icon: CalendarClock,
      accent: "bg-[linear-gradient(135deg,rgba(246,231,193,0.72),rgba(232,201,139,0.18))] text-[#8B6A25]",
    },
    {
      title: translations.userDashboard.stats.favoriteTitle,
      value: favoriteVilla,
      subtitle: translations.userDashboard.stats.favoriteSubtitle,
      icon: Heart,
      accent: "bg-[linear-gradient(135deg,rgba(248,247,244,0.96),rgba(255,255,255,0.72))] text-[#102A43]",
    },
  ];

  return (
    <main className="pb-20 md:pb-24">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] mb-10 min-h-[700px] w-screen overflow-hidden bg-[#102A43] md:min-h-[760px]">
        <div className="absolute inset-0">
          <img src={heroIndexImage} alt={translations.app.brandName} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(16,42,67,0.92)_0%,rgba(16,42,67,0.68)_40%,rgba(31,78,104,0.34)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,201,139,0.22),transparent_34%)]" />
        </div>

        <div className="app-shell relative py-28 md:py-32 lg:py-36">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.25fr)_360px]">
            <ScrollReveal className="max-w-3xl" distance={40}>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F6E7C1] backdrop-blur-md">
                <Sparkles size={14} />
                {translations.userDashboard.heroTag}
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-[0.98] text-white md:text-5xl xl:text-7xl">
                {translations.userDashboard.heroGreeting}
                <br />
                {user?.name ?? translations.userDashboard.guestFallback}
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-white/80 md:text-lg">
                {translations.userDashboard.heroDescription}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="text-white hover:text-white">
                  <Link to="/villas">
                    {translations.userDashboard.explore}
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/18 bg-white/8 text-white hover:bg-white/14 hover:text-white">
                  <Link to="/bookings">{translations.userDashboard.history}</Link>
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-[2rem] border border-white/12 bg-white/10 p-6 shadow-[0_32px_80px_-46px_rgba(5,18,31,0.9)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-[#F6E7C1]">{translations.userDashboard.profileEyebrow}</p>
                <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-5">
                  <p className="text-sm text-white/65">{translations.userDashboard.guestName}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{user?.name ?? translations.userDashboard.guestFallback}</p>
                  <p className="mt-4 text-sm text-white/70">{user?.phone ?? user?.email}</p>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.06)] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/55">{translations.userDashboard.totalBooking}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{summary.totalBooking}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.06)] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/55">{translations.userDashboard.pending}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{pendingBookings}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-10 text-[#F8F7F4]">
          <svg viewBox="0 0 1440 160" className="h-[92px] w-full md:h-[118px]" preserveAspectRatio="none" aria-hidden="true">
            <path
              fill="currentColor"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,53.3C672,53,768,75,864,96C960,117,1056,139,1152,138.7C1248,139,1344,117,1392,106.7L1440,96L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
            />
          </svg>
        </div>
      </section>

      <div className="app-shell">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item, index) => (
            <ScrollReveal key={item.title} delay={0.05 + index * 0.03}>
              <article className="group relative overflow-hidden rounded-[2rem] border border-[rgba(214,194,159,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,247,244,0.92)_54%,rgba(244,240,233,0.94)_100%)] p-6 shadow-[0_24px_64px_-42px_rgba(16,42,67,0.28),0_8px_24px_-20px_rgba(111,84,38,0.18)] transition-all duration-500 before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.96),transparent)] hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_36px_86px_-46px_rgba(16,42,67,0.34),0_12px_30px_-22px_rgba(111,84,38,0.22)] md:p-7">
                <div className="pointer-events-none absolute right-[-32px] top-[-34px] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(232,201,139,0.2),transparent_68%)] blur-xl" />
                <div className="pointer-events-none absolute left-6 top-0 h-1 w-16 rounded-full bg-[linear-gradient(90deg,rgba(232,201,139,0.96),rgba(95,169,198,0.32))]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.6rem] border border-white/80 shadow-[0_18px_30px_-20px_rgba(16,42,67,0.18),inset_0_1px_0_rgba(255,255,255,0.72)] ${item.accent}`}>
                    <item.icon size={24} />
                  </div>
                  <div className="h-11 w-11 rounded-full border border-[rgba(214,194,159,0.22)] bg-white/65" />
                </div>
                <div className="relative mt-9">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#7B8794]">{item.title}</p>
                  <div className="mt-3 h-px w-14 bg-[linear-gradient(90deg,rgba(217,179,106,0.7),rgba(95,169,198,0.18))]" />
                  <p
                    className={
                      item.title === translations.userDashboard.stats.favoriteTitle
                        ? "mt-5 text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#102A43]"
                        : "mt-5 text-[2.5rem] font-semibold leading-none tracking-[-0.05em] text-[#102A43]"
                    }
                  >
                    {item.value}
                  </p>
                  <p className="mt-5 max-w-[26ch] text-sm leading-7 text-[#6B7280]">{item.subtitle}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </section>

        <section className="mt-14 grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_360px]">
          <div>
            <ScrollReveal className="mb-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#5FA9C6]">{translations.userDashboard.latestEyebrow}</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#102A43] md:text-4xl">{translations.userDashboard.latestTitle}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6B7280]">
                    {translations.userDashboard.latestDescription}
                  </p>
                </div>
                <Button asChild variant="ghost" className="rounded-full border border-[rgba(214,194,159,0.18)] bg-white/72 px-5 text-[#1F4E68] shadow-[0_18px_30px_-26px_rgba(16,42,67,0.2)] hover:bg-white hover:text-[#102A43]">
                  <Link to="/bookings">{translations.userDashboard.latestAction}</Link>
                </Button>
              </div>
            </ScrollReveal>

            {loading ? (
              <LoadingState label={translations.userDashboard.loading} />
            ) : summary.bookingTerbaru.length === 0 ? (
              <div className="relative overflow-hidden rounded-[2.35rem] border border-[rgba(214,194,159,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(248,247,244,0.92)_55%,rgba(243,239,232,0.92)_100%)] px-6 py-14 text-center shadow-[0_30px_90px_-52px_rgba(16,42,67,0.28)] md:px-10 md:py-20">
                <div className="pointer-events-none absolute left-1/2 top-[-120px] h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,201,139,0.22),transparent_65%)] blur-2xl" />
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.92),transparent)]" />
                <div className="relative mx-auto max-w-xl">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(214,194,159,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,231,193,0.46))] shadow-[0_22px_38px_-28px_rgba(16,42,67,0.24)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(232,201,139,0.92),rgba(217,179,106,0.72))] text-[#102A43] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                      <Hotel size={24} />
                    </div>
                  </div>
                  <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#5FA9C6]">{translations.userDashboard.latestEyebrow}</p>
                  <h3 className="mt-4 text-3xl font-semibold leading-tight text-[#102A43] md:text-[2.5rem]">{translations.userDashboard.emptyTitle}</h3>
                  <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-[#6B7280] md:text-[15px]">{translations.userDashboard.emptyDescription}</p>
                  <div className="mt-9">
                    <Button asChild className="h-12 px-7">
                      <Link to="/villas">
                        {translations.userDashboard.explore}
                        <ArrowRight size={18} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5">
                {summary.bookingTerbaru.map((booking, index) => {
                  const roomType = getBaleAurRoomType(booking.villa_id);

                  return (
                  <ScrollReveal key={booking.id} delay={0.05 + index * 0.03}>
                    <article className="group relative overflow-hidden rounded-[2.2rem] border border-[rgba(214,194,159,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,247,244,0.92)_56%,rgba(243,239,232,0.94)_100%)] p-5 shadow-[0_26px_76px_-48px_rgba(16,42,67,0.28)] transition-all duration-500 before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)] hover:-translate-y-1 hover:shadow-[0_38px_92px_-48px_rgba(16,42,67,0.34)] md:p-6">
                      <div className="pointer-events-none absolute right-[-18px] top-[-18px] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(95,169,198,0.16),transparent_68%)] blur-xl" />
                      <div className="grid gap-5 md:grid-cols-[210px_minmax(0,1fr)_auto] md:items-center">
                        <div className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/60 p-1 shadow-[0_20px_34px_-26px_rgba(16,42,67,0.22)]">
                          <img
                            src={getUploadUrl(roomType?.image ?? (booking.villa_gambar || ""))}
                            alt={roomType?.shortName ?? booking.villa_nama}
                            className="h-44 w-full rounded-[1.45rem] object-cover transition-transform duration-700 group-hover:scale-[1.04] md:h-40"
                          />
                          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-full bg-[rgba(16,42,67,0.48)] px-4 py-2 text-left text-xs font-medium tracking-[0.18em] text-white/90 backdrop-blur-md">
                            {roomType?.location ?? booking.villa_lokasi ?? baleAurProperty.locationShort}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8794]">{translations.userDashboard.latestEyebrow}</p>
                              <h3 className="mt-3 text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#102A43]">{roomType?.shortName ?? booking.villa_nama}</h3>
                            </div>
                            <StatusBadge status={booking.status_booking} />
                          </div>
                          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(214,194,159,0.18)] bg-white/72 px-3.5 py-2 shadow-[0_14px_28px_-26px_rgba(16,42,67,0.2)]">
                              <MapPin size={15} />
                              {roomType?.location ?? booking.villa_lokasi ?? baleAurProperty.locationShort}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-[rgba(214,194,159,0.18)] bg-[rgba(246,231,193,0.32)] px-3.5 py-2 shadow-[0_14px_28px_-26px_rgba(16,42,67,0.18)]">
                              {formatDate(booking.tanggal_checkin)} - {formatDate(booking.tanggal_checkout)}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-[rgba(130,182,205,0.16)] bg-[rgba(169,215,232,0.16)] px-3.5 py-2 shadow-[0_14px_28px_-26px_rgba(16,42,67,0.18)]">
                              {translations.userBookings.guestsCount(booking.jumlah_tamu)}
                            </span>
                          </div>
                          <p className="mt-5 text-sm leading-7 text-[#6B7280]">
                            {translations.userDashboard.bookingNote}
                          </p>
                        </div>

                        <div className="flex items-center justify-start md:justify-end">
                          <div className="rounded-[1.75rem] border border-[rgba(214,194,159,0.2)] bg-white/72 p-3 shadow-[0_22px_36px_-28px_rgba(16,42,67,0.22)]">
                            <Button asChild variant="outline" className="min-w-[168px]">
                              <Link to="/bookings">
                                {translations.userDashboard.detailStatus}
                                <ArrowUpRight size={16} />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <ScrollReveal>
              <Card className="overflow-hidden border-[rgba(214,194,159,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,247,244,0.92)_56%,rgba(243,239,232,0.94)_100%)] shadow-[0_30px_82px_-50px_rgba(16,42,67,0.28)]">
                <CardContent className="relative p-6 md:p-7">
                  <div className="pointer-events-none absolute right-[-32px] top-[-34px] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(232,201,139,0.2),transparent_68%)] blur-xl" />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.userDashboard.quickEyebrow}</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#102A43]">{translations.userDashboard.quickTitle}</h2>
                  <div className="mt-6 space-y-4">
                    {[
                      {
                        title: translations.userDashboard.quickItems[0].title,
                        description: translations.userDashboard.quickItems[0].description,
                        icon: Compass,
                        href: "/villas",
                      },
                      {
                        title: translations.userDashboard.quickItems[1].title,
                        description: translations.userDashboard.quickItems[1].description,
                        icon: Hotel,
                        href: "/bookings",
                      },
                      {
                        title: translations.userDashboard.quickItems[2].title,
                        description: translations.userDashboard.quickItems[2].description,
                        icon: UserCircle2,
                        href: "/profile",
                      },
                    ].map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="group relative flex items-start gap-4 overflow-hidden rounded-[1.75rem] border border-[rgba(214,194,159,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,247,244,0.82))] p-4 shadow-[0_18px_32px_-26px_rgba(16,42,67,0.22)] transition-all duration-500 before:pointer-events-none before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-full before:bg-[linear-gradient(180deg,rgba(232,201,139,0.94),rgba(95,169,198,0.36))] before:opacity-0 before:transition-opacity before:duration-500 hover:-translate-y-1 hover:border-[rgba(214,194,159,0.3)] hover:shadow-[0_30px_54px_-30px_rgba(16,42,67,0.28)] hover:before:opacity-100"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.45rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(246,231,193,0.58))] text-[#102A43] shadow-[0_18px_28px_-22px_rgba(16,42,67,0.18)] transition-transform duration-500 group-hover:scale-105">
                          <item.icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold text-[#102A43]">{item.title}</p>
                            <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-[#7B8794] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#102A43]" />
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#6B7280]">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <Card className="overflow-hidden border-white/80 bg-[linear-gradient(160deg,rgba(31,78,104,0.98),rgba(16,42,67,0.96))] text-white">
                <CardContent className="p-6 md:p-7">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#F6E7C1]">{translations.userDashboard.preferredEyebrow}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{translations.userDashboard.preferredTitle}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    {summary.bookingTerbaru.length > 0
                      ? translations.userDashboard.preferredDescriptionWithVilla(favoriteVilla)
                      : translations.userDashboard.preferredDescriptionEmpty}
                  </p>
                  <Button asChild className="mt-6 text-white hover:text-white">
                    <Link to="/villas">
                      {translations.userDashboard.preferredAction}
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </main>
  );
}
