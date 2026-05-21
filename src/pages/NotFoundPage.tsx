import { Link } from "react-router-dom";

import ScrollReveal from "@/components/app/ScrollReveal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFoundPage() {
  const { translations } = useLanguage();

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <ScrollReveal className="flex flex-col items-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#5FA9C6]">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#102A43]">{translations.notFound.title}</h1>
        <p className="mt-4 max-w-md text-[#6B7280]">{translations.notFound.description}</p>
        <Button asChild className="mt-8 rounded-full">
          <Link to="/">{translations.notFound.action}</Link>
        </Button>
      </ScrollReveal>
    </main>
  );
}
