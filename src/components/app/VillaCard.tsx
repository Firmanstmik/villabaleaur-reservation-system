import { Link } from "react-router-dom";
import { ArrowRight, Folder, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBaleAurRoomType } from "@/data/baleAurContent";
import { getUploadUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Villa } from "@/types/app";
import { useLanguage } from "@/contexts/LanguageContext";

import StatusBadge from "./StatusBadge";

interface VillaCardProps {
  villa: Villa;
}

export default function VillaCard({ villa }: VillaCardProps) {
  const { translations, language } = useLanguage();
  const roomType = getBaleAurRoomType(villa.id);
  const roomName = roomType?.shortName ?? villa.nama_villa;
  const roomDescription = roomType ? roomType.description[language] : villa.deskripsi;
  const roomLocation = roomType?.location ?? villa.lokasi;
  const gallery = Array.isArray(villa.galeri) ? villa.galeri : [];
  const primaryImage = villa.gambar ?? gallery[0] ?? roomType?.image;
  const extraImageCount = Math.max(0, gallery.length - 1);
  const previewImages = gallery.slice(1, 4);
  const roomPrice = roomType?.price ?? villa.harga;

  return (
    <Card className="group overflow-hidden border-white/80 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_38px_80px_-40px_rgba(31,78,104,0.42)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        {primaryImage ? (
          <img
            src={getUploadUrl(primaryImage)}
            alt={villa.nama_villa}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(180deg,rgba(31,78,104,0.18),rgba(16,42,67,0.06))]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/25 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <StatusBadge status={villa.status} />
        </div>
        {extraImageCount > 0 ? (
          <div className="absolute right-4 top-4">
            <div className="relative">
              {previewImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={
                    index === 0
                      ? "pointer-events-none absolute right-1 top-1 h-9 w-12 rotate-[-6deg] overflow-hidden rounded-xl border border-white/18 bg-white/8 opacity-0 shadow-[0_18px_38px_-26px_rgba(5,18,31,0.9)] backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-[-6px] group-hover:translate-x-[-10px]"
                      : index === 1
                        ? "pointer-events-none absolute right-1 top-1 h-9 w-12 rotate-[4deg] overflow-hidden rounded-xl border border-white/18 bg-white/8 opacity-0 shadow-[0_18px_38px_-26px_rgba(5,18,31,0.9)] backdrop-blur-sm transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-[-14px] group-hover:translate-x-[-4px]"
                        : "pointer-events-none absolute right-1 top-1 h-9 w-12 rotate-[-2deg] overflow-hidden rounded-xl border border-white/18 bg-white/8 opacity-0 shadow-[0_18px_38px_-26px_rgba(5,18,31,0.9)] backdrop-blur-sm transition-all duration-300 delay-150 group-hover:opacity-100 group-hover:translate-y-[-20px] group-hover:translate-x-[6px]"
                  }
                  style={{ backgroundImage: `url(${getUploadUrl(image)})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
              ))}

              <div
                className="relative z-10 flex h-10 w-10 items-center justify-center transition-transform duration-300 group-hover:scale-105"
                aria-label={`${extraImageCount} gambar tambahan`}
                title={`${extraImageCount} gambar tambahan`}
              >
                <Folder size={24} strokeWidth={2.2} className="text-[#E8C98B] drop-shadow-[0_10px_24px_rgba(5,18,31,0.85)]" />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none text-white drop-shadow-[0_10px_24px_rgba(5,18,31,0.9)]">
                  {extraImageCount}+
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <CardContent className="space-y-5 p-6 md:p-7">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <MapPin size={16} />
            <span>{roomLocation}</span>
          </div>
          <h3 className="text-xl font-semibold text-[#102A43]">{roomName}</h3>
          <p className="line-clamp-2 text-sm leading-7 text-[#6B7280]">{roomDescription}</p>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-[rgba(217,179,106,0.16)] pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">{translations.villaCard.nightlyRate}</p>
            <p className="mt-1 text-2xl font-semibold text-[#102A43]">{formatCurrency(roomPrice)}</p>
          </div>
          <Button asChild variant="secondary">
            <Link to={`/villas/${villa.id}`}>
              {translations.villaCard.detail}
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
