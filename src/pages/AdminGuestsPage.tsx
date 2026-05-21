import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Phone, UserCircle2, Users } from "lucide-react";
import { toast } from "sonner";

import EmptyState from "@/components/app/EmptyState";
import LoadingState from "@/components/app/LoadingState";
import PageHeader from "@/components/app/PageHeader";
import ScrollReveal from "@/components/app/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { AdminUser } from "@/types/app";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
  return `${first}${second}`.toUpperCase();
}

export default function AdminGuestsPage() {
  const { translations } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<"user" | "admin">("user");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"user" | "admin">("user");
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.users(roleFilter);
      setUsers(response.users);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminGuests.errorLoad);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, translations.adminGuests.errorLoad]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalGuests = users.length;
  const totalBookings = useMemo(() => users.reduce((acc, guest) => acc + (guest.totalBooking || 0), 0), [users]);

  async function handleDelete(guest: AdminUser) {
    if (guest.role !== "user") {
      toast.error(translations.adminGuests.deleteAdminBlocked);
      return;
    }

    const confirmText = translations.adminGuests.deleteConfirm(guest.name);
    if (!window.confirm(confirmText)) {
      return;
    }

    try {
      await adminApi.deleteGuest(guest.id);
      toast.success(translations.adminGuests.deleteSuccess);
      await fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminGuests.deleteError);
    }
  }

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await adminApi.createUser({
        name: formName,
        phone: formPhone,
        email: formEmail.trim().length > 0 ? formEmail.trim() : null,
        password: formPassword,
        role: formRole,
      });
      toast.success(translations.adminGuests.createSuccess);
      setFormName("");
      setFormPhone("");
      setFormEmail("");
      setFormPassword("");
      const nextRole = formRole;
      setRoleFilter(nextRole);
      if (nextRole === roleFilter) {
        await fetchUsers();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : translations.adminGuests.createError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app-shell section-space">
      <PageHeader
        eyebrow={translations.adminGuests.eyebrow}
        title={translations.adminGuests.title}
        description={translations.adminGuests.description(totalGuests, totalBookings)}
      />

      <ScrollReveal>
        <Card className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-[rgba(248,247,244,0.84)] shadow-[0_38px_90px_-54px_rgba(16,42,67,0.32)] backdrop-blur-md">
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-4 border-b border-[rgba(217,179,106,0.12)] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1.3rem] bg-[rgba(232,201,139,0.22)] text-[#102A43] shadow-[0_20px_50px_-34px_rgba(217,179,106,0.9)]">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5FA9C6]">{translations.adminGuests.collectionEyebrow}</p>
                  <p className="mt-1 text-lg font-semibold text-[#102A43]">{translations.adminGuests.collectionTitle}</p>
                </div>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-2 rounded-full border border-[rgba(214,194,159,0.22)] bg-white/60 p-1 shadow-[0_18px_34px_-26px_rgba(16,42,67,0.22)]">
                  <button
                    type="button"
                    onClick={() => setRoleFilter("user")}
                    className={
                      roleFilter === "user"
                        ? "rounded-full bg-[#102A43] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#F6E7C1]"
                        : "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280] hover:text-[#102A43]"
                    }
                  >
                    {translations.adminGuests.filters.users}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter("admin")}
                    className={
                      roleFilter === "admin"
                        ? "rounded-full bg-[#102A43] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#F6E7C1]"
                        : "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280] hover:text-[#102A43]"
                    }
                  >
                    {translations.adminGuests.filters.admins}
                  </button>
                </div>
                <div className="rounded-[1.3rem] bg-[rgba(246,231,193,0.46)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminGuests.kpis.totalGuests}</p>
                  <p className="mt-1 text-xl font-semibold text-[#102A43]">{totalGuests}</p>
                </div>
                <div className="rounded-[1.3rem] bg-[rgba(169,215,232,0.18)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminGuests.kpis.totalBookings}</p>
                  <p className="mt-1 text-xl font-semibold text-[#102A43]">{totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-[rgba(217,179,106,0.12)] px-6 py-6">
              <form onSubmit={handleCreateUser} className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr_0.8fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminGuests.form.name}</p>
                  <div className="mt-2">
                    <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={translations.adminGuests.form.namePlaceholder} required />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminGuests.form.phone}</p>
                  <div className="mt-2">
                    <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder={translations.adminGuests.form.phonePlaceholder} required />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminGuests.form.email}</p>
                  <div className="mt-2">
                    <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder={translations.adminGuests.form.emailPlaceholder} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminGuests.form.role}</p>
                  <div className="mt-2">
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value === "admin" ? "admin" : "user")}
                      className="flex h-12 w-full rounded-[1.35rem] border border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.94)] px-4 py-3 text-sm text-[#102A43] shadow-[0_18px_34px_-26px_rgba(16,42,67,0.38)] transition-all duration-300 focus-visible:border-[rgba(95,169,198,0.48)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(95,169,198,0.16)]"
                      aria-label={translations.adminGuests.form.role}
                    >
                      <option value="user">{translations.adminGuests.form.roleUser}</option>
                      <option value="admin">{translations.adminGuests.form.roleAdmin}</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">{translations.adminGuests.form.password}</p>
                  <Input
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={translations.adminGuests.form.passwordPlaceholder}
                    required
                    type="password"
                  />
                </div>
                <div className="lg:col-span-5">
                  <Button type="submit" className="h-12 w-full lg:w-auto" disabled={submitting}>
                    {translations.adminGuests.form.submit}
                  </Button>
                </div>
              </form>
            </div>

            {loading ? (
              <div className="p-6">
                <LoadingState label={translations.adminGuests.loading} className="min-h-[260px]" />
              </div>
            ) : users.length === 0 ? (
              <div className="p-6">
                <EmptyState title={translations.adminGuests.emptyTitle} description={translations.adminGuests.emptyDescription} />
              </div>
            ) : (
              <>
                <div className="grid gap-4 p-5 md:hidden">
                  {users.map((guest) => (
                    <ScrollReveal key={guest.id} delay={0.05}>
                      <div className="rounded-[1.7rem] border border-[rgba(217,179,106,0.14)] bg-[rgba(248,247,244,0.76)] p-5 shadow-[0_26px_56px_-44px_rgba(16,42,67,0.26)]">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-[rgba(16,42,67,0.9)] text-sm font-semibold text-[#E8C98B] shadow-[0_18px_36px_-24px_rgba(5,18,31,0.88)]">
                              {getInitials(guest.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-[#102A43]">{guest.name}</p>
                              <p className="mt-1 text-sm text-[#6B7280]">{guest.phone ?? guest.email ?? "-"}</p>
                            </div>
                          </div>
                          {guest.role === "admin" ? (
                            <div className="rounded-full bg-[rgba(246,231,193,0.62)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A5D21] ring-1 ring-[rgba(217,179,106,0.24)]">
                              {translations.adminGuests.statusAdmin}
                            </div>
                          ) : (
                            <div className="rounded-full bg-[rgba(169,215,232,0.2)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1F4E68] ring-1 ring-[rgba(95,169,198,0.18)]">
                              {translations.adminGuests.statusActive}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 grid gap-3 text-sm text-[#6B7280]">
                          <div className="flex items-center justify-between gap-3 rounded-[1.3rem] bg-white/60 px-4 py-3">
                            <div className="flex items-center gap-2">
                              <UserCircle2 size={16} className="text-[#5FA9C6]" />
                              <span>{translations.adminGuests.fields.totalBookings}</span>
                            </div>
                            <span className="font-semibold text-[#102A43]">{guest.totalBooking}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 rounded-[1.3rem] bg-white/60 px-4 py-3">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} className="text-[#5FA9C6]" />
                              <span>{translations.adminGuests.fields.created}</span>
                            </div>
                            <span className="font-semibold text-[#102A43]">{formatDate(guest.created_at)}</span>
                          </div>
                          {guest.role === "user" ? (
                            <div className="flex gap-2">
                              <Button type="button" variant="destructive" className="h-11 flex-1" onClick={() => handleDelete(guest)}>
                                {translations.adminGuests.actions.delete}
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                <div className="hidden md:block">
                  <Table className="min-w-[900px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{translations.adminGuests.table.guest}</TableHead>
                        <TableHead>{translations.adminGuests.table.phone}</TableHead>
                        <TableHead>{translations.adminGuests.table.totalBookings}</TableHead>
                        <TableHead>{translations.adminGuests.table.created}</TableHead>
                        <TableHead>{translations.adminGuests.table.status}</TableHead>
                        <TableHead className="text-right">{translations.adminGuests.table.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((guest) => (
                        <TableRow key={guest.id} className="hover:bg-[rgba(169,215,232,0.06)]">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-[1.35rem] bg-[rgba(16,42,67,0.9)] text-xs font-semibold text-[#E8C98B] shadow-[0_18px_36px_-24px_rgba(5,18,31,0.88)]">
                                {getInitials(guest.name)}
                              </div>
                              <div>
                                <p className="font-semibold text-[#102A43]">{guest.name}</p>
                                <p className="mt-1 text-xs text-[#6B7280]">ID {guest.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#6B7280]">{guest.phone ?? guest.email ?? "-"}</TableCell>
                          <TableCell className="font-semibold text-[#102A43]">{guest.totalBooking}</TableCell>
                          <TableCell className="text-[#6B7280]">{formatDate(guest.created_at)}</TableCell>
                          <TableCell>
                            {guest.role === "admin" ? (
                              <span className="inline-flex items-center rounded-full bg-[rgba(246,231,193,0.62)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A5D21] ring-1 ring-[rgba(217,179,106,0.24)]">
                                {translations.adminGuests.statusAdmin}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-[rgba(169,215,232,0.2)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1F4E68] ring-1 ring-[rgba(95,169,198,0.18)]">
                                {translations.adminGuests.statusActive}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {guest.role === "user" ? (
                              <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(guest)}>
                                {translations.adminGuests.actions.delete}
                              </Button>
                            ) : (
                              <span className="text-xs text-[#6B7280]">{translations.adminGuests.actions.noAction}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </ScrollReveal>
    </main>
  );
}
