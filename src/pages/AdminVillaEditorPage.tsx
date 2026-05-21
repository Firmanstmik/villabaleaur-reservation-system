import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BedDouble, FolderOpen, ImagePlus, Images, Sparkles, UploadCloud, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import LoadingState from "@/components/app/LoadingState";
import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import StatusBadge from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBaleAurRoomType } from "@/data/baleAurContent";
import { getUploadUrl, villaApi } from "@/lib/api";
import type { VillaStatus } from "@/types/app";

const emptyForm = {
  nama_villa: "",
  lokasi: "",
  harga: "",
  max_guest: "2",
  deskripsi: "",
  status: "tersedia",
};

function extractUrlsFromText(text: string): string[] {
  const replaceAllCompat = (value: string, search: string, replacement: string) => value.split(search).join(replacement);

  const normalized = replaceAllCompat(
    replaceAllCompat(replaceAllCompat(text, "&amp;", "&"), "&quot;", '"'),
    "`",
    " ",
  ).replace(/\\"/g, '"');

  const matches =
    normalized.match(/(https?:\/\/[^\s"'<>]+|\/uploads\/[^\s"'<>]+|uploads\/[^\s"'<>]+|\/assets\/[^\s"'<>]+|assets\/[^\s"'<>]+)/gi) ??
    [];
  const cleaned = matches
    .map((item: string) => item.replace(/[)\]"';]+$/g, ""))
    .map((item) => {
      if (item.startsWith("uploads/")) {
        return `/${item}`;
      }
      if (item.startsWith("assets/")) {
        return `/${item}`;
      }
      return item;
    })
    .filter(Boolean);

  return Array.from(new Set<string>(cleaned));
}

export default function AdminVillaEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [showThumbnailPicker, setShowThumbnailPicker] = useState(false);
  const [galleryUrlsText, setGalleryUrlsText] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [loadingData, setLoadingData] = useState(Boolean(id));
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editingId = id ? Number(id) : null;
  const isEditMode = editingId !== null && !Number.isNaN(editingId);

  const standardDoubleAssetUrls = useMemo(() => {
    const modules = import.meta.glob("@/assets/*.avif", { eager: true, import: "default" }) as Record<string, string>;

    return Object.entries(modules)
      .filter(([key]) => !/logo/i.test(key))
      .map(([, value]) => value);
  }, []);

  const isStandardDoubleEditing = useMemo(() => {
    if (!editingId) {
      return /standard double room/i.test(form.nama_villa);
    }

    const roomType = getBaleAurRoomType(editingId);
    if (roomType?.slug === "standard-double-room") {
      return true;
    }

    return /standard double room/i.test(form.nama_villa);
  }, [editingId, form.nama_villa]);

  const currentRoomType = useMemo(() => {
    if (!editingId) {
      return null;
    }

    return getBaleAurRoomType(editingId);
  }, [editingId]);

  const uploadPickerItems = useMemo(
    () =>
      imageFiles.map((file, index) => ({
        index,
        key: `${file.name}-${file.lastModified}-${index}`,
        src: URL.createObjectURL(file),
        name: file.name,
      })),
    [imageFiles],
  );

  useEffect(() => {
    return () => {
      uploadPickerItems.forEach((item) => URL.revokeObjectURL(item.src));
    };
  }, [uploadPickerItems]);

  useEffect(() => {
    if (imageFiles.length > 0) {
      return;
    }
    setThumbnailIndex(null);
    setShowThumbnailPicker(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imageFiles.length]);

  const galleryPreviewUrls = useMemo(() => extractUrlsFromText(galleryUrlsText), [galleryUrlsText]);
  const resolvedThumbnailIndex =
    uploadPickerItems.length > 0 ? Math.min(thumbnailIndex ?? 0, Math.max(0, uploadPickerItems.length - 1)) : 0;
  const uploadThumbnailSrc = uploadPickerItems[resolvedThumbnailIndex]?.src ?? "";
  const previewImage =
    uploadPickerItems.length > 0 ? uploadThumbnailSrc : thumbnailUrl || galleryPreviewUrls[0] || currentRoomType?.image || "";
  const previewTitle = form.nama_villa || currentRoomType?.shortName || translations.adminVillas.editorTitleAdd;
  const previewLocation = form.lokasi || currentRoomType?.location || "-";
  const previewStatus = (form.status || "tersedia") as VillaStatus;

  useEffect(() => {
    if (!isEditMode) {
      setLoadingData(false);
      return;
    }

    villaApi
      .detail(editingId)
      .then((response) => {
        const villa = response.villa;
        setForm({
          nama_villa: villa.nama_villa,
          lokasi: villa.lokasi,
          harga: String(villa.harga),
          max_guest: String(villa.max_guest),
          deskripsi: villa.deskripsi,
          status: villa.status,
        });
        setThumbnailUrl(villa.gambar || "");
        setThumbnailIndex(null);
        setGalleryUrlsText((villa.galeri || []).join("\n"));
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : translations.adminVillas.loadError);
        navigate("/admin/villas");
      })
      .finally(() => setLoadingData(false));
  }, [editingId, isEditMode, navigate, translations.adminVillas.loadError]);

  const loadStandardDoubleAssets = useCallback(async () => {
    if (standardDoubleAssetUrls.length === 0) {
      return;
    }

    try {
      const files = await Promise.all(
        standardDoubleAssetUrls.map(async (url, index) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Gagal mengambil asset");
          }
          const blob = await response.blob();
          return new File([blob], `standard-double-room-${index + 1}.avif`, { type: blob.type || "image/avif" });
        }),
      );

      setImageFiles(files);
      setThumbnailIndex(0);
      setThumbnailUrl("");
      toast.success(translations.adminVillas.standardDoubleAutofillSuccess);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminVillas.standardDoubleAutofillError);
    }
  }, [standardDoubleAssetUrls, translations.adminVillas.standardDoubleAutofillError, translations.adminVillas.standardDoubleAutofillSuccess]);

  useEffect(() => {
    if (!isStandardDoubleEditing) {
      return;
    }

    if (imageFiles.length > 0) {
      return;
    }

    if (galleryUrlsText.trim().length > 0) {
      return;
    }

    if (!isEditMode) {
      return;
    }

    loadStandardDoubleAssets();
  }, [galleryUrlsText, imageFiles.length, isEditMode, isStandardDoubleEditing, loadStandardDoubleAssets]);

  async function handleImportFromUrls() {
    if (!editingId) {
      toast.error(translations.adminVillas.importRequiresSavedRoom);
      return;
    }

    const urls = extractUrlsFromText(galleryUrlsText);

    if (urls.length === 0) {
      toast.error(translations.adminVillas.importFromUrlsError);
      return;
    }

    setImporting(true);
    try {
      const response = await villaApi.importGallery(editingId, urls);
      setGalleryUrlsText((response.villa.galeri || []).join("\n"));
      setThumbnailUrl(response.villa.gambar || "");
      setThumbnailIndex(null);
      setImageFiles([]);
      toast.success(translations.adminVillas.importFromUrlsSuccess);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminVillas.importFromUrlsError);
    } finally {
      setImporting(false);
    }
  }

  function handleRemoveImageAt(index: number) {
    setImageFiles((prev) => {
      if (index < 0 || index >= prev.length) {
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
    setThumbnailIndex((prev) => {
      if (prev === null) {
        return null;
      }
      if (index === prev) {
        return 0;
      }
      if (index < prev) {
        return Math.max(0, prev - 1);
      }
      return prev;
    });
    setShowThumbnailPicker(false);
  }

  function handleRemoveGalleryUrl(url: string) {
    const urls = extractUrlsFromText(galleryUrlsText);
    const nextUrls = urls.filter((item) => item !== url);
    setGalleryUrlsText(nextUrls.join("\n"));
    setShowThumbnailPicker(false);
    if (thumbnailUrl === url) {
      setThumbnailUrl(nextUrls[0] ?? "");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("nama_villa", form.nama_villa);
      payload.append("lokasi", form.lokasi);
      payload.append("harga", form.harga);
      payload.append("max_guest", form.max_guest);
      payload.append("deskripsi", form.deskripsi);
      payload.append("status", form.status);

      imageFiles.forEach((file) => payload.append("gambar", file));
      if (imageFiles.length > 0) {
        payload.append("thumbnail_index", String(resolvedThumbnailIndex));
      } else if (thumbnailUrl.trim().length > 0) {
        payload.append("gambar", thumbnailUrl.trim());
      }
      if (imageFiles.length === 0) {
        const urls = extractUrlsFromText(galleryUrlsText);
        if (urls.length > 0) {
          payload.append("galeri", JSON.stringify(urls));
        }
      }

      if (editingId) {
        await villaApi.update(editingId, payload);
        toast.success(translations.adminVillas.updateSuccess);
      } else {
        await villaApi.create(payload);
        toast.success(translations.adminVillas.createSuccess);
      }

      navigate("/admin/villas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminVillas.saveError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell section-space">
      <PageHeader
        eyebrow={translations.adminVillas.editorEyebrow}
        title={isEditMode ? translations.adminVillas.editorTitleEdit : translations.adminVillas.editorTitleAdd}
        description={translations.adminVillas.editorPageDescription}
        action={
          <Button asChild variant="outline">
            <Link to="/admin/villas">{translations.adminVillas.backToCollection}</Link>
          </Button>
        }
      />

      {loadingData ? (
        <LoadingState label={translations.adminVillas.loading} className="min-h-[320px]" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <ScrollReveal>
            <Card className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-[rgba(248,247,244,0.88)] shadow-[0_38px_90px_-54px_rgba(16,42,67,0.32)] backdrop-blur-md">
              <CardContent className="p-8 md:p-9">
                <div className="mb-6 rounded-[1.9rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.74),rgba(255,255,255,0.36))] p-6 shadow-[0_24px_56px_-42px_rgba(16,42,67,0.26)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5FA9C6]">{translations.adminVillas.editorSummaryTitle}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#102A43]">
                    {isEditMode ? translations.adminVillas.editorTitleEdit : translations.adminVillas.editorTitleAdd}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6B7280]">{translations.adminVillas.editorSummaryDescription}</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="rounded-[1.9rem] border border-[rgba(217,179,106,0.14)] bg-white/58 p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[rgba(169,215,232,0.18)] text-[#1F4E68]">
                        <BedDouble size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#102A43]">{translations.adminVillas.fields.name}</p>
                        <p className="text-sm text-[#6B7280]">{translations.adminVillas.description}</p>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.adminVillas.fields.name}</label>
                        <Input
                          value={form.nama_villa}
                          onChange={(event) => setForm((prev) => ({ ...prev, nama_villa: event.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.adminVillas.fields.location}</label>
                        <Input
                          value={form.lokasi}
                          onChange={(event) => setForm((prev) => ({ ...prev, lokasi: event.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.adminVillas.fields.price}</label>
                        <Input
                          type="number"
                          value={form.harga}
                          onChange={(event) => setForm((prev) => ({ ...prev, harga: event.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.adminVillas.fields.maxGuest}</label>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          value={form.max_guest}
                          onChange={(event) => setForm((prev) => ({ ...prev, max_guest: event.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.adminVillas.fields.status}</label>
                        <select
                          aria-label={translations.adminVillas.statusAria}
                          title={translations.adminVillas.statusAria}
                          value={form.status}
                          onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                          className="h-12 w-full rounded-[1.35rem] border border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.94)] px-4 text-sm text-[#102A43] shadow-[0_18px_34px_-26px_rgba(16,42,67,0.38)] focus:outline-none focus:ring-4 focus:ring-[rgba(95,169,198,0.16)]"
                        >
                          <option value="tersedia">{translations.app.status.tersedia}</option>
                          <option value="maintenance">{translations.app.status.maintenance}</option>
                          <option value="nonaktif">{translations.app.status.nonaktif}</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.adminVillas.fields.description}</label>
                      <Textarea
                        value={form.deskripsi}
                        onChange={(event) => setForm((prev) => ({ ...prev, deskripsi: event.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.9rem] border border-[rgba(217,179,106,0.14)] bg-white/58 p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[rgba(232,201,139,0.2)] text-[#8B6A25]">
                        <Images size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#102A43]">{translations.adminVillas.fields.image}</p>
                        <p className="text-sm text-[#6B7280]">{translations.adminVillas.upload.description}</p>
                      </div>
                    </div>

                    <div
                      className={
                        dragging
                          ? "group relative overflow-hidden rounded-[1.9rem] border border-[rgba(95,169,198,0.4)] bg-[rgba(169,215,232,0.16)] p-6 shadow-[0_26px_56px_-44px_rgba(16,42,67,0.24)]"
                          : "group relative overflow-hidden rounded-[1.9rem] border border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.9)] p-6 shadow-[0_26px_56px_-44px_rgba(16,42,67,0.22)]"
                      }
                      onDragEnter={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDragging(true);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDragging(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDragging(false);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDragging(false);
                        const files = Array.from(event.dataTransfer.files || []).filter((file) => file.type.startsWith("image/"));
                        if (files.length > 0) {
                          setImageFiles(files);
                          setThumbnailIndex(0);
                          setThumbnailUrl("");
                          setShowThumbnailPicker(false);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) => {
                          const files = Array.from(event.target.files || []);
                          setImageFiles(files);
                          if (files.length > 0) {
                            setThumbnailIndex(0);
                            setThumbnailUrl("");
                          }
                        }}
                      />

                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-[1.45rem] bg-[rgba(232,201,139,0.22)] text-[#102A43]">
                            <UploadCloud size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#102A43]">{translations.adminVillas.upload.title}</p>
                            <p className="mt-1 text-sm leading-6 text-[#6B7280]">{translations.adminVillas.upload.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <ImagePlus />
                            {translations.adminVillas.upload.browse}
                          </Button>
                          {imageFiles.length > 0 ? (
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => {
                                setImageFiles([]);
                                setThumbnailIndex(null);
                                setShowThumbnailPicker(false);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                            >
                              {translations.adminVillas.upload.clear}
                            </Button>
                          ) : null}
                        </div>
                      </div>

                      {imageFiles.length > 0 ? (
                        <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6">
                          {uploadPickerItems.map((item) => (
                            <div
                              key={item.key}
                              className="group relative aspect-square overflow-hidden rounded-[1.2rem] border border-white/70 bg-white/60 shadow-[0_18px_38px_-30px_rgba(16,42,67,0.18)]"
                            >
                              <img src={item.src} alt={item.name} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                aria-label="Hapus gambar"
                                title="Hapus gambar"
                                onClick={() => handleRemoveImageAt(item.index)}
                                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-[rgba(11,31,49,0.56)] text-white opacity-0 shadow-[0_18px_38px_-26px_rgba(5,18,31,0.85)] backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {isStandardDoubleEditing ? (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <Button type="button" variant="secondary" onClick={loadStandardDoubleAssets}>
                          {translations.adminVillas.standardDoubleAutofill}
                        </Button>
                        <p className="text-sm text-[#6B7280]">
                          {imageFiles.length > 0 ? translations.adminVillas.selectedUploads(imageFiles.length) : ""}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-[1.9rem] border border-[rgba(217,179,106,0.14)] bg-white/58 p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[rgba(16,42,67,0.08)] text-[#102A43]">
                        <FolderOpen size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#102A43]">{translations.adminVillas.fields.galleryUrls}</p>
                        <p className="text-sm text-[#6B7280]">{translations.adminVillas.importFromUrls}</p>
                      </div>
                    </div>

                    <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.adminVillas.fields.galleryUrls}</label>
                    <Textarea value={galleryUrlsText} onChange={(event) => setGalleryUrlsText(event.target.value)} />
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Button type="button" variant="secondary" disabled={!editingId || importing} onClick={handleImportFromUrls}>
                        {translations.adminVillas.importFromUrls}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? translations.adminVillas.saveLoading : isEditMode ? translations.adminVillas.saveChanges : translations.adminVillas.addVilla}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link to="/admin/villas">{translations.adminVillas.cancel}</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>

          <div className="space-y-5 xl:sticky xl:top-28">
            <ScrollReveal delay={0.08}>
              <Card className="overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(248,247,244,0.88)] shadow-[0_34px_86px_-56px_rgba(16,42,67,0.3)] backdrop-blur-md">
                <CardContent className="p-0">
                  <div className="relative aspect-[1.15/1] overflow-hidden">
                    {previewImage ? (
                      <img src={getUploadUrl(previewImage)} alt={previewTitle} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,rgba(16,42,67,0.18),rgba(169,215,232,0.16),rgba(232,201,139,0.2))]" />
                    )}
                    <div className="absolute inset-0 hero-overlay opacity-60" />
                    <div className="absolute left-4 top-4">
                      <StatusBadge status={previewStatus} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
                        {isEditMode ? translations.adminVillas.editorModeEdit : translations.adminVillas.editorModeCreate}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{previewTitle}</p>
                      <p className="mt-1 text-sm text-white/78">{previewLocation}</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <p className="text-sm leading-7 text-[#6B7280]">{translations.adminVillas.editorSummaryDescription}</p>

                    <div className="rounded-[1.4rem] border border-[rgba(217,179,106,0.14)] bg-white/65 px-4 py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                            {translations.adminVillas.fields.thumbnail}
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#102A43]">{translations.adminVillas.thumbnailHint}</p>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={uploadPickerItems.length === 0 && galleryPreviewUrls.length === 0}
                          onClick={() => setShowThumbnailPicker((prev) => !prev)}
                        >
                          {translations.adminVillas.changeThumbnail}
                        </Button>
                      </div>

                      {showThumbnailPicker ? (
                        <div className="mt-4 grid grid-cols-3 gap-3">
                          {uploadPickerItems.length > 0
                            ? uploadPickerItems.slice(0, 9).map((item) => {
                                const selected = item.index === resolvedThumbnailIndex;
                                return (
                                  <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => {
                                      setThumbnailIndex(item.index);
                                      setThumbnailUrl("");
                                      setShowThumbnailPicker(false);
                                    }}
                                    className={
                                      selected
                                        ? "relative aspect-square overflow-hidden rounded-[1.1rem] border border-[rgba(95,169,198,0.5)] shadow-[0_18px_38px_-30px_rgba(16,42,67,0.22)]"
                                        : "relative aspect-square overflow-hidden rounded-[1.1rem] border border-white/70 bg-white/60 shadow-[0_18px_38px_-30px_rgba(16,42,67,0.18)]"
                                    }
                                  >
                                    <img src={item.src} alt={item.name} className="h-full w-full object-cover" />
                                    {selected ? (
                                      <div className="absolute inset-0 bg-[rgba(95,169,198,0.16)] ring-2 ring-[rgba(95,169,198,0.52)]" />
                                    ) : null}
                                  </button>
                                );
                              })
                            : galleryPreviewUrls.slice(0, 9).map((url) => {
                                const selected = (thumbnailUrl || galleryPreviewUrls[0] || "") === url;
                                return (
                                  <div
                                    key={url}
                                    className={
                                      selected
                                        ? "relative aspect-square overflow-hidden rounded-[1.1rem] border border-[rgba(95,169,198,0.5)] shadow-[0_18px_38px_-30px_rgba(16,42,67,0.22)]"
                                        : "relative aspect-square overflow-hidden rounded-[1.1rem] border border-white/70 bg-white/60 shadow-[0_18px_38px_-30px_rgba(16,42,67,0.18)]"
                                    }
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setThumbnailUrl(url);
                                        setThumbnailIndex(null);
                                        setShowThumbnailPicker(false);
                                      }}
                                      className="h-full w-full"
                                    >
                                      <img src={getUploadUrl(url)} alt={previewTitle} className="h-full w-full object-cover" />
                                      {selected ? (
                                        <div className="absolute inset-0 bg-[rgba(95,169,198,0.16)] ring-2 ring-[rgba(95,169,198,0.52)]" />
                                      ) : null}
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="Hapus gambar"
                                      title="Hapus gambar"
                                      onClick={() => handleRemoveGalleryUrl(url)}
                                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-[rgba(11,31,49,0.56)] text-white shadow-[0_18px_38px_-26px_rgba(5,18,31,0.85)] backdrop-blur-md transition-opacity duration-200"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                );
                              })}
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-3">
                      <div className="flex items-center justify-between rounded-[1.4rem] border border-[rgba(217,179,106,0.14)] bg-white/65 px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">{translations.adminVillas.fields.image}</p>
                          <p className="mt-1 text-sm font-medium text-[#102A43]">{translations.adminVillas.selectedUploads(imageFiles.length)}</p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-[1.1rem] bg-[rgba(232,201,139,0.2)] text-[#8B6A25]">
                          <ImagePlus size={18} />
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-[1.4rem] border border-[rgba(217,179,106,0.14)] bg-white/65 px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">{translations.adminVillas.fields.galleryUrls}</p>
                          <p className="mt-1 text-sm font-medium text-[#102A43]">{translations.adminVillas.galleryAssetsCount(galleryPreviewUrls.length)}</p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-[1.1rem] bg-[rgba(169,215,232,0.18)] text-[#1F4E68]">
                          <Images size={18} />
                        </span>
                      </div>
                    </div>

                    {galleryPreviewUrls.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {galleryPreviewUrls.slice(0, 3).map((url) => (
                          <div
                            key={url}
                            className="aspect-square overflow-hidden rounded-[1.1rem] border border-white/70 bg-white/60 shadow-[0_18px_38px_-30px_rgba(16,42,67,0.18)]"
                          >
                            <img src={getUploadUrl(url)} alt={previewTitle} className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <Card className="rounded-[2rem] border border-white/70 bg-[rgba(248,247,244,0.88)] shadow-[0_34px_86px_-56px_rgba(16,42,67,0.3)] backdrop-blur-md">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-[rgba(95,169,198,0.16)] text-[#1F4E68]">
                      <Sparkles size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#102A43]">{translations.adminVillas.editorTipsTitle}</p>
                      <div className="mt-3 space-y-3 text-sm leading-7 text-[#6B7280]">
                        <p>{translations.adminVillas.editorTipOne}</p>
                        <p>{translations.adminVillas.editorTipTwo}</p>
                        <p>{translations.adminVillas.editorTipThree}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      )}
    </main>
  );
}
