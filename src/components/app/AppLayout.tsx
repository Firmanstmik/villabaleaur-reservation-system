import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BedDouble, CalendarRange, ChevronDown, ChevronRight, Home, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, User, UserCircle2, Users, X } from "lucide-react";

import LanguageSwitch from "@/components/app/LanguageSwitch";
import logoImage from "@/assets/logo-villa-bale-aur.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface AuthLinksProps {
  useDarkHeader: boolean;
  onNavigate?: () => void;
  hideStandaloneLogout?: boolean;
}

function AuthLinks({ useDarkHeader, onNavigate, hideStandaloneLogout = false }: AuthLinksProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { translations } = useLanguage();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    setOpenDropdown(false);
  }, [user?.name]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            onNavigate?.();
            navigate("/login");
          }}
          className={cn(
            "hidden sm:inline-flex",
            useDarkHeader ? "text-white hover:bg-white/10 hover:text-white" : "",
          )}
        >
          {translations.app.nav.signIn}
        </Button>
        <Button
          onClick={() => {
            onNavigate?.();
            navigate("/register");
          }}
          className={cn(useDarkHeader && "shadow-[0_20px_40px_-20px_rgba(217,179,106,0.95)] text-white hover:text-white")}
        >
          {translations.app.nav.register}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 rounded-full border px-4",
            useDarkHeader
              ? "border-white/12 bg-white/10 text-white shadow-[0_18px_38px_-26px_rgba(5,18,31,0.85)] hover:bg-white/14 hover:text-white"
              : "border-[rgba(217,179,106,0.16)] bg-[rgba(255,255,255,0.72)] text-[#102A43] shadow-[0_16px_34px_-26px_rgba(16,42,67,0.34)] hover:bg-white hover:text-[#102A43]",
          )}
          onClick={() => setOpenDropdown((value) => !value)}
        >
          <UserCircle2 size={18} />
          {user?.name}
          <ChevronDown size={16} className={cn("transition-transform duration-300", openDropdown && "rotate-180")} />
        </Button>

        <AnimatePresence>
          {openDropdown ? (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-[calc(100%+0.75rem)] w-[240px] overflow-hidden rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(16,42,67,0.98),rgba(15,35,54,0.96))] p-2.5 text-white shadow-[0_28px_70px_-36px_rgba(5,18,31,0.92)] backdrop-blur-2xl"
            >
              <div className="rounded-[1.2rem] border border-white/8 bg-white/6 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E8C98B]">{translations.app.userMenu.guestAccess}</p>
                <p className="mt-2 text-sm font-semibold text-white">{user?.name}</p>
                <p className="mt-1 text-xs text-white/62">{user?.phone ?? user?.email}</p>
              </div>

              <div className="mt-2 flex flex-col gap-1">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-[1.1rem] px-4 py-3 text-left text-sm font-medium text-white/86 transition-all duration-300 hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setOpenDropdown(false);
                    onNavigate?.();
                    navigate(isAdmin ? "/admin" : "/dashboard");
                  }}
                >
                  <LayoutDashboard size={17} className="text-[#E8C98B]" />
                  {isAdmin ? translations.app.userMenu.adminDashboard : translations.app.userMenu.dashboard}
                </button>

                <button
                  type="button"
                  className="flex items-center gap-3 rounded-[1.1rem] px-4 py-3 text-left text-sm font-medium text-white/86 transition-all duration-300 hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setOpenDropdown(false);
                    onNavigate?.();
                    navigate(isAdmin ? "/admin/profile" : "/profile");
                  }}
                >
                  <User size={17} className="text-[#E8C98B]" />
                  {translations.app.userMenu.profile}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {!hideStandaloneLogout ? (
        <Button
          variant={useDarkHeader ? "secondary" : "outline"}
          className={cn(
            useDarkHeader ? "text-white hover:text-white" : "border-[rgba(217,179,106,0.16)] bg-[rgba(248,247,244,0.78)]",
          )}
          onClick={() => {
            onNavigate?.();
            logout();
          }}
        >
          {translations.app.nav.logout}
        </Button>
      ) : null}
    </div>
  );
}

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem("ba_admin_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });
  const adminSidebarRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [collapsedTooltip, setCollapsedTooltip] = useState<null | { label: string; top: number; left: number }>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [hasScrolledPastTop, setHasScrolledPastTop] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const { translations, language } = useLanguage();
  const { isAdmin, user, logout } = useAuth();
  const isHome = location.pathname === "/";
  const isUserDashboard = location.pathname === "/dashboard";
  const isOverlayHeaderPage = isHome || isUserDashboard;
  const useDarkHeader = true;
  const hasSolidHeader = !isOverlayHeaderPage || hasScrolledPastTop || open;
  const publicLinks = useMemo(
    () => [
      { label: translations.app.nav.home, href: "/" },
      { label: translations.app.nav.villas, href: "/villas" },
      { label: translations.app.nav.about, href: "/about" },
      { label: translations.app.nav.contact, href: "/contact" },
    ],
    [translations.app.nav.about, translations.app.nav.contact, translations.app.nav.home, translations.app.nav.villas],
  );
  const adminLinks = useMemo(
    () => [
      { label: translations.adminNav.dashboard, href: "/admin" },
      { label: translations.adminNav.villas, href: "/admin/villas" },
      { label: translations.adminNav.bookings, href: "/admin/bookings" },
      { label: translations.adminNav.guests, href: "/admin/guests" },
      { label: translations.adminNav.profile, href: "/admin/profile" },
    ],
    [
      translations.adminNav.bookings,
      translations.adminNav.dashboard,
      translations.adminNav.guests,
      translations.adminNav.profile,
      translations.adminNav.villas,
    ],
  );
  const isAdminRoute = isAdmin && location.pathname.startsWith("/admin");
  const navLinks = isAdminRoute ? adminLinks : publicLinks;

  const activeHref = useMemo<string | null>(() => {
    if (location.pathname === "/") {
      return "/";
    }

    if (location.pathname.startsWith("/admin")) {
      if (location.pathname === "/admin") {
        return "/admin";
      }

      const sortedBySpecificity = [...adminLinks].sort((a, b) => b.href.length - a.href.length);
      const match = sortedBySpecificity.find((link) => location.pathname.startsWith(link.href));
      return match?.href ?? "/admin";
    }

    if (location.pathname.startsWith("/villas")) {
      return "/villas";
    }

    if (location.pathname === "/about") {
      return "/about";
    }

    if (location.pathname === "/contact") {
      return "/contact";
    }

    return null;
  }, [adminLinks, location.pathname]);

  useEffect(() => {
    setOpen(false);
    setIsNavVisible(true);
    setAdminSidebarOpen(false);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    try {
      window.localStorage.setItem("ba_admin_sidebar_collapsed", adminSidebarCollapsed ? "1" : "0");
    } catch {
      return;
    }
  }, [adminSidebarCollapsed]);

  useEffect(() => {
    if (tooltipRef.current && collapsedTooltip) {
      tooltipRef.current.style.left = `${collapsedTooltip.left}px`;
      tooltipRef.current.style.top = `${collapsedTooltip.top}px`;
    }
  }, [collapsedTooltip]);

  function showCollapsedTooltip(label: string, element: HTMLElement | null) {
    if (!adminSidebarCollapsed) {
      return;
    }

    if (!label || !element) {
      return;
    }

    const triggerRect = element.getBoundingClientRect();
    const sidebarRect = adminSidebarRef.current?.getBoundingClientRect();
    const left = (sidebarRect?.right ?? triggerRect.right) + 14;
    const top = triggerRect.top + triggerRect.height / 2;
    setCollapsedTooltip({ label, top, left });
  }

  function hideCollapsedTooltip() {
    setCollapsedTooltip(null);
  }

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = current - previous;

    setHasScrolledPastTop(current > 16);

    if (open || current < 96) {
      setIsNavVisible(true);
      return;
    }

    if (delta > 4) {
      setIsNavVisible(false);
    }

    if (delta < -4) {
      setIsNavVisible(true);
    }
  });

  if (isAdminRoute) {
    const pageLabel = adminLinks.find((link) => link.href === activeHref)?.label ?? translations.adminNav.dashboard;
    const adminMainNavItems = [
      { href: "/admin", label: translations.adminNav.dashboard, icon: LayoutDashboard },
      { href: "/admin/villas", label: translations.adminNav.villas, icon: BedDouble },
      { href: "/admin/bookings", label: translations.adminNav.bookings, icon: CalendarRange },
      { href: "/admin/guests", label: translations.adminNav.guests, icon: Users },
    ];
    const adminPropertyNavItems = [
      { href: "/about", label: translations.app.nav.about, icon: Home },
      { href: "/contact", label: translations.app.nav.contact, icon: ShieldCheck },
    ];
    const breadcrumbItems = [
      translations.adminNav.dashboard,
      ...(activeHref && activeHref !== "/admin" ? [pageLabel] : []),
    ];
    const adminSearchPlaceholder =
      language === "id" ? "Cari menu, halaman, atau aktivitas admin..." : "Search admin pages, menu, or activity...";

    return (
      <div className="admin-shell h-screen overflow-hidden bg-[#F8F7F4] text-[#102A43]">
        <div className="relative flex h-screen w-full">
          <aside
            ref={(node) => {
              adminSidebarRef.current = node;
            }}
            className={cn(
              "fixed inset-y-0 left-0 hidden flex-col border-r border-white/8 bg-[linear-gradient(180deg,rgba(11,31,49,0.98),rgba(16,42,67,0.96)_42%,rgba(13,36,56,0.98)_100%)] text-white shadow-[0_48px_120px_-80px_rgba(5,18,31,0.95)] transition-[width] duration-300 lg:flex",
              "z-[120]",
              adminSidebarCollapsed ? "w-[112px]" : "w-[310px]",
            )}
          >
            <div className={cn("border-b border-white/10", adminSidebarCollapsed ? "px-5 py-6" : "px-7 py-7")}>
              <div className="flex items-center justify-between gap-3">
                <Link to="/admin" className={cn("flex items-center gap-4", adminSidebarCollapsed ? "justify-center" : "")}>
                  <img
                    src={logoImage}
                    alt={translations.app.brandName}
                    className={cn(
                      "object-contain transition-all duration-300",
                      adminSidebarCollapsed ? "h-12 w-12" : "h-[100px] w-[250px]",
                    )}
                  />
                </Link>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/82 shadow-[0_18px_40px_-28px_rgba(5,18,31,0.85)] transition-all duration-300 hover:bg-white/10 hover:text-white",
                    adminSidebarCollapsed ? "" : "",
                  )}
                  onClick={() => setAdminSidebarCollapsed((value) => !value)}
                  aria-label={translations.app.nav.toggleMenu}
                >
                  <ChevronRight className={cn("transition-transform duration-300", adminSidebarCollapsed ? "rotate-0" : "rotate-180")} />
                </button>
              </div>
            </div>

            <div className="no-scrollbar flex-1 overflow-x-visible overflow-y-auto px-5 py-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-2.5 shadow-[0_28px_70px_-54px_rgba(5,18,31,0.58)] backdrop-blur-2xl">
                <p
                  className={cn(
                    "px-3 pb-3 pt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42 transition-all duration-300",
                    adminSidebarCollapsed ? "h-0 overflow-hidden pb-0 pt-0 opacity-0" : "",
                  )}
                >
                  Operations
                </p>
                {adminMainNavItems.map((item) => {
                  const active = activeHref === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onMouseEnter={(event) => showCollapsedTooltip(item.label, event.currentTarget)}
                      onMouseLeave={hideCollapsedTooltip}
                      onFocus={(event) => showCollapsedTooltip(item.label, event.currentTarget)}
                      onBlur={hideCollapsedTooltip}
                      className={cn(
                        "group/nav relative mb-1.5 flex items-center overflow-visible rounded-[1.45rem] px-4 py-3.5 text-sm font-medium transition-all duration-300",
                        adminSidebarCollapsed ? "justify-center gap-0 px-3" : "gap-3",
                        active
                          ? "bg-[linear-gradient(135deg,rgba(232,201,139,0.98),rgba(217,179,106,0.92))] text-[#102A43] shadow-[0_22px_46px_-28px_rgba(217,179,106,0.88)]"
                          : "text-white/78 hover:bg-white/8 hover:text-white",
                      )}
                      aria-label={adminSidebarCollapsed ? item.label : undefined}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-[1.2rem] transition-all duration-300",
                          active ? "bg-white/40" : "bg-white/6 group-hover/nav:bg-white/10",
                        )}
                      >
                        <Icon size={18} className={active ? "text-[#102A43]" : "text-[#E8C98B]"} />
                      </span>
                      <span className={cn("flex-1 transition-all duration-300", adminSidebarCollapsed ? "hidden" : "")}>
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full transition-all duration-300",
                          adminSidebarCollapsed ? "hidden" : active ? "bg-[rgba(16,42,67,0.72)]" : "bg-[#E8C98B]/70 opacity-0 group-hover/nav:opacity-100",
                        )}
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/5 p-2.5 shadow-[0_28px_70px_-54px_rgba(5,18,31,0.58)] backdrop-blur-2xl">
                <p
                  className={cn(
                    "px-3 pb-3 pt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42 transition-all duration-300",
                    adminSidebarCollapsed ? "h-0 overflow-hidden pb-0 pt-0 opacity-0" : "",
                  )}
                >
                  Property
                </p>
                {adminPropertyNavItems.map((item) => {
                  const active = activeHref === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onMouseEnter={(event) => showCollapsedTooltip(item.label, event.currentTarget)}
                      onMouseLeave={hideCollapsedTooltip}
                      onFocus={(event) => showCollapsedTooltip(item.label, event.currentTarget)}
                      onBlur={hideCollapsedTooltip}
                      className={cn(
                        "group/nav relative mb-1.5 flex items-center overflow-visible rounded-[1.45rem] px-4 py-3.5 text-sm font-medium transition-all duration-300",
                        adminSidebarCollapsed ? "justify-center gap-0 px-3" : "gap-3",
                        active
                          ? "bg-white/10 text-white shadow-[0_22px_46px_-32px_rgba(5,18,31,0.82)]"
                          : "text-white/74 hover:bg-white/8 hover:text-white",
                      )}
                      aria-label={adminSidebarCollapsed ? item.label : undefined}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-[1.2rem] transition-all duration-300",
                          active ? "bg-white/10" : "bg-white/6 group-hover/nav:bg-white/10",
                        )}
                      >
                        <Icon size={18} className="text-[#E8C98B]" />
                      </span>
                      <span className={cn("flex-1 transition-all duration-300", adminSidebarCollapsed ? "hidden" : "")}>
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full transition-all duration-300",
                          adminSidebarCollapsed ? "hidden" : active ? "bg-[#E8C98B]" : "bg-[#E8C98B]/70 opacity-0 group-hover/nav:opacity-100",
                        )}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 px-5 py-5">
              <div
                className={cn(
                  "rounded-[1.9rem] border border-white/10 bg-white/6 shadow-[0_28px_70px_-54px_rgba(5,18,31,0.62)] backdrop-blur-2xl",
                  adminSidebarCollapsed ? "p-3" : "p-4",
                )}
              >
                <Link
                  to="/admin/profile"
                  className={cn(
                    "group/profile relative flex items-center gap-3 overflow-visible rounded-[1.3rem] px-2 py-2 transition-colors duration-300 hover:bg-white/6",
                    activeHref === "/admin/profile" ? "bg-white/6" : "",
                    adminSidebarCollapsed ? "justify-center" : "",
                  )}
                  onMouseEnter={(event) => showCollapsedTooltip(translations.adminNav.profile, event.currentTarget)}
                  onMouseLeave={hideCollapsedTooltip}
                  onFocus={(event) => showCollapsedTooltip(translations.adminNav.profile, event.currentTarget)}
                  onBlur={hideCollapsedTooltip}
                  aria-label={adminSidebarCollapsed ? translations.adminNav.profile : undefined}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(135deg,rgba(232,201,139,0.98),rgba(217,179,106,0.9))] text-[#102A43] shadow-[0_18px_40px_-28px_rgba(217,179,106,0.85)]">
                    <UserCircle2 size={18} />
                  </div>
                  <div className={cn("min-w-0 flex-1 transition-all duration-300", adminSidebarCollapsed ? "hidden" : "")}>
                    <p className="truncate text-sm font-semibold text-white">{user?.name ?? translations.adminNav.profile}</p>
                    <p className="mt-1 truncate text-xs text-white/54">{user?.phone ?? user?.email}</p>
                  </div>
                </Link>
                <div className={cn("mt-4 flex gap-2", adminSidebarCollapsed ? "flex-col" : "")}>
                  {adminSidebarCollapsed ? (
                    <>
                      <Button
                        asChild
                        size="icon"
                        variant="outline"
                        className="w-full border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                      >
                        <Link to="/admin/profile" aria-label={translations.adminNav.profile}>
                          <User size={16} />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="w-full"
                        onClick={() => logout()}
                        aria-label={translations.app.nav.logout}
                        onMouseEnter={(event) => showCollapsedTooltip(translations.app.nav.logout, event.currentTarget)}
                        onMouseLeave={hideCollapsedTooltip}
                        onFocus={(event) => showCollapsedTooltip(translations.app.nav.logout, event.currentTarget)}
                        onBlur={hideCollapsedTooltip}
                      >
                        <LogOut size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                      >
                        <Link to="/admin/profile">{translations.adminNav.profile}</Link>
                      </Button>
                      <Button type="button" variant="destructive" className="min-w-[96px]" onClick={() => logout()}>
                        <LogOut size={16} />
                        {translations.app.nav.logout}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <AnimatePresence>
            {adminSidebarOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="fixed inset-0 z-50 bg-[rgba(11,31,49,0.72)] backdrop-blur-sm lg:hidden"
                onClick={() => setAdminSidebarOpen(false)}
              >
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full w-[320px] max-w-[88vw] flex-col border-r border-white/10 bg-[linear-gradient(180deg,rgba(248,247,244,0.95),rgba(239,233,223,0.82))] shadow-[0_60px_140px_-90px_rgba(5,18,31,0.9)]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center justify-between gap-3 px-6 py-6">
                    <Link to="/admin" className="flex items-center gap-3" onClick={() => setAdminSidebarOpen(false)}>
                      <img src={logoImage} alt={translations.app.brandName} className="h-14 w-14 object-contain" />
                    </Link>
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(217,179,106,0.18)] bg-white/70 text-[#102A43] shadow-[0_18px_40px_-28px_rgba(16,42,67,0.28)]"
                      onClick={() => setAdminSidebarOpen(false)}
                      aria-label={translations.app.nav.toggleMenu}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="no-scrollbar flex-1 overflow-x-visible overflow-y-auto px-4 pb-6">
                    <div className="rounded-[2rem] border border-white/70 bg-white/60 p-2 shadow-[0_28px_70px_-54px_rgba(16,42,67,0.24)]">
                      {[...adminMainNavItems, { href: "/admin/profile", label: translations.adminNav.profile, icon: ShieldCheck }].map((item) => {
                        const active = activeHref === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setAdminSidebarOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-[1.6rem] px-4 py-3 text-sm font-semibold transition-all duration-300",
                              active
                                ? "bg-[linear-gradient(135deg,#e8c98b_0%,#d9b36a_100%)] text-[#102A43]"
                                : "text-[#1F4E68] hover:bg-[rgba(169,215,232,0.16)] hover:text-[#102A43]",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-[1.35rem]",
                                active ? "bg-white/45" : "bg-[rgba(16,42,67,0.06)]",
                              )}
                            >
                              <Icon size={18} className={cn(active ? "text-[#102A43]" : "text-[#5FA9C6]")} />
                            </span>
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-4 rounded-[2rem] border border-white/70 bg-white/60 p-2 shadow-[0_28px_70px_-54px_rgba(16,42,67,0.24)]">
                      {adminPropertyNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setAdminSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-[1.6rem] px-4 py-3 text-sm font-semibold text-[#1F4E68] transition-all duration-300 hover:bg-[rgba(169,215,232,0.16)] hover:text-[#102A43]"
                          >
                            <span className="flex h-10 w-10 items-center justify-center rounded-[1.35rem] bg-[rgba(16,42,67,0.06)]">
                              <Icon size={18} className="text-[#5FA9C6]" />
                            </span>
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      className="mt-4 w-full"
                      onClick={() => {
                        setAdminSidebarOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={16} />
                      {translations.app.nav.logout}
                    </Button>
                  </div>
                </motion.aside>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div
            className={cn(
              "flex h-screen w-full flex-1 flex-col bg-[rgba(248,247,244,0.72)]",
              adminSidebarCollapsed ? "lg:pl-[112px]" : "lg:pl-[310px]",
            )}
          >
            <header className="sticky top-0 z-40 bg-transparent backdrop-blur-none">
              <div className="mx-auto w-full max-w-[1440px] px-4 pb-0 pt-4 md:px-8 md:pt-6">
                <div className="rounded-[1.9rem] border border-white/70 bg-[rgba(248,247,244,0.84)] px-4 py-4 shadow-[0_30px_90px_-64px_rgba(16,42,67,0.26)] backdrop-blur-2xl md:px-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(217,179,106,0.18)] bg-white/72 text-[#102A43] shadow-[0_18px_40px_-28px_rgba(16,42,67,0.28)] lg:hidden"
                        onClick={() => setAdminSidebarOpen(true)}
                        aria-label={translations.app.nav.toggleMenu}
                      >
                        <Menu size={18} />
                      </button>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">
                          {breadcrumbItems.map((item, index) => (
                            <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                              {index > 0 ? <ChevronRight size={14} className="text-[#C9A969]" /> : null}
                              <span className={index === breadcrumbItems.length - 1 ? "text-[#1F4E68]" : ""}>{item}</span>
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 truncate text-2xl font-semibold text-[#102A43]">{pageLabel}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <div className="relative w-full md:w-[320px]">
                        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                        <Input
                          type="text"
                          placeholder={adminSearchPlaceholder}
                          className="h-12 rounded-full border-white/80 bg-white/72 pl-11 shadow-[0_18px_40px_-28px_rgba(16,42,67,0.2)]"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <LanguageSwitch />
                        <AuthLinks useDarkHeader={false} hideStandaloneLogout />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(232,201,139,0.18),transparent_70%)] blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(169,215,232,0.14),transparent_72%)] blur-3xl" />
              </div>
              <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8 md:pb-10">
                <Outlet />
              </div>
            </div>
          </div>
        </div>

        {adminSidebarCollapsed && collapsedTooltip ? (
          <div
            ref={tooltipRef}
            className="pointer-events-none fixed z-[1000] -translate-y-1/2 whitespace-nowrap rounded-full border border-white/12 bg-[rgba(11,31,49,0.96)] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_28px_70px_-44px_rgba(5,18,31,0.94)]"
          >
            {collapsedTooltip.label}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#102A43]">
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          hasSolidHeader
            ? "border-b border-white/10 bg-[rgba(11,31,49,0.74)] backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent",
        )}
        animate={{ y: isNavVisible ? 0 : "-110%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex w-full items-center gap-4 px-4 py-5 md:px-8 xl:gap-6 xl:px-12 2xl:px-16">
          <Link to="/" className="shrink-0">
            <img src={logoImage} alt={translations.app.brandName} className="h-20 w-40 object-contain" />
          </Link>

          <div className="hidden min-w-0 flex-1 md:flex md:px-3 lg:px-5">
            <nav
              className={cn(
                "flex w-full items-center justify-between gap-1 rounded-full p-1.5",
                "border border-white/12 bg-white/6 shadow-[0_18px_34px_-26px_rgba(5,18,31,0.82)] backdrop-blur-md",
              )}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium transition-all duration-300 xl:px-5",
                    activeHref === link.href
                      ? "bg-[linear-gradient(135deg,#e8c98b_0%,#d9b36a_100%)] text-[#102A43] shadow-[0_14px_28px_-18px_rgba(217,179,106,0.95)]"
                      : "text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <LanguageSwitch dark />
            <AuthLinks useDarkHeader={useDarkHeader} />
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden",
              "border border-white/12 bg-white/10 text-white backdrop-blur-md",
            )}
            onClick={() => setOpen((value) => !value)}
            aria-label={translations.app.nav.toggleMenu}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <div
            className={cn(
              "px-4 py-4 md:hidden",
              "border-t border-white/10 bg-[rgba(11,31,49,0.92)] backdrop-blur-xl",
            )}
          >
            <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_24px_48px_-30px_rgba(5,18,31,0.9)] backdrop-blur-2xl">
              <LanguageSwitch dark compact />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium",
                    activeHref === link.href
                      ? "bg-[linear-gradient(135deg,#e8c98b_0%,#d9b36a_100%)] text-[#102A43]"
                      : "bg-white/8 text-white",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-2">
                <AuthLinks useDarkHeader={useDarkHeader} onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </motion.header>

      {!isOverlayHeaderPage ? <div className="h-[92px]" /> : null}

      <Outlet />

      <footer id="contact" className="border-t border-[rgba(217,179,106,0.14)] bg-[rgba(248,247,244,0.72)] backdrop-blur">
        <div className="app-shell flex flex-col gap-6 py-10 text-sm text-[#6B7280] md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <p className="font-semibold text-[#102A43]">{translations.app.brandName}</p>
            <p className="mt-1 leading-6">{translations.app.footer.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/" className="hover:text-[#1F4E68]">
              {translations.app.nav.home}
            </Link>
            <Link to="/villas" className="hover:text-[#1F4E68]">
              {translations.app.nav.villas}
            </Link>
            <Link to="/about" className="hover:text-[#1F4E68]">
              {translations.app.nav.about}
            </Link>
            <Link to="/contact" className="hover:text-[#1F4E68]">
              {translations.app.nav.contact}
            </Link>
            <Link to="/login" className="hover:text-[#1F4E68]">
              {translations.app.nav.signIn}
            </Link>
            <Link to="/register" className="inline-flex items-center gap-1 font-medium text-[#1F4E68]">
              {translations.app.footer.startBooking}
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
