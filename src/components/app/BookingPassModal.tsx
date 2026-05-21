import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { Download, FileDown, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logoVilla from "@/assets/logo-villa-bale-aur.webp";
import { formatDate } from "@/lib/format";
import type { BookingStatus } from "@/types/app";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildBookingCode(id: number) {
  const prefix = "BA";
  const padded = String(id).padStart(6, "0");
  return `${prefix}-${padded}`;
}

function resolveStatusAccent(status: BookingStatus) {
  if (status === "disetujui")
    return {
      label: "Approved",
      color: "#8B6914",
      tint: "rgba(196,154,90,0.14)",
      badgeClassName: "bg-[rgba(196,154,90,0.14)] text-[#8B6914]",
    };
  if (status === "ditolak")
    return {
      label: "Rejected",
      color: "#8B1A1A",
      tint: "rgba(160,50,50,0.10)",
      badgeClassName: "bg-[rgba(160,50,50,0.10)] text-[#8B1A1A]",
    };
  if (status === "selesai")
    return {
      label: "Completed",
      color: "#1A5038",
      tint: "rgba(30,80,60,0.10)",
      badgeClassName: "bg-[rgba(30,80,60,0.10)] text-[#1A5038]",
    };
  return {
    label: "Pending",
    color: "#7A5D21",
    tint: "rgba(196,154,90,0.11)",
    badgeClassName: "bg-[rgba(196,154,90,0.11)] text-[#7A5D21]",
  };
}

function buildPassSvg({
  bookingId,
  statusLabel,
  statusColor,
  statusTint,
  logoDataUrl,
  guestName,
  guestContact,
  roomName,
  location,
  checkinLabel,
  checkoutLabel,
  guestsLabel,
  issuedLabel,
  checkinValue,
  checkoutValue,
  guestsValue,
  issuedValue,
  brandName,
  subBrand,
}: {
  bookingId: number;
  statusLabel: string;
  statusColor: string;
  statusTint: string;
  logoDataUrl?: string | null;
  guestName: string;
  guestContact: string;
  roomName: string;
  location: string;
  checkinLabel: string;
  checkoutLabel: string;
  guestsLabel: string;
  issuedLabel: string;
  checkinValue: string;
  checkoutValue: string;
  guestsValue: string;
  issuedValue: string;
  brandName: string;
  subBrand: string;
}) {
  const code = buildBookingCode(bookingId);
  const s = (v: string) => escapeXml(v || "—");

  // Canvas
  const W = 920, H = 460;
  // Card bounds
  const CX = 34, CY = 28, CW = 852, CH = 404, CRX = 32;
  // Left panel
  const LP = 290;
  const DX = CX + LP;           // divider x = 324
  const LC = CX + Math.round(LP / 2); // left center = 179
  // Right panel content
  const RX = DX + 30;           // right content start = 354
  const RE = CX + CW - 28;      // right content end   = 858

  const GOLD  = "#C49A5A";
  const NAVY  = "#0D1C2E";
  const CREAM = "#F8F3EE";
  const WHITE = "#FFFFFF";
  // Lotus petal path (teardrop, pointing up from origin)
  const PETAL = "M0,0 C-9,-26 -9,-46 0,-62 C9,-46 9,-26 0,0";
  const showLogo = typeof logoDataUrl === "string" && logoDataUrl.startsWith("data:");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <clipPath id="cc">
      <rect x="${CX}" y="${CY}" width="${CW}" height="${CH}" rx="${CRX}"/>
    </clipPath>
    <filter id="sh" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="${NAVY}" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Drop shadow base (outside clip) -->
  <rect x="${CX}" y="${CY}" width="${CW}" height="${CH}" rx="${CRX}" fill="${CREAM}" filter="url(#sh)"/>

  <g clip-path="url(#cc)">

    <!-- ── Card base (cream / right panel bg) ── -->
    <rect x="${CX}" y="${CY}" width="${CW}" height="${CH}" fill="${CREAM}"/>

    <!-- ── Left panel (deep navy) ── -->
    <rect x="${CX}" y="${CY}" width="${LP}" height="${CH}" fill="${NAVY}"/>

    <!-- Left panel: 6 px gold accent bar -->
    <rect x="${CX}" y="${CY}" width="${LP}" height="6" fill="${GOLD}"/>

    <!-- Right panel: ultra-subtle 4 px gold accent bar -->
    <rect x="${DX}" y="${CY}" width="${CW - LP}" height="4" fill="${GOLD}" opacity="0.28"/>

    <!-- Left panel: concentric quarter-circle arcs (bottom-left) -->
    <g fill="none" stroke="${GOLD}" stroke-width="0.9" opacity="0.09">
      <path d="M${CX},${CY + CH - 100} A100,100 0 0 1 ${CX + 100},${CY + CH}"/>
      <path d="M${CX},${CY + CH - 168} A168,168 0 0 1 ${CX + 168},${CY + CH}"/>
      <path d="M${CX},${CY + CH - 234} A234,234 0 0 1 ${CX + 234},${CY + CH}"/>
      <path d="M${CX},${CY + CH - 300} A300,300 0 0 1 ${CX + 300},${CY + CH}"/>
    </g>

    <!-- ════ LEFT PANEL CONTENT ════ -->

    ${showLogo ? `
    <image href="${logoDataUrl}" x="66" y="40" width="92" height="46" preserveAspectRatio="xMinYMid meet" opacity="0.98"/>
    ` : ""}

    <!-- Sub-brand label -->
    <text x="66" y="102"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="5"
      fill="${GOLD}">${s(subBrand).toUpperCase()}</text>

    <!-- Brand name (serif display) -->
    <text x="66" y="130"
      font-family="Georgia,'Times New Roman',serif"
      font-size="22" font-weight="700" letter-spacing="0.5"
      fill="${WHITE}">${s(brandName)}</text>

    <!-- Rule + diamond ornament -->
    <line x1="66" y1="146" x2="302" y2="146" stroke="${GOLD}" stroke-width="0.6" opacity="0.38"/>
    <polygon points="${LC},139 ${LC + 6},146 ${LC},153 ${LC - 6},146" fill="${GOLD}" opacity="0.5"/>

    <!-- Accommodation label + values -->
    <text x="66" y="184"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="4"
      fill="${GOLD}">ACCOMMODATION</text>
    <text x="66" y="209"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="16" font-weight="600" letter-spacing="0.2"
      fill="${WHITE}">${s(roomName)}</text>
    <text x="66" y="229"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="12" letter-spacing="0.2"
      fill="${WHITE}" opacity="0.46">${s(location)}</text>

    <!-- Thin rule below room info -->
    <line x1="66" y1="247" x2="302" y2="247" stroke="${GOLD}" stroke-width="0.5" opacity="0.25"/>

    <!-- Status pill -->
    <rect x="${LC - 58}" y="262" width="116" height="28" rx="14"
      fill="${statusTint}" stroke="${statusColor}" stroke-width="0.8" stroke-opacity="0.55"/>
    <text x="${LC}" y="281"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="3.5"
      fill="${statusColor}" text-anchor="middle">${s(statusLabel).toUpperCase()}</text>

    <!-- Lotus / floral motif (bottom of left panel) -->
    <g transform="translate(${LC},396)">
      <path d="${PETAL}" transform="rotate(0)"
        fill="${GOLD}" fill-opacity="0.07"
        stroke="${GOLD}" stroke-width="0.7" stroke-opacity="0.19"/>
      <path d="${PETAL}" transform="rotate(60)"
        fill="${GOLD}" fill-opacity="0.07"
        stroke="${GOLD}" stroke-width="0.7" stroke-opacity="0.19"/>
      <path d="${PETAL}" transform="rotate(120)"
        fill="${GOLD}" fill-opacity="0.07"
        stroke="${GOLD}" stroke-width="0.7" stroke-opacity="0.19"/>
      <path d="${PETAL}" transform="rotate(180)"
        fill="${GOLD}" fill-opacity="0.07"
        stroke="${GOLD}" stroke-width="0.7" stroke-opacity="0.19"/>
      <path d="${PETAL}" transform="rotate(240)"
        fill="${GOLD}" fill-opacity="0.07"
        stroke="${GOLD}" stroke-width="0.7" stroke-opacity="0.19"/>
      <path d="${PETAL}" transform="rotate(300)"
        fill="${GOLD}" fill-opacity="0.07"
        stroke="${GOLD}" stroke-width="0.7" stroke-opacity="0.19"/>
      <circle r="5" fill="${GOLD}" opacity="0.3"/>
    </g>

    <!-- ── Perforated divider ── -->
    <line
      x1="${DX}" y1="${CY + 20}"
      x2="${DX}" y2="${CY + CH - 20}"
      stroke="${GOLD}" stroke-width="0.75"
      stroke-dasharray="3,8" opacity="0.3"/>

    <!-- ════ RIGHT PANEL CONTENT ════ -->

    <!-- Guest section (top-left of right panel) -->
    <text x="${RX}" y="76"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="5"
      fill="${GOLD}">GUEST</text>
    <text x="${RX}" y="103"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="18" font-weight="600" letter-spacing="0.2"
      fill="${NAVY}">${s(guestName)}</text>
    <text x="${RX}" y="124"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="12" letter-spacing="0.1"
      fill="${NAVY}" opacity="0.46">${s(guestContact)}</text>

    <!-- Booking reference (top-right of right panel) -->
    <text x="${RE}" y="76"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="3"
      fill="${GOLD}" text-anchor="end">BOOKING REF</text>
    <text x="${RE}" y="103"
      font-family="'Courier New',Courier,monospace"
      font-size="15" font-weight="700" letter-spacing="2"
      fill="${NAVY}" text-anchor="end">${s(code)}</text>

    <!-- Rule 1 -->
    <line x1="${RX}" y1="144" x2="${RE}" y2="144"
      stroke="${GOLD}" stroke-width="0.55" opacity="0.26"/>

    <!-- Info grid — 3 columns -->
    <!-- Col 1: Check-in -->
    <text x="${RX}" y="174"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="4"
      fill="${GOLD}">${s(checkinLabel).toUpperCase()}</text>
    <text x="${RX}" y="200"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="17" font-weight="600" letter-spacing="0.1"
      fill="${NAVY}">${s(checkinValue)}</text>

    <!-- Col 2: Check-out -->
    <text x="${RX + 170}" y="174"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="4"
      fill="${GOLD}">${s(checkoutLabel).toUpperCase()}</text>
    <text x="${RX + 170}" y="200"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="17" font-weight="600" letter-spacing="0.1"
      fill="${NAVY}">${s(checkoutValue)}</text>

    <!-- Col 3: Guests -->
    <text x="${RX + 340}" y="174"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="4"
      fill="${GOLD}">${s(guestsLabel).toUpperCase()}</text>
    <text x="${RX + 340}" y="200"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="17" font-weight="600" letter-spacing="0.1"
      fill="${NAVY}">${s(guestsValue)}</text>

    <!-- Rule 2 -->
    <line x1="${RX}" y1="226" x2="${RE}" y2="226"
      stroke="${GOLD}" stroke-width="0.5" opacity="0.2"/>

    <!-- Issued date -->
    <text x="${RX}" y="254"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8" font-weight="700" letter-spacing="4"
      fill="${GOLD}">${s(issuedLabel).toUpperCase()}</text>
    <text x="${RX}" y="274"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="13" letter-spacing="0.1"
      fill="${NAVY}" opacity="0.52">${s(issuedValue)}</text>

    <!-- Bottom instruction strip (very subtle navy tint) -->
    <rect x="${DX}" y="299" width="${CW - LP}" height="${CY + CH - 299}"
      fill="${NAVY}" opacity="0.035"/>
    <line x1="${DX}" y1="299" x2="${CX + CW}" y2="299"
      stroke="${GOLD}" stroke-width="0.5" opacity="0.18"/>

    <!-- Bottom strip: instruction text -->
    <text x="${RX}" y="335"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="8.5" font-weight="700" letter-spacing="3.5"
      fill="${NAVY}" opacity="0.48">SHOW THIS PASS ON ARRIVAL</text>
    <text x="${RX}" y="357"
      font-family="system-ui,-apple-system,sans-serif"
      font-size="12" letter-spacing="0.1"
      fill="${NAVY}" opacity="0.34">Keep it accessible on your mobile device.</text>

    <!-- Bottom right: stacked diamond ornaments -->
    <polygon points="${RE},326 ${RE + 5},333 ${RE},340 ${RE - 5},333"
      fill="${GOLD}" opacity="0.45"/>
    <polygon points="${RE},346 ${RE + 5},353 ${RE},360 ${RE - 5},353"
      fill="${GOLD}" opacity="0.28"/>
    <polygon points="${RE},366 ${RE + 5},373 ${RE},380 ${RE - 5},373"
      fill="${GOLD}" opacity="0.15"/>

  </g>
</svg>`;
}

// ─────────────────────────────────────────────
//  PNG / PDF export helpers (unchanged)
// ─────────────────────────────────────────────

async function svgToPngDataUrl(svgText: string, scale = 2) {
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Gagal merender kartu booking."));
      img.src = url;
    });
    const width  = Math.max(1, Math.floor((image.width  || 1050) * scale));
    const height = Math.max(1, Math.floor((image.height || 650)  * scale));
    const canvas = document.createElement("canvas");
    canvas.width  = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas tidak tersedia.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href     = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

export type BookingPassPayload = {
  id: number;
  status_booking: BookingStatus;
  tanggal_checkin: string;
  tanggal_checkout: string;
  jumlah_tamu: number;
};

type BookingPassModalProps = {
  open: boolean;
  onClose: () => void;
  booking: BookingPassPayload;
  roomName: string;
  location: string;
  guestName: string;
  guestContact: string;
};

// ─────────────────────────────────────────────
//  Modal component
// ─────────────────────────────────────────────

export default function BookingPassModal({
  open,
  onClose,
  booking,
  roomName,
  location,
  guestName,
  guestContact,
}: BookingPassModalProps) {
  const { translations } = useLanguage();
  const [downloading, setDownloading] = useState<null | "png" | "pdf">(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  const statusText = useMemo(
    () => translations.app.status[booking.status_booking],
    [booking.status_booking, translations.app.status]
  );
  const accent = useMemo(
    () => resolveStatusAccent(booking.status_booking),
    [booking.status_booking]
  );

  const svgText = useMemo(() => {
    return buildPassSvg({
      bookingId:      booking.id,
      statusLabel:    statusText,
      statusColor:    accent.color,
      statusTint:     accent.tint,
      logoDataUrl,
      guestName:      guestName  || "-",
      guestContact:   guestContact || "-",
      roomName,
      location,
      checkinLabel:   translations.villaDetail.summary.checkin,
      checkoutLabel:  translations.villaDetail.summary.checkout,
      guestsLabel:    translations.villaDetail.summary.guests,
      issuedLabel:    translations.villaDetail.pass.issuedLabel,
      checkinValue:   formatDate(booking.tanggal_checkin),
      checkoutValue:  formatDate(booking.tanggal_checkout),
      guestsValue:    String(booking.jumlah_tamu),
      issuedValue:    formatDate(new Date().toISOString()),
      brandName:      translations.villaDetail.pass.brandName,
      subBrand:       translations.villaDetail.pass.brandTag,
    });
  }, [
    accent.color, accent.tint,
    booking.id, booking.jumlah_tamu,
    booking.tanggal_checkin, booking.tanggal_checkout,
    guestContact, guestName, location, roomName, statusText,
    logoDataUrl,
    translations.villaDetail.pass.brandName,
    translations.villaDetail.pass.brandTag,
    translations.villaDetail.pass.issuedLabel,
    translations.villaDetail.summary.checkin,
    translations.villaDetail.summary.checkout,
    translations.villaDetail.summary.guests,
  ]);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        const response = await fetch(logoVilla);
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(new Error("Gagal memuat logo."));
          reader.onload = () => resolve(String(reader.result || ""));
          reader.readAsDataURL(blob);
        });
        if (!canceled) {
          setLogoDataUrl(dataUrl);
        }
      } catch {
        if (!canceled) {
          setLogoDataUrl(null);
        }
      }
    }

    if (!logoDataUrl) {
      load();
    }

    return () => {
      canceled = true;
    };
  }, [logoDataUrl]);

  const inlineSvgText = useMemo(
    () => svgText.replace(/^<\?xml[^>]*>\s*/i, ""),
    [svgText]
  );

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  async function handleDownloadPng() {
    if (downloading) return;
    setDownloading("png");
    try {
      const pngUrl = await svgToPngDataUrl(svgText, 2);
      downloadDataUrl(pngUrl, `bale-aur-booking-${buildBookingCode(booking.id)}.png`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal download kartu booking.");
    } finally {
      setDownloading(null);
    }
  }

  async function handleDownloadPdf() {
    if (downloading) return;
    setDownloading("pdf");
    try {
      const pngDataUrl = await svgToPngDataUrl(svgText, 2);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      const imageWidth = 920;
      const imageHeight = 460;
      const scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
      const renderWidth = imageWidth * scale;
      const renderHeight = imageHeight * scale;
      const offsetX = (pageWidth - renderWidth) / 2;
      const offsetY = (pageHeight - renderHeight) / 2;

      pdf.setFillColor(244, 239, 232);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.addImage(pngDataUrl, "PNG", offsetX, offsetY, renderWidth, renderHeight, undefined, "FAST");
      pdf.save(`bale-aur-booking-${buildBookingCode(booking.id)}.pdf`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal membuat PDF.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 top-[5.25rem] z-30 px-3 pb-4 md:top-24 md:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            className="absolute inset-0 bg-[rgba(6,13,22,0.54)] backdrop-blur-[3px]"
            aria-label={translations.villaDetail.pass.close}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal panel */}
          <motion.div
            className="relative mx-auto flex h-full w-full max-w-[680px] flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[rgba(196,154,90,0.22)] bg-[rgba(248,243,238,0.97)] shadow-[0_32px_80px_-36px_rgba(13,28,46,0.42)]">
              <CardContent className="flex min-h-0 flex-1 flex-col p-0">

                {/* ── Header ── */}
                <div className="flex items-start justify-between gap-3 border-b border-t-[2.5px] border-[rgba(196,154,90,0.15)] border-t-[#C49A5A] bg-[linear-gradient(160deg,rgba(13,28,46,0.99),rgba(18,44,80,0.95))] px-4 py-4 text-white sm:px-5">
                  <div className="min-w-0 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C49A5A]">
                      {translations.villaDetail.pass.eyebrow}
                    </p>
                    <p className="truncate text-xl font-semibold tracking-wide sm:text-2xl">
                      {translations.villaDetail.pass.title}
                    </p>
                    <p className="hidden max-w-xl text-[13px] leading-6 text-white/60 sm:block">
                      {translations.villaDetail.pass.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start">
                    {/* Status pill */}
                    <div
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-[11px]",
                        accent.badgeClassName,
                      )}
                    >
                      {statusText}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="h-9 w-9 rounded-full p-0 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5">

                  {/* SVG pass preview */}
                  <div className="mx-auto w-full max-w-[540px] overflow-hidden rounded-2xl border border-[rgba(196,154,90,0.14)] bg-[#F8F3EE] shadow-[0_12px_40px_-20px_rgba(13,28,46,0.18)]">
                    <div
                      className="w-full [&_svg]:h-auto [&_svg]:w-full"
                      dangerouslySetInnerHTML={{ __html: inlineSvgText }}
                    />
                  </div>

                  {/* Download actions */}
                  <div className="mt-auto flex flex-col gap-2.5 sm:flex-row">
                    {/* Primary — PNG */}
                    <button
                      type="button"
                      disabled={downloading !== null}
                      onClick={handleDownloadPng}
                      className={cn(
                        "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0D1C2E] px-4 text-[13px] font-semibold tracking-wide text-white transition-all hover:bg-[#162840] active:scale-[0.98]",
                        downloading === "png" && "opacity-60"
                      )}
                    >
                      <Download size={16} />
                      {translations.villaDetail.pass.downloadPng}
                    </button>

                    {/* Secondary — PDF */}
                    <button
                      type="button"
                      disabled={downloading !== null}
                      onClick={handleDownloadPdf}
                      className={cn(
                        "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[rgba(196,154,90,0.45)] bg-transparent px-4 text-[13px] font-semibold tracking-wide text-[#7A5D21] transition-all hover:bg-[rgba(196,154,90,0.07)] active:scale-[0.98]",
                        downloading === "pdf" && "opacity-60"
                      )}
                    >
                      <FileDown size={16} />
                      {translations.villaDetail.pass.downloadPdf}
                    </button>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
