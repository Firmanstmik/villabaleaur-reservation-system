import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BedDouble, Folder, Plus, Sparkles, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

import EmptyState from "@/components/app/EmptyState";
import LoadingState from "@/components/app/LoadingState";
import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBaleAurRoomType } from "@/data/baleAurContent";
import { getUploadUrl, villaApi } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Villa } from "@/types/app";

export default function AdminVillasPage() {
  const { translations, language } = useLanguage();
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  async function fetchVillas() {
    const response = await villaApi.list();
    setVillas(response.villas);
  }

  useEffect(() => {
    fetchVillas().finally(() => setLoadingData(false));
  }, []);

  const availableRooms = villas.filter((villa) => villa.status === "tersedia").length;
  const maintenanceRooms = villas.filter((villa) => villa.status === "maintenance").length;
  const totalGalleryAssets = villas.reduce((total, villa) => {
    const gallery = Array.isArray(villa.galeri) ? villa.galeri : [];
    if (gallery.length > 0) {
      return total + gallery.length;
    }

    return total + (villa.gambar ? 1 : 0);
  }, 0);

  const collectionStats = [
    {
      label: translations.adminVillas.stats.totalRooms,
      value: villas.length,
      icon: BedDouble,
      accent: "bg-[rgba(95,169,198,0.14)] text-[#1F4E68]",
    },
    {
      label: translations.adminVillas.stats.availableRooms,
      value: availableRooms,
      icon: Sparkles,
      accent: "bg-[rgba(169,215,232,0.18)] text-[#1F4E68]",
    },
    {
      label: translations.adminVillas.stats.maintenanceRooms,
      value: maintenanceRooms,
      icon: Wrench,
      accent: "bg-[rgba(232,201,139,0.2)] text-[#8B6A25]",
    },
    {
      label: translations.adminVillas.stats.galleryAssets,
      value: totalGalleryAssets,
      icon: Folder,
      accent: "bg-[rgba(16,42,67,0.08)] text-[#102A43]",
    },
  ];

  async function handleDelete(id: number) {
    if (!window.confirm(translations.adminVillas.deleteConfirm)) {
      return;
    }

    try {
      await villaApi.remove(id);
      toast.success(translations.adminVillas.deleteSuccess);
      fetchVillas();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminVillas.deleteError);
    }
  }

  return (
    <main className="app-shell section-space">
      <PageHeader
        eyebrow={translations.adminVillas.eyebrow}
        title={translations.adminVillas.title}
        description={translations.adminVillas.description}
        action={
          <Button asChild>
            <Link to="/admin/villas/new">
              <Plus />
              {translations.adminVillas.addVilla}
            </Link>
          </Button>
        }
      />

      <ScrollReveal delay={0.08}>
        <Card className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-[rgba(248,247,244,0.86)] shadow-[0_38px_90px_-54px_rgba(16,42,67,0.32)] backdrop-blur-md">
          <CardContent className="p-0">
            <div className="border-b border-[rgba(217,179,106,0.12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.66),rgba(255,255,255,0.2))] px-6 py-6">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-end">
                <div className="space-y-4">
                  <span className="inline-flex items-center rounded-full border border-[rgba(217,179,106,0.22)] bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1F4E68]">
                    {translations.adminVillas.collectionTitle}
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold text-[#102A43] md:text-[2rem]">{translations.adminVillas.manageFlowTitle}</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6B7280]">{translations.adminVillas.manageFlowDescription}</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/80 bg-white/72 p-5 shadow-[0_24px_56px_-40px_rgba(16,42,67,0.28)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5FA9C6]">{translations.adminVillas.eyebrow}</p>
                  <p className="mt-3 text-lg font-semibold text-[#102A43]">{translations.adminVillas.collectionDescription}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to="/admin/villas/new">
                        <Plus />
                        {translations.adminVillas.addVilla}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {loadingData ? (
              <div className="p-6">
                <LoadingState label={translations.adminVillas.loading} className="min-h-[280px]" />
              </div>
            ) : villas.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title={translations.adminVillas.emptyTitle}
                  description={translations.adminVillas.emptyDescription}
                  action={
                    <Button asChild>
                      <Link to="/admin/villas/new">{translations.adminVillas.addVilla}</Link>
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div className="grid gap-4 border-b border-[rgba(217,179,106,0.12)] px-5 py-5 sm:grid-cols-2 xl:grid-cols-4">
                  {collectionStats.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-[1.7rem] border border-white/80 bg-white/70 p-4 shadow-[0_20px_46px_-38px_rgba(16,42,67,0.28)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">{item.label}</p>
                            <p className="mt-2 text-3xl font-semibold text-[#102A43]">{item.value}</p>
                          </div>
                          <span className={`flex h-11 w-11 items-center justify-center rounded-[1.2rem] ${item.accent}`}>
                            <Icon size={18} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
                  {villas.map((villa) => {
                    const roomType = getBaleAurRoomType(villa.id);
                    const gallery = Array.isArray(villa.galeri) ? villa.galeri : [];
                    const primaryImage = villa.gambar ?? gallery[0] ?? roomType?.image ?? "";
                    const extraImageCount = Math.max(0, gallery.length - 1);
                    const visualCount = gallery.length > 0 ? gallery.length : primaryImage ? 1 : 0;
                    const maxGuestFromRoomType = Number((roomType?.capacity?.en ?? roomType?.capacity?.id ?? "").replace(/[^0-9]/g, ""));
                    const maxGuest = Number(villa.max_guest) || maxGuestFromRoomType || 2;
                    const capacityLabel = language === "id" ? `Maks ${maxGuest} tamu` : `Max ${maxGuest} guests`;
                    const chips = roomType
                      ? [roomType.size, capacityLabel, roomType.bedInfo[language]]
                      : [];
                    const description =
                      villa.deskripsi.length > 132 ? `${villa.deskripsi.slice(0, 129).trim()}...` : villa.deskripsi;

                    return (
                      <ScrollReveal key={villa.id} delay={0.05}>
                        <div className="group overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(248,247,244,0.84)] shadow-[0_30px_70px_-48px_rgba(16,42,67,0.26)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_46px_110px_-60px_rgba(16,42,67,0.3)]">
                          <div className="relative aspect-[16/9] overflow-hidden">
                            {primaryImage ? (
                              <img
                                src={getUploadUrl(primaryImage)}
                                alt={roomType?.shortName ?? villa.nama_villa}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                              />
                            ) : (
                              <div className="h-full w-full bg-[linear-gradient(135deg,rgba(16,42,67,0.16),rgba(169,215,232,0.12),rgba(232,201,139,0.18))]" />
                            )}
                            <div className="absolute inset-0 hero-overlay opacity-65" />

                            <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                              <StatusBadge status={villa.status} />
                              {roomType ? (
                                <span className="inline-flex items-center rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                                  {roomType.shortName}
                                </span>
                              ) : null}
                            </div>

                            {extraImageCount > 0 ? (
                              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(11,31,49,0.38)] px-3 py-1.5 text-white shadow-[0_18px_38px_-26px_rgba(5,18,31,0.85)] backdrop-blur-md">
                                <Folder size={18} className="text-[#E8C98B]" />
                                <span className="text-xs font-semibold">{extraImageCount}+</span>
                              </div>
                            ) : null}

                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                              <span className="inline-flex items-center rounded-full bg-[rgba(11,31,49,0.36)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                                {translations.adminVillas.priceLabel}
                              </span>
                              <p className="text-lg font-semibold text-white">{formatCurrency(roomType?.price ?? villa.harga)}</p>
                            </div>
                          </div>

                          <div className="space-y-5 p-6">
                            <div className="space-y-2">
                              <p className="text-xl font-semibold text-[#102A43]">{roomType?.shortName ?? villa.nama_villa}</p>
                              <p className="text-sm text-[#6B7280]">{roomType?.location ?? villa.lokasi}</p>
                            </div>

                            {chips.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {chips.map((chip) => (
                                  <span
                                    key={chip}
                                    className="rounded-full border border-[rgba(217,179,106,0.18)] bg-white/55 px-3 py-1.5 text-xs font-semibold text-[#1F4E68]"
                                  >
                                    {chip}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            <p className="text-sm leading-7 text-[#6B7280]">{description}</p>

                            <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[rgba(217,179,106,0.14)] bg-white/55 px-4 py-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                                  {visualCount > 0 ? translations.adminVillas.galleryCount(visualCount) : translations.adminVillas.galleryEmpty}
                                </p>
                                <p className="mt-1 text-sm font-medium text-[#102A43]">{translations.app.status[villa.status]}</p>
                              </div>
                              <span className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[rgba(232,201,139,0.2)] text-[#8B6A25]">
                                <Folder size={18} />
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button className="min-w-[140px] flex-1" size="sm" asChild>
                                <Link to={`/admin/villas/${villa.id}/edit`}>
                                  {translations.adminVillas.edit}
                                </Link>
                              </Button>
                              <Button className="min-w-[140px] flex-1" size="sm" variant="destructive" onClick={() => handleDelete(villa.id)}>
                                {translations.adminVillas.delete}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </ScrollReveal>
    </main>
  );
}
