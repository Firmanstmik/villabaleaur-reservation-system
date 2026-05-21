import { useEffect, useMemo, useState } from "react";
import { MapPinned, Search, Sparkles } from "lucide-react";

import EmptyState from "@/components/app/EmptyState";
import LoadingState from "@/components/app/LoadingState";
import ScrollReveal from "@/components/app/ScrollReveal";
import VillaCard from "@/components/app/VillaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { baleAurImages, baleAurProperty } from "@/data/baleAurContent";
import { villaApi } from "@/lib/api";
import type { Villa } from "@/types/app";
import heroKamarImage from "@/assets/hero-section-kamar.avif";

export default function VillasPage() {
  const { translations } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    villaApi
      .list()
      .then((response) => setVillas(response?.villas || []))
      .catch(() => setVillas([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredVillas = useMemo(() => {
    const search = keyword.toLowerCase();

    return (villas || []).filter((villa) => {
      return (
        villa.nama_villa.toLowerCase().includes(search) ||
        villa.lokasi.toLowerCase().includes(search) ||
        villa.status.toLowerCase().includes(search)
      );
    });
  }, [keyword, villas]);

  return (
    <main>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] min-h-[82vh] w-screen overflow-hidden bg-[#102A43]">
        <div className="absolute inset-0">
          <img src={heroKamarImage} alt={baleAurProperty.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(16,42,67,0.9)_0%,rgba(16,42,67,0.7)_42%,rgba(31,78,104,0.34)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,201,139,0.22),transparent_34%)]" />
        </div>
        <div className="app-shell relative flex min-h-[82vh] items-center py-20 md:py-24">
          <ScrollReveal className="max-w-4xl" distance={42}>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#F6E7C1] backdrop-blur-md">
              <Sparkles size={14} />
              {translations.villasPage.eyebrow}
            </div>
            <h1 className="mt-7 text-5xl font-semibold leading-[0.95] text-white md:text-6xl xl:text-7xl">{translations.villasPage.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 md:text-lg">{translations.villasPage.description}</p>
          </ScrollReveal>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] text-[#F8F7F4]">
          <svg viewBox="0 0 1440 160" className="h-[92px] w-full md:h-[118px]" preserveAspectRatio="none" aria-hidden="true">
            <path
              fill="currentColor"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,53.3C672,53,768,75,864,96C960,117,1056,139,1152,138.7C1248,139,1344,117,1392,106.7L1440,96L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
            />
          </svg>
        </div>
      </section>

      <section className="app-shell section-space">

        <ScrollReveal className="mb-8">
        <div className="soft-panel flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#6B7280]">{translations.villasPage.quickSearch}</p>
            <p className="text-sm text-[#6B7280]">{translations.villasPage.quickSearchDescription}</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={translations.villasPage.searchPlaceholder}
              className="pl-11"
            />
          </div>
        </div>
        </ScrollReveal>

        <ScrollReveal className="mb-6" delay={0.06}>
        <div className="grid gap-4 rounded-[1.7rem] border border-[rgba(217,179,106,0.16)] bg-[rgba(248,247,244,0.82)] px-5 py-4 text-sm text-[#6B7280] shadow-[0_18px_30px_-24px_rgba(16,42,67,0.24)] md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(232,201,139,0.22)] text-[#102A43]">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">{translations.villasPage.stats.shown}</p>
              <p className="mt-1 font-semibold text-[#102A43]">{translations.villasPage.stats.shownValue(filteredVillas.length)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(169,215,232,0.18)] text-[#1F4E68]">
              <MapPinned size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">{translations.villasPage.stats.destination}</p>
              <p className="mt-1 font-semibold text-[#102A43]">{translations.villasPage.stats.destinationValue}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(246,231,193,0.42)] text-[#7A5D21]">
              <Search size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">{translations.villasPage.stats.filter}</p>
              <p className="mt-1 font-semibold text-[#102A43]">{translations.villasPage.stats.filterValue}</p>
            </div>
          </div>
        </div>
        </ScrollReveal>

        {loading ? (
          <LoadingState label={translations.villasPage.loading} />
        ) : filteredVillas.length === 0 ? (
          <EmptyState
            title={translations.villasPage.emptyTitle}
            description={translations.villasPage.emptyDescription}
            action={
              <Button variant="outline" onClick={() => setKeyword("")}>
                {translations.villasPage.reset}
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredVillas.map((villa) => (
              <ScrollReveal key={villa.id} delay={0.06}>
                <VillaCard villa={villa} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
