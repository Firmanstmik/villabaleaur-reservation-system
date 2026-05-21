import { useEffect, useState } from "react";

import EmptyState from "@/components/app/EmptyState";
import LoadingState from "@/components/app/LoadingState";
import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import StatusBadge from "@/components/app/StatusBadge";
import BookingPassModal from "@/components/app/BookingPassModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bookingApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Booking } from "@/types/app";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { baleAurProperty, getBaleAurRoomType } from "@/data/baleAurContent";
import { useAuth } from "@/contexts/AuthContext";

export default function UserBookingsPage() {
  const { user } = useAuth();
  const { translations } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [passBooking, setPassBooking] = useState<Booking | null>(null);
  const [passOpen, setPassOpen] = useState(false);

  const pendingCount = bookings.filter((booking) => booking.status_booking === "menunggu").length;
  const approvedCount = bookings.filter((booking) => booking.status_booking === "disetujui").length;
  const rejectedCount = bookings.filter((booking) => booking.status_booking === "ditolak").length;

  useEffect(() => {
    bookingApi
      .myBookings()
      .then((response) => setBookings(response.bookings))
      .finally(() => setLoading(false));
  }, []);

  const passVillaId = typeof passBooking?.villa_id === "number" ? passBooking.villa_id : null;
  const passRoomType = passVillaId ? getBaleAurRoomType(passVillaId) : undefined;
  const passRoomName = passRoomType?.shortName ?? passBooking?.villa_nama ?? "-";
  const passLocation = passRoomType?.location ?? passBooking?.villa_lokasi ?? baleAurProperty.locationShort;

  return (
    <main className="app-shell section-space">
      {passBooking ? (
        <BookingPassModal
          open={passOpen}
          onClose={() => setPassOpen(false)}
          booking={passBooking}
          roomName={passRoomName}
          location={passLocation}
          guestName={user?.name ?? ""}
          guestContact={user?.phone ?? user?.email ?? ""}
        />
      ) : null}
      <PageHeader
        eyebrow={translations.userBookings.eyebrow}
        title={translations.userBookings.title}
        description={translations.userBookings.description}
      />

      {!loading && bookings.length > 0 ? (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { title: translations.userBookings.summary.pending, value: pendingCount, accent: "bg-[rgba(246,231,193,0.6)] text-[#8B6A25]" },
            { title: translations.userBookings.summary.approved, value: approvedCount, accent: "bg-[rgba(169,215,232,0.22)] text-[#1F4E68]" },
            { title: translations.userBookings.summary.rejected, value: rejectedCount, accent: "bg-[rgba(255,235,235,0.9)] text-[#B54747]" },
          ].map((item) => (
            <ScrollReveal key={item.title} delay={0.05}>
              <div className="soft-panel p-5">
                <div className={`mb-4 inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${item.accent}`}>
                  {item.title}
                </div>
                <p className="text-3xl font-semibold text-[#102A43]">{item.value}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : null}

      {loading ? (
        <LoadingState label={translations.userBookings.loading} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title={translations.userBookings.emptyTitle}
          description={translations.userBookings.emptyDescription}
          action={
            <Button asChild>
              <Link to="/villas">{translations.userBookings.explore}</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {bookings.map((booking) => (
              <ScrollReveal key={booking.id} delay={0.05}>
                <Card>
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#102A43]">{getBaleAurRoomType(booking.villa_id)?.shortName ?? booking.villa_nama}</p>
                        <p className="mt-1 text-sm text-[#6B7280]">{getBaleAurRoomType(booking.villa_id)?.location ?? booking.villa_lokasi ?? baleAurProperty.locationShort}</p>
                      </div>
                      <StatusBadge status={booking.status_booking} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">{translations.userBookings.mobile.checkin}</p>
                        <p className="mt-1 font-medium text-slate-700">{formatDate(booking.tanggal_checkin)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{translations.userBookings.mobile.checkout}</p>
                        <p className="mt-1 font-medium text-slate-700">{formatDate(booking.tanggal_checkout)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{translations.userBookings.mobile.guests}</p>
                        <p className="mt-1 font-medium text-slate-700">{translations.userBookings.guestsCount(booking.jumlah_tamu)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full"
                      onClick={() => {
                        setPassBooking(booking);
                        setPassOpen(true);
                      }}
                    >
                      {translations.userBookings.actions.pass}
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <Card className="hidden md:block">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{translations.userBookings.table.villa}</TableHead>
                      <TableHead>{translations.userBookings.table.checkin}</TableHead>
                      <TableHead>{translations.userBookings.table.checkout}</TableHead>
                      <TableHead>{translations.userBookings.table.guests}</TableHead>
                      <TableHead>{translations.userBookings.table.status}</TableHead>
                      <TableHead className="text-right">{translations.userBookings.table.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-[#102A43]">{getBaleAurRoomType(booking.villa_id)?.shortName ?? booking.villa_nama}</p>
                            <p className="mt-1 text-sm text-[#6B7280]">{getBaleAurRoomType(booking.villa_id)?.location ?? booking.villa_lokasi ?? baleAurProperty.locationShort}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(booking.tanggal_checkin)}</TableCell>
                        <TableCell>{formatDate(booking.tanggal_checkout)}</TableCell>
                        <TableCell>{translations.userBookings.guestsCount(booking.jumlah_tamu)}</TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status_booking} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPassBooking(booking);
                              setPassOpen(true);
                            }}
                          >
                            {translations.userBookings.actions.pass}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </ScrollReveal>
        </>
      )}
    </main>
  );
}
