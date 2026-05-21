import { useState } from "react";
import { Clock3, Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import ScrollReveal from "@/components/app/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { baleAurImages, baleAurNearbyAttractions, baleAurProperty } from "@/data/baleAurContent";
import heroKontakImage from "@/assets/hero-section-kontak.avif";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const { language } = useLanguage();
  const [form, setForm] = useState(initialForm);

  const copy =
    language === "id"
      ? {
          heroTag: "Reservasi Bale Aur Sembalun",
          heroTitle: "Kami Siap Menyambut Mountain Stay Anda",
          heroDescription:
            "Hubungi tim hospitality Bale Aur Sembalun untuk kebutuhan reservasi, pertanyaan kamar, atau bantuan stay dengan respons yang hangat dan profesional.",
          sectionEyebrow: "Bantuan Reservasi",
          sectionTitle: "Dukungan stay yang fokus pada pengalaman Bale Aur Sembalun",
          sectionDescription:
            "Mulai dari pertanyaan room type, rekomendasi waktu stay, hingga nearby attractions di Sembalun, kami menghadirkan komunikasi yang lebih tenang, jelas, dan terasa personal.",
          cards: [
            { title: "Lokasi", value: baleAurProperty.locationShort, detail: baleAurProperty.locationFull, icon: MapPin },
            { title: "Reservation Line", value: baleAurProperty.phone, detail: "Untuk konfirmasi stay, pertanyaan kamar, dan kebutuhan reservasi", icon: Phone },
            { title: "Email", value: baleAurProperty.email, detail: "Untuk permintaan informasi dan perencanaan mountain stay", icon: Mail },
            { title: "Check-in / Check-out", value: `${baleAurProperty.checkIn} / ${baleAurProperty.checkOut}`, detail: "Informasi waktu kedatangan dan kepulangan tamu Bale Aur", icon: Clock3 },
          ],
          formEyebrow: "Form Kontak Premium",
          formTitle: "Kirimi kami pesan",
          formDescription: "Isi form berikut untuk pertanyaan, reservasi, atau kebutuhan informasi stay Anda di Bale Aur Sembalun.",
          name: "Nama",
          email: "Email",
          subject: "Subjek",
          message: "Pesan",
          placeholders: {
            name: "Nama lengkap Anda",
            email: "Alamat email aktif",
            subject: "Contoh: Reservasi Bale Aur untuk akhir pekan",
            message: "Tulis kebutuhan atau pertanyaan Anda di sini...",
          },
          submit: "Kirim Pesan",
          toastTitle: "Pesan berhasil dikirim",
          toastDescription: "Tim hospitality Bale Aur akan menghubungi Anda secepat mungkin.",
          mapEyebrow: "Lokasi Kami",
          mapTitle: "Temukan Bale Aur di Sembalun Lawang, Lombok Timur",
          mapDescription: `Dekat dengan ${baleAurNearbyAttractions[0].name}, ${baleAurNearbyAttractions[1].name}, dan lanskap alam Sembalun yang cocok untuk healing stay.`,
          mapIframeTitle: "Lokasi Bale Aur Sembalun",
        }
      : {
          heroTag: "Bale Aur Sembalun Reservation",
          heroTitle: "We Are Ready To Welcome Your Mountain Stay",
          heroDescription:
            "Contact the Bale Aur Sembalun hospitality team for reservations, room enquiries, or stay assistance with a warm and professional response.",
          sectionEyebrow: "Reservation Assistance",
          sectionTitle: "Stay support focused on the Bale Aur Sembalun experience",
          sectionDescription:
            "From room-type enquiries and stay timing recommendations to nearby nature tips in Sembalun, we offer calmer, clearer, and more personal communication.",
          cards: [
            { title: "Location", value: baleAurProperty.locationShort, detail: baleAurProperty.locationFull, icon: MapPin },
            { title: "Reservation Line", value: baleAurProperty.phone, detail: "For stay confirmation, room enquiries, and reservation support", icon: Phone },
            { title: "Email", value: baleAurProperty.email, detail: "For information requests and mountain-stay planning", icon: Mail },
            { title: "Check-in / Check-out", value: `${baleAurProperty.checkIn} / ${baleAurProperty.checkOut}`, detail: "Arrival and departure schedule for Bale Aur guests", icon: Clock3 },
          ],
          formEyebrow: "Luxury Contact Form",
          formTitle: "Send us a message",
          formDescription: "Complete the form for enquiries, reservations, or Bale Aur Sembalun stay information.",
          name: "Name",
          email: "Email",
          subject: "Subject",
          message: "Message",
          placeholders: {
            name: "Your full name",
            email: "Your active email address",
            subject: "Example: Weekend Bale Aur reservation",
            message: "Write your request or question here...",
          },
          submit: "Send Message",
          toastTitle: "Message sent successfully",
          toastDescription: "The Bale Aur hospitality team will get back to you as soon as possible.",
          mapEyebrow: "Our Location",
          mapTitle: "Find Bale Aur in Sembalun Lawang, East Lombok",
          mapDescription: `Close to ${baleAurNearbyAttractions[0].name}, ${baleAurNearbyAttractions[1].name}, and the natural landscape that defines the Sembalun stay experience.`,
          mapIframeTitle: "Bale Aur Sembalun location",
        };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(copy.toastTitle, { description: copy.toastDescription });
    setForm(initialForm);
  }

  return (
    <main>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] min-h-[82vh] w-screen overflow-hidden bg-[#102A43]">
        <div className="absolute inset-0">
          <img src={heroKontakImage} alt={baleAurProperty.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(16,42,67,0.9)_0%,rgba(16,42,67,0.7)_42%,rgba(31,78,104,0.34)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,201,139,0.22),transparent_34%)]" />
        </div>
        <div className="app-shell relative flex min-h-[82vh] items-center py-20 md:py-24">
          <ScrollReveal className="max-w-4xl" distance={42}>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#F6E7C1] backdrop-blur-md">
              <Sparkles size={14} />
              {copy.heroTag}
            </div>
            <h1 className="mt-7 text-5xl font-semibold leading-[0.95] text-white md:text-6xl xl:text-7xl">{copy.heroTitle}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 md:text-lg">{copy.heroDescription}</p>
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
        <ScrollReveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#5FA9C6]">{copy.sectionEyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#102A43] md:text-5xl">{copy.sectionTitle}</h2>
          <p className="mt-5 text-base leading-8 text-[#6B7280]">{copy.sectionDescription}</p>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {copy.cards.map((item, index) => (
              <ScrollReveal key={item.title} delay={0.04 + index * 0.03}>
                <div className="group h-full overflow-hidden rounded-[2rem] border border-[rgba(214,194,159,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,247,244,0.88))] p-6 shadow-[0_24px_70px_-46px_rgba(16,42,67,0.24)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_82px_-46px_rgba(16,42,67,0.3)]">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(246,231,193,0.56))] text-[#102A43] shadow-[0_18px_30px_-20px_rgba(16,42,67,0.18)]">
                    <item.icon size={22} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5FA9C6]">{item.title}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#102A43]">{item.value}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">{item.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.08}>
            <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(214,194,159,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,247,244,0.9))] p-7 shadow-[0_30px_80px_-50px_rgba(16,42,67,0.28)] md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#5FA9C6]">{copy.formEyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#102A43] md:text-4xl">{copy.formTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-[#6B7280]">{copy.formDescription}</p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#102A43]">{copy.name}</label>
                    <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder={copy.placeholders.name} required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#102A43]">{copy.email}</label>
                    <Input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder={copy.placeholders.email} required />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#102A43]">{copy.subject}</label>
                  <Input value={form.subject} onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))} placeholder={copy.placeholders.subject} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#102A43]">{copy.message}</label>
                  <Textarea value={form.message} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} placeholder={copy.placeholders.message} required />
                </div>
                <Button type="submit" className="text-white hover:text-white">
                  {copy.submit}
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="app-shell pb-24">
        <ScrollReveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#5FA9C6]">{copy.mapEyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#102A43] md:text-5xl">{copy.mapTitle}</h2>
          <p className="mt-5 text-base leading-8 text-[#6B7280]">{copy.mapDescription}</p>
        </ScrollReveal>
        <ScrollReveal className="mt-10" delay={0.08}>
          <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(214,194,159,0.2)] bg-white/70 p-2 shadow-[0_28px_76px_-48px_rgba(16,42,67,0.26)]">
            <iframe
              title={copy.mapIframeTitle}
              src={baleAurProperty.mapEmbedUrl}
              className="h-[420px] w-full rounded-[1.8rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
