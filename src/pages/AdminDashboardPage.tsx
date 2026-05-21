import { useEffect, useState } from "react";
import { Activity, Building2, CalendarRange, Clock3, GalleryHorizontalEnd, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

import LoadingState from "@/components/app/LoadingState";
import ScrollReveal from "@/components/app/ScrollReveal";
import StatCard from "@/components/app/StatCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { adminApi, bookingApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { AdminDashboardSummary } from "@/types/app";
import type { Booking } from "@/types/app";
import type { AdminGuest } from "@/types/app";

const initialSummary: AdminDashboardSummary = {
  totalVilla: 0,
  totalBooking: 0,
  bookingMenunggu: 0,
  userTerdaftar: 0,
};

export default function AdminDashboardPage() {
  const { translations } = useLanguage();
  const [summary, setSummary] = useState<AdminDashboardSummary>(initialSummary);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<AdminGuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([bookingApi.adminSummary(), bookingApi.adminBookings(), adminApi.guests()])
      .then(([summaryResponse, bookingsResponse, guestsResponse]) => {
        setSummary(summaryResponse.summary);
        setBookings(bookingsResponse.bookings);
        setGuests(guestsResponse.guests);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingRatio = summary.totalBooking > 0 ? Math.round((summary.bookingMenunggu / summary.totalBooking) * 100) : 0;

  const activityItems = (() => {
    const recentBookings = bookings.slice(0, 6).map((booking) => ({
      key: `booking-${booking.id}`,
      createdAt: booking.created_at,
      href: "/admin/bookings",
      title: translations.adminDashboard.activityBookingTitle(booking.user_name || translations.adminDashboard.activityGuestFallback),
      description: translations.adminDashboard.activityBookingDescription(
        translations.app.status[booking.status_booking],
        booking.villa_nama || "",
        booking.tanggal_checkin,
        booking.tanggal_checkout,
      ),
      icon: CalendarRange,
      tone: booking.status_booking === "ditolak" ? "red" : booking.status_booking === "menunggu" ? "gold" : "blue",
    }));

    const recentGuests = guests.slice(0, 4).map((guest) => ({
      key: `guest-${guest.id}`,
      createdAt: guest.created_at,
      href: "/admin/guests",
      title: translations.adminDashboard.activityGuestTitle(guest.name),
      description: translations.adminDashboard.activityGuestDescription(guest.totalBooking),
      icon: Users,
      tone: "blue" as const,
    }));

    const merged = [...recentBookings, ...recentGuests]
      .filter((item) => item.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);

    return merged;
  })();

  return (
    <main className="app-shell section-space">
      <ScrollReveal>
        <section className="relative overflow-hidden rounded-[2.6rem] border border-white/12 bg-[linear-gradient(135deg,rgba(16,42,67,0.92)_0%,rgba(31,78,104,0.84)_52%,rgba(16,42,67,0.88)_100%)] px-7 py-10 text-white shadow-[0_52px_120px_-64px_rgba(5,18,31,0.9)] backdrop-blur-2xl md:px-10 md:py-12">
          <div className="pointer-events-none absolute inset-0 opacity-90">
            <div className="absolute inset-0 subtle-grid opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,201,139,0.28),transparent_52%),radial-gradient(circle_at_bottom_right,rgba(169,215,232,0.18),transparent_48%)]" />
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8C98B]">{translations.adminDashboard.eyebrow}</p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">{translations.adminDashboard.title}</h1>
              <p className="mt-4 text-sm leading-7 text-white/75 md:text-base">{translations.adminDashboard.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/admin/villas">
                  <Sparkles />
                  {translations.adminDashboard.manageVillas}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/admin/bookings">
                  <Activity />
                  {translations.adminDashboard.manageReservations}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {loading ? (
        <LoadingState label={translations.adminDashboard.loading} />
      ) : (
        <div className="mt-10 space-y-10">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: translations.adminDashboard.stats.totalVillas,
                value: summary.totalVilla,
                icon: Building2,
                accent: "bg-[rgba(232,201,139,0.28)] text-[#102A43]",
                trend: { label: translations.adminDashboard.trendLabelInventory, tone: "gold" as const },
              },
              {
                title: translations.adminDashboard.stats.totalReservations,
                value: summary.totalBooking,
                icon: CalendarRange,
                accent: "bg-[rgba(169,215,232,0.2)] text-[#1F4E68]",
                trend: { label: translations.adminDashboard.trendLabelOperations, tone: "blue" as const },
              },
              {
                title: translations.adminDashboard.stats.pendingApproval,
                value: summary.bookingMenunggu,
                icon: Clock3,
                accent: "bg-[rgba(246,231,193,0.72)] text-[#7A5D21]",
                trend: { value: `${pendingRatio}%`, label: translations.adminDashboard.trendLabelPending, tone: "gold" as const },
              },
              {
                title: translations.adminDashboard.stats.registeredGuests,
                value: summary.userTerdaftar,
                icon: Users,
                accent: "bg-[rgba(169,215,232,0.16)] text-[#1F4E68]",
                trend: { label: translations.adminDashboard.trendLabelDirectory, tone: "neutral" as const },
              },
            ].map((item) => (
              <ScrollReveal key={item.title} delay={0.06}>
                <StatCard title={item.title} value={item.value} icon={item.icon} accent={item.accent} trend={item.trend} />
              </ScrollReveal>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
            <ScrollReveal>
              <section className="rounded-[2.25rem] border border-white/70 bg-[rgba(248,247,244,0.88)] p-7 shadow-[0_34px_88px_-56px_rgba(16,42,67,0.28)] backdrop-blur-md md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.adminDashboard.quickActions.title}</p>
                    <h2 className="mt-3 text-2xl font-semibold text-[#102A43]">{translations.adminDashboard.quickActions.title}</h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: translations.adminDashboard.quickActions.addRoom,
                      href: "/admin/villas",
                      icon: Building2,
                      accent: "bg-[rgba(246,231,193,0.72)] text-[#7A5D21]",
                    },
                    {
                      label: translations.adminDashboard.quickActions.viewBookings,
                      href: "/admin/bookings",
                      icon: CalendarRange,
                      accent: "bg-[rgba(169,215,232,0.2)] text-[#1F4E68]",
                    },
                    {
                      label: translations.adminDashboard.quickActions.manageGuests,
                      href: "/admin/guests",
                      icon: Users,
                      accent: "bg-[rgba(169,215,232,0.16)] text-[#1F4E68]",
                    },
                    {
                      label: translations.adminDashboard.quickActions.updateGallery,
                      href: "/admin/villas",
                      icon: GalleryHorizontalEnd,
                      accent: "bg-[rgba(232,201,139,0.24)] text-[#102A43]",
                    },
                  ].map((action) => (
                    <Link
                      key={action.href + action.label}
                      to={action.href}
                      className="group/action relative overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/55 p-5 shadow-[0_26px_56px_-44px_rgba(16,42,67,0.22)] transition-all duration-500 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_38px_88px_-52px_rgba(16,42,67,0.26)]"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/action:opacity-100">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,201,139,0.18),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(169,215,232,0.16),transparent_46%)]" />
                      </div>
                      <div className="relative flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-[1.45rem] ${action.accent}`}>
                          <action.icon size={20} />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#102A43]">{action.label}</p>
                          <p className="mt-1 text-sm text-[#6B7280]">{translations.adminDashboard.quickActionHint(action.href)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <section className="rounded-[2.25rem] border border-white/70 bg-[rgba(248,247,244,0.88)] p-7 shadow-[0_34px_88px_-56px_rgba(16,42,67,0.28)] backdrop-blur-md md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.adminDashboard.activity.title}</p>
                    <h2 className="mt-3 text-2xl font-semibold text-[#102A43]">{translations.adminDashboard.activity.title}</h2>
                  </div>
                </div>

                {activityItems.length === 0 ? (
                  <div className="mt-6 rounded-[1.8rem] border border-dashed border-[rgba(217,179,106,0.18)] bg-white/50 px-6 py-10 text-center text-sm text-[#6B7280]">
                    {translations.adminDashboard.activity.empty}
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {activityItems.map((item) => (
                      <Link
                        key={item.key}
                        to={item.href}
                        className="group/item flex items-start gap-4 rounded-[1.7rem] border border-white/60 bg-white/55 px-5 py-4 shadow-[0_22px_52px_-44px_rgba(16,42,67,0.2)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_34px_80px_-52px_rgba(16,42,67,0.24)]"
                      >
                        <div
                          className={
                            item.tone === "red"
                              ? "mt-0.5 flex h-11 w-11 items-center justify-center rounded-[1.45rem] bg-[rgba(255,235,235,0.92)] text-[#B54747]"
                              : item.tone === "gold"
                                ? "mt-0.5 flex h-11 w-11 items-center justify-center rounded-[1.45rem] bg-[rgba(246,231,193,0.78)] text-[#7A5D21]"
                                : "mt-0.5 flex h-11 w-11 items-center justify-center rounded-[1.45rem] bg-[rgba(169,215,232,0.2)] text-[#1F4E68]"
                          }
                        >
                          <item.icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#102A43]">{item.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-[#6B7280]">{item.description}</p>
                        </div>
                        <div className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
                          {formatDate(item.createdAt)}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </ScrollReveal>
          </div>
        </div>
      )}
    </main>
  );
}
