import { useEffect, useMemo, useState } from "react";
import { KeyRound, LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function AdminProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const { translations } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
    setEmail(user?.email ?? "");
  }, [user?.email, user?.name, user?.phone]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      name.trim() !== (user.name ?? "") ||
      phone.trim() !== (user.phone ?? "") ||
      email.trim() !== (user.email ?? "") ||
      password.trim().length > 0
    );
  }, [email, name, password, phone, user]);

  async function handleSave() {
    if (!user || saving) return;
    setSaving(true);
    try {
      await adminApi.updateUser(user.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim().length > 0 ? password : undefined,
      });
      await refreshUser();
      setPassword("");
      toast.success(translations.adminProfile.updateSuccess);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminProfile.updateError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="app-shell section-space">
      <PageHeader
        eyebrow={translations.adminProfile.eyebrow}
        title={translations.adminProfile.title}
        description={translations.adminProfile.description}
      />

      <ScrollReveal>
        <Card className="max-w-5xl overflow-hidden rounded-[2.25rem] border border-white/70 bg-[rgba(248,247,244,0.86)] shadow-[0_38px_90px_-54px_rgba(16,42,67,0.32)] backdrop-blur-md">
          <CardContent className="space-y-8 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.7rem] bg-[rgba(16,42,67,0.92)] text-[#E8C98B] shadow-[0_24px_60px_-38px_rgba(5,18,31,0.86)]">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.adminProfile.accessEyebrow}</p>
                  <p className="mt-1 text-2xl font-semibold text-[#102A43]">{user?.name}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{user?.phone ?? user?.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link to="/admin" aria-label={translations.adminProfile.backToDashboard} title={translations.adminProfile.backToDashboard}>
                    <UserCircle2 />
                    {translations.adminProfile.backToDashboard}
                  </Link>
                </Button>
                <Button variant="secondary" onClick={logout}>
                  <LogOut />
                  {translations.adminProfile.logout}
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[rgba(214,194,159,0.22)] bg-white/70 p-6 shadow-[0_30px_80px_-56px_rgba(16,42,67,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.adminProfile.editEyebrow}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#102A43]">{translations.adminProfile.editTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6B7280]">{translations.adminProfile.editDescription}</p>
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminProfile.form.name}</p>
                  <div className="mt-2">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={translations.adminProfile.form.namePlaceholder} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminProfile.form.phone}</p>
                  <div className="mt-2">
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={translations.adminProfile.form.phonePlaceholder} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminProfile.form.email}</p>
                  <div className="mt-2">
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={translations.adminProfile.form.emailPlaceholder} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminProfile.form.password}</p>
                  <div className="mt-2">
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={translations.adminProfile.form.passwordPlaceholder} type="password" />
                  </div>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[#6B7280]">{translations.adminProfile.form.note}</p>
                <Button type="button" onClick={handleSave} disabled={!hasChanges || saving}>
                  {translations.adminProfile.form.submit}
                </Button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[1.7rem] border border-white/60 bg-[rgba(246,231,193,0.42)] p-6 shadow-[0_22px_52px_-44px_rgba(16,42,67,0.18)]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">
                  <ShieldCheck size={15} className="text-[#1F4E68]" />
                  {translations.adminProfile.fields.role}
                </div>
                <p className="mt-3 text-xl font-semibold capitalize text-[#102A43]">{user?.role}</p>
              </div>

              <div className="rounded-[1.7rem] border border-white/60 bg-[rgba(169,215,232,0.18)] p-6 shadow-[0_22px_52px_-44px_rgba(16,42,67,0.18)]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">
                  <KeyRound size={15} className="text-[#1F4E68]" />
                  {translations.adminProfile.fields.created}
                </div>
                <p className="mt-3 text-xl font-semibold text-[#102A43]">{user?.created_at ? formatDate(user.created_at) : "-"}</p>
              </div>

              <div className="rounded-[1.7rem] border border-white/60 bg-[rgba(248,247,244,0.82)] p-6 shadow-[0_22px_52px_-44px_rgba(16,42,67,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminProfile.fields.security}</p>
                <p className="mt-3 text-sm leading-7 text-[#6B7280]">{translations.adminProfile.securityNote}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </main>
  );
}
