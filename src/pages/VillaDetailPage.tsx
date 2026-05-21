import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BedDouble, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, MapPin, Minus, Plus, Ruler, ShieldCheck, Sparkles, Users, Waves } from "lucide-react";

import EmptyState from "@/components/app/EmptyState";
import LoadingState from "@/components/app/LoadingState";
import BookingPassModal from "@/components/app/BookingPassModal";
import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import StatusBadge from "@/components/app/StatusBadge";
import VillaCard from "@/components/app/VillaCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { baleAurProperty, getBaleAurRoomType } from "@/data/baleAurContent";
import { ApiError, villaApi, bookingApi, getUploadUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BookingStatus, Villa } from "@/types/app";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const initialForm = {
  tanggal_checkin: "",
  tanggal_checkout: "",
  jumlah_tamu: 2,
};

function getStayDuration(checkin: string, checkout: string) {
  if (!checkin || !checkout) {
    return 0;
  }

  const start = new Date(checkin);
  const end = new Date(checkout);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff <= 0) {
    return 0;
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function addDaysISO(dateISO: string, days: number) {
  if (!dateISO) {
    return "";
  }

  const base = new Date(dateISO);
  if (Number.isNaN(base.getTime())) {
    return "";
  }

  base.setDate(base.getDate() + days);
  return base.toISOString().split("T")[0];
}

export default function VillaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translations, language } = useLanguage();
  const [villa, setVilla] = useState<Villa | null>(null);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [form, setForm] = useState(initialForm);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ checkin?: string; checkout?: string; guests?: string }>({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState<null | {
    id: number;
    status_booking: BookingStatus;
    tanggal_checkin: string;
    tanggal_checkout: string;
    jumlah_tamu: number;
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    Promise.all([villaApi.detail(id), villaApi.list()])
      .then(([detailResponse, listResponse]) => {
        setVilla(detailResponse.villa);
        setVillas(listResponse.villas);
        setActiveImageIndex(0);
        setThumbPage(0);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const similarVillas = useMemo(() => {
    return villas.filter((item) => item.id !== villa?.id).slice(0, 3);
  }, [villa?.id, villas]);

  const roomType = useMemo(() => {
    return villa ? getBaleAurRoomType(villa.id) : undefined;
  }, [villa]);

  const displayedNightlyRate = roomType?.price ?? villa?.harga ?? 0;
  const maxGuestFromRoomType = Number((roomType?.capacity?.en ?? roomType?.capacity?.id ?? "").replace(/[^0-9]/g, ""));
  const maxGuest = villa?.max_guest ?? (maxGuestFromRoomType || 2);
  const minCheckoutDate = form.tanggal_checkin ? addDaysISO(form.tanggal_checkin, 1) : getTodayISO();

  const galleryImages = useMemo(() => {
    if (!villa) {
      return [];
    }

    const gallery = Array.isArray(villa.galeri) ? villa.galeri : [];
    const fallback = roomType?.image ?? villa.gambar;
    const resolved = gallery.length > 0 ? gallery : fallback ? [fallback] : [];

    return resolved.filter((item) => typeof item === "string" && item.length > 0);
  }, [roomType?.image, villa]);

  const thumbsPerPage = 6;
  const totalThumbPages = Math.max(1, Math.ceil(galleryImages.length / thumbsPerPage));
  const visibleThumbs = useMemo(() => {
    const start = thumbPage * thumbsPerPage;
    return galleryImages.slice(start, start + thumbsPerPage);
  }, [galleryImages, thumbPage]);
  const prevThumbLabel = language === "id" ? "Geser sebelumnya" : "Previous";
  const nextThumbLabel = language === "id" ? "Geser berikutnya" : "Next";

  useEffect(() => {
    if (totalThumbPages === 1) {
      setThumbPage(0);
      return;
    }

    const nextPage = Math.min(totalThumbPages - 1, Math.floor(activeImageIndex / thumbsPerPage));
    setThumbPage((prev) => (prev === nextPage ? prev : nextPage));
  }, [activeImageIndex, totalThumbPages]);

  useEffect(() => {
    setThumbPage((prev) => Math.min(prev, totalThumbPages - 1));
  }, [totalThumbPages]);

  const stayNights = useMemo(() => {
    return getStayDuration(form.tanggal_checkin, form.tanggal_checkout);
  }, [form.tanggal_checkin, form.tanggal_checkout]);

  const estimatedTotal = useMemo(() => {
    if (!villa || stayNights === 0) {
      return 0;
    }

    return displayedNightlyRate * stayNights;
  }, [displayedNightlyRate, stayNights, villa]);

  const facilities = useMemo(
    () => [
      { ...translations.villaDetail.facilities[0], icon: Waves },
      { ...translations.villaDetail.facilities[1], icon: Sparkles },
      { ...translations.villaDetail.facilities[2], icon: ShieldCheck },
      { ...translations.villaDetail.facilities[3], icon: CheckCircle2 },
    ],
    [translations.villaDetail.facilities],
  );

  const isVillaBookable = villa?.status === "tersedia";

  useEffect(() => {
    if (!villa) {
      return;
    }

    setForm((prev) => {
      const resolvedGuests = Math.max(1, Math.min(maxGuest, Number(prev.jumlah_tamu) || 1));
      return resolvedGuests === prev.jumlah_tamu ? prev : { ...prev, jumlah_tamu: resolvedGuests };
    });
  }, [maxGuest, villa]);

  useEffect(() => {
    if (!form.tanggal_checkin) {
      return;
    }

    if (!form.tanggal_checkout) {
      return;
    }

    if (form.tanggal_checkout <= form.tanggal_checkin) {
      setForm((prev) => ({ ...prev, tanggal_checkout: addDaysISO(prev.tanggal_checkin, 1) }));
    }
  }, [form.tanggal_checkin, form.tanggal_checkout]);

  const idealGuestsCopy = useMemo(() => {
    return translations.villaDetail.idealForGuests(maxGuest);
  }, [maxGuest, translations.villaDetail]);

  const bookingSummary = useMemo(() => {
    const roomName = roomType?.shortName ?? villa?.nama_villa ?? "-";
    const nights = stayNights;
    const guests = Number(form.jumlah_tamu) || 0;
    const estimate = estimatedTotal;

    return { roomName, nights, guests, estimate };
  }, [estimatedTotal, form.jumlah_tamu, roomType?.shortName, stayNights, villa?.nama_villa]);

  function validateForm() {
    const nextErrors: { checkin?: string; checkout?: string; guests?: string } = {};

    if (!form.tanggal_checkin) {
      nextErrors.checkin = translations.villaDetail.validation.checkinRequired;
    }

    if (!form.tanggal_checkout) {
      nextErrors.checkout = translations.villaDetail.validation.checkoutRequired;
    }

    if (form.tanggal_checkin && form.tanggal_checkout && stayNights <= 0) {
      nextErrors.checkout = translations.villaDetail.validation.checkoutAfterCheckin;
    }

    const guestValue = Number(form.jumlah_tamu);
    if (!Number.isFinite(guestValue) || guestValue < 1) {
      nextErrors.guests = translations.villaDetail.validation.guestsMin;
    } else if (guestValue > maxGuest) {
      nextErrors.guests = translations.villaDetail.validation.guestsOverCapacity(maxGuest);
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function setGuestCount(next: number) {
    const clamped = Math.max(1, Math.min(maxGuest, Math.floor(next)));
    setForm((prev) => ({ ...prev, jumlah_tamu: clamped }));
    setFieldErrors((prev) => ({ ...prev, guests: undefined }));
  }

  async function handleBookingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSuccessBooking(null);
    setSuccessDialogOpen(false);
    setPassOpen(false);

    if (!user) {
      navigate("/login", { state: { from: `/villas/${id}` } });
      return;
    }

    if (!villa || !isVillaBookable) {
      setSubmitError(translations.villaDetail.unavailableInline);
      return;
    }

    const valid = validateForm();
    if (!valid) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await bookingApi.create({
        villa_id: villa.id,
        tanggal_checkin: form.tanggal_checkin,
        tanggal_checkout: form.tanggal_checkout,
        jumlah_tamu: Number(form.jumlah_tamu),
      });
      setSuccessBooking({
        id: response.booking.id,
        status_booking: response.booking.status_booking,
        tanggal_checkin: response.booking.tanggal_checkin,
        tanggal_checkout: response.booking.tanggal_checkout,
        jumlah_tamu: response.booking.jumlah_tamu,
      });
      setSuccessDialogOpen(true);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError || error instanceof Error ? error.message : translations.villaDetail.errorDescription,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="app-shell section-space">
        <LoadingState label={translations.villaDetail.loading} />
      </main>
    );
  }

  if (!villa) {
    return (
      <main className="app-shell section-space">
        <EmptyState
          title={translations.villaDetail.unavailablePageTitle}
          description={translations.villaDetail.unavailablePageDescription}
          action={
            <Button asChild>
              <Link to="/villas">{translations.villaDetail.backToList}</Link>
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main className="app-shell section-space">
      <AnimatePresence>
        {successBooking && successDialogOpen ? (
          <motion.div
            className="fixed inset-x-0 bottom-0 top-[5.25rem] z-30 px-3 pb-4 md:top-24 md:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-[rgba(6,13,22,0.42)] backdrop-blur-[2px]"
              onClick={() => setSuccessDialogOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label={translations.villaDetail.pass.close}
            />
            <motion.div
              className="relative mx-auto flex h-full w-full max-w-[560px] items-center justify-center"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="w-full overflow-hidden rounded-[1.9rem] border border-[rgba(232,201,139,0.26)] bg-[rgba(248,247,244,0.98)] shadow-[0_38px_100px_-46px_rgba(13,28,46,0.4)]">
                <CardContent className="p-0">
                  <div className="border-b border-[rgba(232,201,139,0.16)] bg-[linear-gradient(160deg,rgba(13,28,46,0.98),rgba(22,53,86,0.94))] px-6 py-6 text-white">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(232,201,139,0.22)] bg-[rgba(196,154,90,0.12)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E8C98B]">
                      <Sparkles size={14} />
                      {translations.villaDetail.successEyebrow}
                    </div>
                    <div className="mt-5 flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(145deg,rgba(232,201,139,0.2),rgba(196,154,90,0.32))] text-[#F6E7C1] shadow-[0_20px_48px_-30px_rgba(196,154,90,0.82)]">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-[0.01em] text-white">{translations.villaDetail.successTitle}</h2>
                        <p className="mt-2 text-sm leading-7 text-white/68">{translations.villaDetail.successDescription}</p>
                        <p className="mt-3 text-sm leading-7 text-[#E8C98B]">{translations.villaDetail.successDialogHint}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 px-6 py-6">
                    <div className="grid gap-3 rounded-[1.5rem] border border-[rgba(217,179,106,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,247,244,0.94))] p-5 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B6A25]">{translations.villaDetail.summary.room}</p>
                        <p className="mt-2 text-sm font-semibold text-[#102A43]">{bookingSummary.roomName}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B6A25]">{translations.villaDetail.summary.checkin}</p>
                        <p className="mt-2 text-sm font-semibold text-[#102A43]">{successBooking.tanggal_checkin}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B6A25]">{translations.villaDetail.summary.checkout}</p>
                        <p className="mt-2 text-sm font-semibold text-[#102A43]">{successBooking.tanggal_checkout}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        className="h-12 flex-1 text-sm"
                        onClick={() => {
                          setSuccessDialogOpen(false);
                          setPassOpen(true);
                        }}
                      >
                        {translations.villaDetail.pass.openCard}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 flex-1 text-sm"
                        onClick={() => navigate("/bookings")}
                      >
                        {translations.villaDetail.successPrimaryAction}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {successBooking ? (
        <BookingPassModal
          open={passOpen}
          onClose={() => setPassOpen(false)}
          booking={successBooking}
          roomName={bookingSummary.roomName}
          location={villa.lokasi}
          guestName={user?.name ?? ""}
          guestContact={user?.phone ?? user?.email ?? ""}
        />
      ) : null}
      <ScrollReveal className="mb-6">
        <Button asChild variant="ghost" className="px-0 text-[#6B7280] hover:bg-transparent hover:text-[#1F4E68]">
          <Link to="/villas">
            <ArrowLeft size={16} />
            {translations.villaDetail.backButton}
          </Link>
        </Button>
      </ScrollReveal>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <ScrollReveal className="space-y-8" distance={34}>
          <div className="soft-panel overflow-hidden p-2">
            <div className="h-[280px] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(16,42,67,0.18),rgba(169,215,232,0.16),rgba(232,201,139,0.2))] md:h-[460px]">
              <img
                src={getUploadUrl(galleryImages[activeImageIndex] ?? roomType?.image ?? villa.gambar)}
                alt={villa.nama_villa}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {galleryImages.length > 1 ? (
            <div className="flex items-center gap-3">
              {galleryImages.length > thumbsPerPage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  onClick={() => setThumbPage((prev) => Math.max(0, prev - 1))}
                  disabled={thumbPage === 0}
                  aria-label={prevThumbLabel}
                  title={prevThumbLabel}
                >
                  <ChevronLeft size={18} />
                </Button>
              ) : null}

              <div className="grid flex-1 grid-cols-6 gap-2 sm:gap-3">
                {visibleThumbs.map((image, localIndex) => {
                  const index = thumbPage * thumbsPerPage + localIndex;
                  const active = index === activeImageIndex;
                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "h-14 w-full overflow-hidden rounded-[1.2rem] border bg-white/60 p-1 transition-all duration-300 sm:h-16 md:h-20",
                        active
                          ? "border-[rgba(217,179,106,0.55)] bg-white/70 shadow-[0_18px_34px_-26px_rgba(16,42,67,0.24)]"
                          : "border-[rgba(214,194,159,0.18)] hover:bg-white/70",
                      )}
                      aria-label={`${translations.villaDetail.eyebrow} ${index + 1}`}
                      title={`${translations.villaDetail.eyebrow} ${index + 1}`}
                    >
                      <img
                        src={getUploadUrl(image)}
                        alt={villa.nama_villa}
                        className="h-full w-full rounded-[0.95rem] object-cover object-center"
                      />
                    </button>
                  );
                })}
              </div>

              {galleryImages.length > thumbsPerPage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  onClick={() => setThumbPage((prev) => Math.min(totalThumbPages - 1, prev + 1))}
                  disabled={thumbPage >= totalThumbPages - 1}
                  aria-label={nextThumbLabel}
                  title={nextThumbLabel}
                >
                  <ChevronRight size={18} />
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={villa.status} />
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <MapPin size={16} />
              {villa.lokasi}
            </div>
          </div>

          <PageHeader
            eyebrow={translations.villaDetail.eyebrow}
            title={roomType?.shortName ?? villa.nama_villa}
            description={roomType ? `${roomType.description[language]} ${baleAurProperty.aboutDescription[language]}` : villa.deskripsi}
            className="mb-0 md:mb-0"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: translations.villaDetail.info.nightlyRate, value: formatCurrency(displayedNightlyRate), icon: CalendarDays },
              { title: translations.villaDetail.info.capacity, value: translations.villaDetail.maxGuests(maxGuest), icon: Users },
              { title: translations.villaDetail.info.location, value: baleAurProperty.locationShort, icon: MapPin },
            ].map((item) => (
              <div key={item.title} className="soft-panel p-5">
                <item.icon size={18} className="mb-4 text-[#1F4E68]" />
                <p className="text-sm text-[#6B7280]">{item.title}</p>
                <p className="mt-2 text-lg font-semibold text-[#102A43]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {roomType?.size ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(217,179,106,0.18)] bg-white/65 px-4 py-2 text-sm font-semibold text-[#1F4E68]">
                <Ruler size={16} className="text-[#5FA9C6]" />
                {roomType.size}
              </span>
            ) : null}
            {roomType?.bedInfo ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(217,179,106,0.18)] bg-white/65 px-4 py-2 text-sm font-semibold text-[#1F4E68]">
                <BedDouble size={16} className="text-[#5FA9C6]" />
                {roomType.bedInfo[language]}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(217,179,106,0.18)] bg-white/65 px-4 py-2 text-sm font-semibold text-[#1F4E68]">
              <Users size={16} className="text-[#5FA9C6]" />
              {translations.villaDetail.maxGuests(maxGuest)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(217,179,106,0.18)] bg-white/65 px-4 py-2 text-sm font-semibold text-[#1F4E68]">
              <Sparkles size={16} className="text-[#E8C98B]" />
              {idealGuestsCopy}
            </span>
          </div>

          <div className="soft-panel p-6 md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5FA9C6]">{translations.villaDetail.facilitiesEyebrow}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#102A43]">{translations.villaDetail.facilitiesTitle}</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {facilities.map((facility) => (
                <div key={facility.title} className="rounded-[1.5rem] border border-[rgba(217,179,106,0.14)] bg-white/65 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(232,201,139,0.24)] text-[#102A43]">
                    <facility.icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-[#102A43]">{facility.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6B7280]">{facility.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <Card className="h-fit lg:sticky lg:top-28">
            <CardContent className="p-7">
              <p className="text-sm uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.villaDetail.reservationEyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#102A43]">{translations.villaDetail.reservationTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                {translations.villaDetail.reservationDescription}
              </p>

              <div className="mt-5 rounded-[1.5rem] bg-[rgba(246,231,193,0.42)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">{translations.villaDetail.nightlyRate}</p>
                    <p className="mt-2 text-3xl font-semibold text-[#102A43]">{formatCurrency(displayedNightlyRate)}</p>
                  </div>
                  <StatusBadge status={villa.status} />
                </div>
              </div>

              {successBooking ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-[1.7rem] border border-[rgba(217,179,106,0.18)] bg-[rgba(246,231,193,0.38)] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B7280]">{translations.villaDetail.successEyebrow}</p>
                        <p className="mt-2 text-xl font-semibold text-[#102A43]">{translations.villaDetail.successTitle}</p>
                        <p className="mt-2 text-sm leading-7 text-[#6B7280]">{translations.villaDetail.successDescription}</p>
                      </div>
                      <StatusBadge status={successBooking.status_booking} />
                    </div>
                  </div>

                  <div className="rounded-[1.7rem] border border-[rgba(217,179,106,0.14)] bg-white/65 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B7280]">{translations.villaDetail.summaryTitle}</p>
                    <div className="mt-4 space-y-3 text-sm text-[#6B7280]">
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.room}</span>
                        <span className="font-semibold text-[#102A43]">{bookingSummary.roomName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.checkin}</span>
                        <span className="font-semibold text-[#102A43]">{successBooking.tanggal_checkin}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.checkout}</span>
                        <span className="font-semibold text-[#102A43]">{successBooking.tanggal_checkout}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.nights}</span>
                        <span className="font-semibold text-[#102A43]">{translations.villaDetail.nights(bookingSummary.nights)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.guests}</span>
                        <span className="font-semibold text-[#102A43]">{successBooking.jumlah_tamu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.estimate}</span>
                        <span className="text-lg font-semibold text-[#102A43]">{bookingSummary.estimate > 0 ? formatCurrency(bookingSummary.estimate) : "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="h-12 flex-1 text-sm">
                      <Link to="/bookings">{translations.villaDetail.successPrimaryAction}</Link>
                    </Button>
                    <Button type="button" variant="secondary" className="h-12 flex-1 text-sm" onClick={() => setPassOpen(true)}>
                      {translations.villaDetail.pass.eyebrow}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 flex-1 text-sm"
                      onClick={() => {
                        setSuccessDialogOpen(false);
                        setPassOpen(false);
                        setSuccessBooking(null);
                        setSubmitError(null);
                        setFieldErrors({});
                        setForm((prev) => ({ ...prev, tanggal_checkin: "", tanggal_checkout: "", jumlah_tamu: Math.min(prev.jumlah_tamu, maxGuest) }));
                      }}
                    >
                      {translations.villaDetail.successSecondaryAction}
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleBookingSubmit}>
                  {submitError ? (
                    <div className="rounded-[1.4rem] border border-[rgba(217,179,106,0.18)] bg-[rgba(246,231,193,0.5)] px-4 py-3 text-sm leading-6 text-[#7A5D21]">
                      {submitError}
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.villaDetail.checkin}</label>
                    <Input
                      type="date"
                      value={form.tanggal_checkin}
                      onChange={(event) => {
                        setForm((prev) => ({ ...prev, tanggal_checkin: event.target.value }));
                        setFieldErrors((prev) => ({ ...prev, checkin: undefined }));
                      }}
                      min={getTodayISO()}
                      required
                    />
                    {fieldErrors.checkin ? <p className="mt-2 text-sm text-[#7A5D21]">{fieldErrors.checkin}</p> : null}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.villaDetail.checkout}</label>
                    <Input
                      type="date"
                      value={form.tanggal_checkout}
                      onChange={(event) => {
                        setForm((prev) => ({ ...prev, tanggal_checkout: event.target.value }));
                        setFieldErrors((prev) => ({ ...prev, checkout: undefined }));
                      }}
                      min={minCheckoutDate}
                      required
                    />
                    {fieldErrors.checkout ? <p className="mt-2 text-sm text-[#7A5D21]">{fieldErrors.checkout}</p> : null}
                  </div>

                  <div>
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <label className="block text-sm font-medium text-[#102A43]">{translations.villaDetail.guests}</label>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B7280]">
                        {translations.villaDetail.maxGuests(maxGuest)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-[1.35rem] border border-[rgba(217,179,106,0.18)] bg-[rgba(248,247,244,0.92)] p-2 shadow-[0_18px_34px_-26px_rgba(16,42,67,0.28)]">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11"
                        onClick={() => setGuestCount(form.jumlah_tamu - 1)}
                        disabled={submitting || form.jumlah_tamu <= 1}
                        aria-label={translations.villaDetail.stepper.decrease}
                        title={translations.villaDetail.stepper.decrease}
                      >
                        <Minus size={18} />
                      </Button>
                      <div className="flex-1 text-center">
                        <p className="text-2xl font-semibold text-[#102A43]">{form.jumlah_tamu}</p>
                        <p className="text-xs text-[#6B7280]">{idealGuestsCopy}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11"
                        onClick={() => setGuestCount(form.jumlah_tamu + 1)}
                        disabled={submitting || form.jumlah_tamu >= maxGuest}
                        aria-label={translations.villaDetail.stepper.increase}
                        title={translations.villaDetail.stepper.increase}
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    {fieldErrors.guests ? <p className="mt-2 text-sm text-[#7A5D21]">{fieldErrors.guests}</p> : null}
                  </div>

                  <div className="rounded-[1.5rem] border border-[rgba(217,179,106,0.14)] bg-[rgba(248,247,244,0.8)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B7280]">{translations.villaDetail.summaryTitle}</p>
                    <div className="mt-4 space-y-3 text-sm text-[#6B7280]">
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.room}</span>
                        <span className="font-semibold text-[#102A43]">{bookingSummary.roomName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.checkin}</span>
                        <span className="font-semibold text-[#102A43]">{form.tanggal_checkin || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.checkout}</span>
                        <span className="font-semibold text-[#102A43]">{form.tanggal_checkout || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.nights}</span>
                        <span className="font-semibold text-[#102A43]">{stayNights > 0 ? translations.villaDetail.nights(stayNights) : "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.guests}</span>
                        <span className="font-semibold text-[#102A43]">{form.jumlah_tamu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{translations.villaDetail.summary.estimate}</span>
                        <span className="text-lg font-semibold text-[#102A43]">{estimatedTotal > 0 ? formatCurrency(estimatedTotal) : "-"}</span>
                      </div>
                    </div>
                  </div>

                  {!isVillaBookable ? (
                    <div className="rounded-[1.4rem] border border-[rgba(217,179,106,0.18)] bg-[rgba(246,231,193,0.5)] px-4 py-3 text-sm leading-6 text-[#7A5D21]">
                      {translations.villaDetail.unavailableInline}
                    </div>
                  ) : null}

                  <Button type="submit" disabled={submitting || !isVillaBookable} className="h-12 w-full text-sm">
                    {submitting ? translations.villaDetail.processing : user ? translations.villaDetail.submit : translations.villaDetail.loginToBook}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      <section className="mt-20">
        <PageHeader
          eyebrow={translations.villaDetail.moreEyebrow}
          title={translations.villaDetail.moreTitle}
          description={translations.villaDetail.moreDescription}
        />
        {similarVillas.length === 0 ? (
          <EmptyState title={translations.villaDetail.moreEmptyTitle} description={translations.villaDetail.moreEmptyDescription} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {similarVillas.map((item) => (
              <ScrollReveal key={item.id} delay={0.06}>
                <VillaCard villa={item} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
