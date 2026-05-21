import { useEffect, useState } from "react";
import { toast } from "sonner";

import EmptyState from "@/components/app/EmptyState";
import LoadingState from "@/components/app/LoadingState";
import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
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
import type { Booking, BookingStatus } from "@/types/app";
import { baleAurProperty, getBaleAurRoomType } from "@/data/baleAurContent";

const statusOptions: BookingStatus[] = ["menunggu", "disetujui", "ditolak", "selesai"];

export default function AdminBookingsPage() {
  const { translations } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function fetchBookings() {
    const response = await bookingApi.adminBookings();
    setBookings(response.bookings);
  }

  useEffect(() => {
    fetchBookings().finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: number, status_booking: BookingStatus) {
    setUpdatingId(id);
    try {
      await bookingApi.updateStatus(id, status_booking);
      toast.success(translations.adminBookings.success);
      fetchBookings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminBookings.error);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="app-shell section-space">
      <PageHeader
        eyebrow={translations.adminBookings.eyebrow}
        title={translations.adminBookings.title}
        description={translations.adminBookings.description}
      />

      <ScrollReveal>
        <Card className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-[rgba(248,247,244,0.86)] shadow-[0_38px_90px_-54px_rgba(16,42,67,0.32)] backdrop-blur-md">
          <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <LoadingState label={translations.adminBookings.loading} className="min-h-[280px]" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-6">
              <EmptyState title={translations.adminBookings.emptyTitle} description={translations.adminBookings.emptyDescription} />
            </div>
          ) : (
            <>
              <div className="grid gap-4 p-5 md:hidden">
                {bookings.map((booking) => (
                  <ScrollReveal key={booking.id} delay={0.05}>
                    <div className="rounded-[1.8rem] border border-[rgba(217,179,106,0.14)] bg-[rgba(248,247,244,0.78)] p-5 shadow-[0_26px_56px_-44px_rgba(16,42,67,0.26)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#102A43]">{booking.user_name}</p>
                          <p className="mt-1 text-sm text-[#6B7280]">{booking.user_email}</p>
                        </div>
                        <StatusBadge status={booking.status_booking} />
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-[#6B7280]">
                        <div>
                          <p className="text-[#6B7280]">{translations.adminBookings.mobile.villa}</p>
                          <p className="font-medium text-[#102A43]">{getBaleAurRoomType(booking.villa_id)?.shortName ?? booking.villa_nama}</p>
                          <p className="text-[#6B7280]">{getBaleAurRoomType(booking.villa_id)?.location ?? booking.villa_lokasi ?? baleAurProperty.locationShort}</p>
                        </div>
                        <div>
                          <p className="text-[#6B7280]">{translations.adminBookings.mobile.dates}</p>
                          <p className="font-medium text-[#102A43]">
                            {formatDate(booking.tanggal_checkin)} - {formatDate(booking.tanggal_checkout)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#6B7280]">{translations.adminBookings.mobile.guests}</p>
                          <p className="font-medium text-[#102A43]">{translations.adminBookings.guestsCount(booking.jumlah_tamu)}</p>
                        </div>
                        {booking.status_booking === "menunggu" ? (
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button
                              type="button"
                              disabled={updatingId === booking.id}
                              onClick={() => handleStatusChange(booking.id, "disetujui")}
                            >
                              {translations.adminBookings.actions.approve}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              disabled={updatingId === booking.id}
                              onClick={() => handleStatusChange(booking.id, "ditolak")}
                            >
                              {translations.adminBookings.actions.reject}
                            </Button>
                          </div>
                        ) : (
                          <select
                            aria-label={translations.adminBookings.changeStatusLabel(booking.id)}
                            title={translations.adminBookings.changeStatusLabel(booking.id)}
                            value={booking.status_booking}
                            onChange={(event) => handleStatusChange(booking.id, event.target.value as BookingStatus)}
                            className="h-11 w-full rounded-[1.35rem] border border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.94)] px-4 text-sm text-[#102A43] shadow-[0_18px_34px_-26px_rgba(16,42,67,0.38)] focus:outline-none focus:ring-4 focus:ring-[rgba(95,169,198,0.16)]"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {translations.app.status[status]}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{translations.adminBookings.table.user}</TableHead>
                      <TableHead>{translations.adminBookings.table.villa}</TableHead>
                      <TableHead>{translations.adminBookings.table.dates}</TableHead>
                      <TableHead>{translations.adminBookings.table.guests}</TableHead>
                      <TableHead>{translations.adminBookings.table.status}</TableHead>
                      <TableHead>{translations.adminBookings.table.changeStatus}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-[#102A43]">{booking.user_name}</p>
                            <p className="mt-1 text-sm text-[#6B7280]">{booking.user_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-[#102A43]">{getBaleAurRoomType(booking.villa_id)?.shortName ?? booking.villa_nama}</p>
                            <p className="mt-1 text-sm text-[#6B7280]">{getBaleAurRoomType(booking.villa_id)?.location ?? booking.villa_lokasi ?? baleAurProperty.locationShort}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(booking.tanggal_checkin)}
                          <br />
                          {formatDate(booking.tanggal_checkout)}
                        </TableCell>
                        <TableCell>{translations.adminBookings.guestsCount(booking.jumlah_tamu)}</TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status_booking} />
                        </TableCell>
                        <TableCell>
                          {booking.status_booking === "menunggu" ? (
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                disabled={updatingId === booking.id}
                                onClick={() => handleStatusChange(booking.id, "disetujui")}
                              >
                                {translations.adminBookings.actions.approve}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                disabled={updatingId === booking.id}
                                onClick={() => handleStatusChange(booking.id, "ditolak")}
                              >
                                {translations.adminBookings.actions.reject}
                              </Button>
                            </div>
                          ) : (
                            <select
                              aria-label={translations.adminBookings.changeStatusLabel(booking.id)}
                              title={translations.adminBookings.changeStatusLabel(booking.id)}
                              value={booking.status_booking}
                              onChange={(event) => handleStatusChange(booking.id, event.target.value as BookingStatus)}
                              className="h-11 rounded-[1.35rem] border border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.94)] px-4 text-sm text-[#102A43] shadow-[0_18px_34px_-26px_rgba(16,42,67,0.38)] focus:outline-none focus:ring-4 focus:ring-[rgba(95,169,198,0.16)]"
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {translations.app.status[status]}
                                </option>
                              ))}
                            </select>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
          </CardContent>
        </Card>
      </ScrollReveal>
    </main>
  );
}
