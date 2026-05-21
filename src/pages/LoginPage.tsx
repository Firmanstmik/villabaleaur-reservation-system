import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import heroImage from "@/assets/hero-section-kamar.avif";
import ScrollReveal from "@/components/app/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { translations } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await login({ phone, password });
      toast.success(translations.login.toastSuccess);
      navigate(user.role === "admin" ? "/admin" : location.state?.from || "/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.login.toastError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell py-10 md:py-14">
      <div className="grid min-h-[calc(100vh-180px)] items-stretch gap-8 lg:grid-cols-[1fr_460px]">
        <ScrollReveal className="relative hidden overflow-hidden rounded-[2.25rem] lg:block" distance={34}>
          <img src={heroImage} alt={translations.login.heroImageAlt} className="h-full w-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">{translations.login.heroTag}</p>
            <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight">
              {translations.login.heroTitle}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              {translations.login.heroDescription}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <Card className="my-auto w-full">
            <CardContent className="p-8 md:p-9">
              <p className="text-sm uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.login.eyebrow}</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#102A43]">{translations.login.title}</h1>
              <p className="mt-3 text-sm leading-6 text-[#6B7280]">{translations.login.description}</p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.login.phone}</label>
                  <Input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    inputMode="tel"
                    placeholder={translations.login.phonePlaceholder}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.login.password}</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="h-12 w-full">
                  {loading ? translations.login.loading : translations.login.submit}
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-[rgba(217,179,106,0.12)] pt-5 text-sm text-[#6B7280]">
                <span>{translations.login.newHere}</span>
                <Link to="/register" className="inline-flex items-center gap-2 font-semibold text-[#1F4E68]">
                  {translations.login.createAccount}
                  <ArrowRight size={16} className="text-[#6B7280]" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </main>
  );
}
