import { ArrowRight, Compass, Gem, Globe2, HeartHandshake, MapPinned, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { Link } from "react-router-dom";

import aboutHeroImage from "@/assets/hero-section-index.avif";
import aboutCabinImage from "@/assets/hero-section-kamar.avif";
import aboutNatureImage from "@/assets/hero-section-kontak.avif";
import aboutInteriorImage from "@/assets/hero section bale aur.avif";
import ScrollReveal from "@/components/app/ScrollReveal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { baleAurFacilities, baleAurNearbyAttractions, baleAurProperty } from "@/data/baleAurContent";
import { getUploadUrl } from "@/lib/api";

export default function AboutPage() {
  const { language, translations } = useLanguage();

  const copy =
    language === "id"
      ? {
          heroTag: "Tentang Bale Aur Sembalun",
          heroTitle: ["Luxury Mountain", "Stay Experience"],
          heroDescription:
            "Bale Aur Sembalun menghadirkan pengalaman menginap pegunungan dengan udara sejuk, kabin kayu modern, dan panorama alam Sembalun yang terasa tenang sejak pandangan pertama.",
          cta: "Lihat Pilihan Kamar",
          chip: "Nature Hospitality Sembalun",
          galleryAlt: "Galeri Bale Aur Sembalun",
          story: [
            {
              eyebrow: "Tentang Properti",
              title: "Mountain stay yang hangat dengan nuansa kayu natural",
              description:
                "Bale Aur Sembalun dirancang sebagai single luxury property di Sembalun Lawang dengan karakter modern mountain cabin, suasana alami Lombok, dan pengalaman stay yang sederhana namun refined.",
            },
            {
              eyebrow: "Filosofi Stay",
              title: "Healing retreat yang dekat dengan alam dan ritme Sembalun",
              description:
                "Setiap pagi dimulai dengan udara dingin, sunrise pegunungan, dan suasana tenang yang cocok untuk healing, staycation, serta momen istirahat yang terasa lebih personal.",
            },
            {
              eyebrow: "Pengalaman Tamu",
              title: "Kenyamanan esensial dengan view pegunungan yang menenangkan",
              description:
                "Setiap kamar menghadirkan private bathroom, seating area, balcony atau terrace, serta mountain view yang membuat pengalaman menginap di Bale Aur terasa natural, nyaman, dan memorable.",
            },
          ],
          featuresEyebrow: "Kenapa Memilih Bale Aur",
          featuresTitle: "Detail stay yang dirancang untuk mountain retreat yang tenang",
          features: [
            { title: "Mountain View", description: "Panorama Sembalun yang terbuka untuk sunrise, kabut pagi, dan suasana pegunungan." },
            { title: "Lokasi Strategis", description: "Berada di Jalan Raya Sembalun Lawang dan dekat dengan atraksi alam populer." },
            { title: "Reservasi Ringkas", description: "Alur booking single-property yang lebih fokus dan mudah dipahami." },
            { title: "Kenyamanan Natural", description: "Nuansa kayu, udara sejuk, dan ruang duduk yang terasa santai." },
            { title: "Cocok untuk Healing", description: "Ideal untuk staycation tenang, perjalanan alam, dan istirahat yang lebih mindful." },
            { title: "Hospitality Hangat", description: "Pelayanan yang terasa sederhana, ramah, dan dekat dengan karakter lokal." },
          ],
          stats: ["Tipe Kamar", "Review", "Atraksi Alam", "Jarak Bandara"],
          galleryEyebrow: "Galeri Bale Aur",
          galleryTitle: "Visual mountain cabin yang menangkap suasana pagi dan tenangnya Sembalun",
          finalEyebrow: "Undangan Mountain Stay",
          finalTitle: "Rencanakan stay Anda di Bale Aur Sembalun",
          finalDescription:
            "Jelajahi pilihan kamar Bale Aur Sembalun untuk menikmati mountain stay yang hangat, alami, dan nyaman di Lombok Timur.",
          finalButton: "Lihat Pilihan Kamar",
        }
      : {
          heroTag: "About Bale Aur Sembalun",
          heroTitle: ["Luxury Mountain", "Stay Experience"],
          heroDescription:
            "Bale Aur Sembalun brings together a mountain stay atmosphere, cool air, modern timber cabins, and panoramic Sembalun scenery in one calm experience.",
          cta: "View Room Options",
          chip: "Sembalun Nature Hospitality",
          galleryAlt: "Bale Aur Sembalun gallery",
          story: [
            {
              eyebrow: "About The Property",
              title: "A warm mountain stay with natural timber character",
              description:
                "Bale Aur Sembalun is shaped as a single luxury property in Sembalun Lawang with a modern mountain-cabin identity, authentic Lombok atmosphere, and a stay experience that feels simple yet refined.",
            },
            {
              eyebrow: "Stay Philosophy",
              title: "A healing retreat close to nature and the rhythm of Sembalun",
              description:
                "Each morning is framed by cool air, mountain sunrise, and a quiet atmosphere that suits healing trips, staycations, and slower moments of rest.",
            },
            {
              eyebrow: "Guest Experience",
              title: "Essential comfort with calming mountain views",
              description:
                "Every room includes a private bathroom, seating area, balcony or terrace, and mountain-facing views that make the Bale Aur stay feel natural, comfortable, and memorable.",
            },
          ],
          featuresEyebrow: "Why Choose Bale Aur",
          featuresTitle: "Stay details crafted for a calmer mountain retreat",
          features: [
            { title: "Mountain View", description: "Open Sembalun panoramas for sunrise, misty mornings, and a true mountain ambience." },
            { title: "Strategic Location", description: "Set on Jalan Raya Sembalun Lawang near some of the area's best nature spots." },
            { title: "Focused Reservation", description: "A single-property booking flow that feels clearer and easier to follow." },
            { title: "Natural Comfort", description: "Timber ambience, cool air, and seating areas designed for slower living." },
            { title: "Healing Friendly", description: "Ideal for calm staycations, nature trips, and restorative downtime." },
            { title: "Warm Hospitality", description: "Simple, attentive service with a grounded local feel." },
          ],
          stats: ["Room Types", "Reviews", "Nature Spots", "Airport Distance"],
          galleryEyebrow: "Bale Aur Gallery",
          galleryTitle: "Mountain-cabin visuals that capture the calm mornings of Sembalun",
          finalEyebrow: "Mountain Stay Invitation",
          finalTitle: "Plan your stay at Bale Aur Sembalun",
          finalDescription:
            "Explore Bale Aur Sembalun room options for a warm, natural, and comfortable mountain stay in East Lombok.",
          finalButton: "View Room Options",
        };

  const storySections = [
    {
      eyebrow: copy.story[0].eyebrow,
      title: copy.story[0].title,
      description: copy.story[0].description,
      image: aboutHeroImage,
    },
    {
      eyebrow: copy.story[1].eyebrow,
      title: copy.story[1].title,
      description: copy.story[1].description,
      image: aboutCabinImage,
    },
    {
      eyebrow: copy.story[2].eyebrow,
      title: copy.story[2].title,
      description: copy.story[2].description,
      image: aboutInteriorImage,
    },
  ];

  const featureCards = [
    { ...copy.features[0], icon: Gem },
    { ...copy.features[1], icon: MapPinned },
    { ...copy.features[2], icon: Compass },
    { ...copy.features[3], icon: Waves },
    { ...copy.features[4], icon: ShieldCheck },
    { ...copy.features[5], icon: HeartHandshake },
  ];

  const stats = [
    { value: "4", label: copy.stats[0] },
    { value: "116+", label: copy.stats[1] },
    { value: String(baleAurNearbyAttractions.length), label: copy.stats[2] },
    { value: "74 km", label: copy.stats[3] },
  ];

  const gallery = [
    aboutHeroImage,
    aboutCabinImage,
    aboutInteriorImage,
    aboutNatureImage,
    getUploadUrl("/uploads/1779230330176-463754696.jpg"),
    getUploadUrl("/uploads/1779230330173-248484231.jpg"),
  ];

  return (
    <main>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] min-h-[88vh] w-screen overflow-hidden bg-[#102A43]">
        <div className="absolute inset-0">
          <img src={aboutHeroImage} alt={translations.app.brandName} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(16,42,67,0.9)_0%,rgba(16,42,67,0.68)_42%,rgba(31,78,104,0.32)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,201,139,0.22),transparent_34%)]" />
        </div>
        <div className="app-shell relative flex min-h-[88vh] items-center py-20 md:py-24">
          <ScrollReveal className="max-w-4xl" distance={42}>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#F6E7C1] backdrop-blur-md">
              <Sparkles size={14} />
              {copy.heroTag}
            </div>
            <h1 className="mt-7 text-5xl font-semibold leading-[0.95] text-white md:text-6xl xl:text-7xl">
              {copy.heroTitle[0]}
              <br />
              {copy.heroTitle[1]}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
              {copy.heroDescription}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild className="text-white hover:text-white">
                <Link to="/villas">
                  {copy.cta}
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/10 px-5 py-3 text-sm text-white/78 backdrop-blur-md">
                <Globe2 size={16} className="text-[#E8C98B]" />
                {copy.chip}
              </div>
            </div>
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

      <section className="app-shell section-space space-y-20">
        {storySections.map((section, index) => (
          <section key={section.title} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <ScrollReveal className={index % 2 === 1 ? "lg:order-2" : ""}>
              <div className="relative overflow-hidden rounded-[2.2rem] border border-[rgba(214,194,159,0.2)] bg-white/72 p-2 shadow-[0_30px_80px_-48px_rgba(16,42,67,0.28)]">
                <img src={section.image} alt={section.title} className="h-[340px] w-full rounded-[1.8rem] object-cover md:h-[460px]" />
              </div>
            </ScrollReveal>
            <ScrollReveal className={index % 2 === 1 ? "lg:order-1" : ""} delay={0.08}>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#5FA9C6]">{section.eyebrow}</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#102A43] md:text-5xl">{section.title}</h2>
                <p className="mt-6 text-base leading-8 text-[#6B7280]">{section.description}</p>
              </div>
            </ScrollReveal>
          </section>
        ))}
      </section>

      <section className="app-shell pb-20">
        <ScrollReveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#5FA9C6]">{copy.featuresEyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#102A43] md:text-5xl">{copy.featuresTitle}</h2>
        </ScrollReveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((item, index) => (
            <ScrollReveal key={item.title} delay={0.04 + index * 0.03}>
              <div className="group relative overflow-hidden rounded-[2rem] border border-[rgba(214,194,159,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,247,244,0.88))] p-6 shadow-[0_24px_70px_-46px_rgba(16,42,67,0.24)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_82px_-46px_rgba(16,42,67,0.3)]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(246,231,193,0.56))] text-[#102A43] shadow-[0_18px_30px_-20px_rgba(16,42,67,0.18)]">
                  <item.icon size={22} />
                </div>
                <h3 className="text-2xl font-semibold text-[#102A43]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6B7280]">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="app-shell pb-20">
        <div className="grid gap-5 rounded-[2.2rem] border border-[rgba(214,194,159,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,247,244,0.9))] p-8 shadow-[0_28px_76px_-48px_rgba(16,42,67,0.26)] md:grid-cols-2 xl:grid-cols-4 md:p-10">
          {stats.map((item, index) => (
            <ScrollReveal key={item.label} delay={0.04 + index * 0.03}>
              <div className="rounded-[1.7rem] border border-white/75 bg-white/62 p-6">
                <p className="text-4xl font-semibold tracking-[-0.05em] text-[#102A43] md:text-5xl">{item.value}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.28em] text-[#6B7280]">{item.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="app-shell pb-20">
        <ScrollReveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#5FA9C6]">{copy.galleryEyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#102A43] md:text-5xl">{copy.galleryTitle}</h2>
        </ScrollReveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gallery.map((image, index) => (
            <ScrollReveal key={`${image}-${index}`} delay={0.04 + index * 0.03}>
              <div className={index === 0 || index === 3 ? "xl:col-span-2" : ""}>
                <div className="group relative overflow-hidden rounded-[2rem] border border-[rgba(214,194,159,0.2)] bg-white/72 p-2 shadow-[0_24px_70px_-46px_rgba(16,42,67,0.24)]">
                  <img
                    src={image}
                    alt={copy.galleryAlt}
                    className={index === 0 || index === 3 ? "h-[360px] w-full rounded-[1.6rem] object-cover transition-transform duration-700 group-hover:scale-[1.03]" : "h-[360px] w-full rounded-[1.6rem] object-cover transition-transform duration-700 group-hover:scale-[1.03]"}
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="app-shell pb-24">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[2.4rem] border border-[rgba(214,194,159,0.2)] bg-[linear-gradient(135deg,rgba(16,42,67,0.98),rgba(31,78,104,0.92))] px-8 py-14 text-center text-white shadow-[0_36px_90px_-48px_rgba(16,42,67,0.42)] md:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,201,139,0.18),transparent_32%)]" />
            <div className="relative mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#F6E7C1]">{copy.finalEyebrow}</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">{copy.finalTitle}</h2>
              <p className="mt-5 text-base leading-8 text-white/76">
                {copy.finalDescription}
              </p>
              <Button asChild className="mt-8 text-white hover:text-white">
                <Link to="/villas">
                  {copy.finalButton}
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
