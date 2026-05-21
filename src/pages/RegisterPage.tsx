import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import heroImage from "@/assets/hero-section-index.avif";
import ScrollReveal from "@/components/app/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApiError } from "@/lib/api";

interface RegisterFormState {
  name: string;
  phone: string;
  password: string;
}

interface RegisterFormErrors {
  name?: string;
  phone?: string;
  password?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { translations } = useLanguage();
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [loading, setLoading] = useState(false);

  function validateForm(values: RegisterFormState) {
    const nextErrors: RegisterFormErrors = {};

    if (values.name.trim().length < 3) {
      nextErrors.name = translations.register.validation.name;
    }

    const normalizedPhone = values.phone.replace(/[^\d+]/g, "").trim();
    const digits = normalizedPhone.replace(/[^\d]/g, "");
    if (digits.length < 9 || digits.length > 15) {
      nextErrors.phone = translations.register.validation.phone;
    }

    if (values.password.length < 8) {
      nextErrors.password = translations.register.validation.password;
    }

    return nextErrors;
  }

  function handleFieldChange<K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error(translations.register.validationTitle, {
        description: Object.values(nextErrors)[0] || translations.register.genericDescription,
      });
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      toast.success(translations.register.toastSuccess);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof ApiError && error.code === "NETWORK_ERROR") {
        toast.error(translations.register.networkTitle, {
          description: translations.register.networkDescription,
        });
      } else if (error instanceof ApiError && error.status === 400 && /(whatsapp|wa|phone|nomor)/i.test(error.message)) {
        setErrors((prev) => ({ ...prev, phone: error.message }));
        toast.error(translations.register.duplicateTitle, {
          description: error.message,
        });
      } else {
        toast.error(translations.register.errorTitle, {
          description: error instanceof Error ? error.message : translations.register.genericDescription,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell py-10 md:py-14">
      <div className="grid min-h-[calc(100vh-180px)] items-stretch gap-8 lg:grid-cols-[460px_1fr]">
        <ScrollReveal delay={0.08}>
          <Card className="my-auto w-full">
            <CardContent className="p-8 md:p-9">
              <p className="text-sm uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.register.eyebrow}</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#102A43]">{translations.register.title}</h1>
              <p className="mt-3 text-sm leading-6 text-[#6B7280]">{translations.register.description}</p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.register.fullName}</label>
                  <Input
                    value={form.name}
                    onChange={(event) => handleFieldChange("name", event.target.value)}
                    className={errors.name ? "border-red-300 bg-red-50/60 focus-visible:border-red-400 focus-visible:ring-red-100" : ""}
                    required
                  />
                  {errors.name ? <p className="mt-2 text-xs font-medium text-[#C45B5B]">{errors.name}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.register.phone}</label>
                  <Input
                    inputMode="tel"
                    value={form.phone}
                    onChange={(event) => handleFieldChange("phone", event.target.value)}
                    placeholder={translations.register.phonePlaceholder}
                    className={errors.phone ? "border-red-300 bg-red-50/60 focus-visible:border-red-400 focus-visible:ring-red-100" : ""}
                    required
                  />
                  {errors.phone ? <p className="mt-2 text-xs font-medium text-[#C45B5B]">{errors.phone}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#102A43]">{translations.register.password}</label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(event) => handleFieldChange("password", event.target.value)}
                    className={errors.password ? "border-red-300 bg-red-50/60 focus-visible:border-red-400 focus-visible:ring-red-100" : ""}
                    required
                  />
                  {errors.password ? <p className="mt-2 text-xs font-medium text-[#C45B5B]">{errors.password}</p> : null}
                </div>
                <Button type="submit" disabled={loading} className="h-12 w-full">
                  {loading ? translations.register.loading : translations.register.submit}
                </Button>
              </form>

              <p className="mt-6 border-t border-[rgba(217,179,106,0.12)] pt-5 text-sm text-[#6B7280]">
                {translations.register.existingAccount}{" "}
                <Link to="/login" className="font-semibold text-[#1F4E68]">
                  {translations.register.signIn}
                </Link>
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal className="relative hidden overflow-hidden rounded-[2.25rem] lg:block" distance={34}>
          <img src={heroImage} alt={translations.register.heroImageAlt} className="h-full w-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">{translations.register.heroTag}</p>
            <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight">
              {translations.register.heroTitle}
            </h2>
            <div className="mt-5 space-y-3">
              {translations.register.heroBullets.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
