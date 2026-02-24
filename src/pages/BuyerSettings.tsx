import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Target,
  Bell,
  Shield,
  Search,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// ── types ─────────────────────────────────────────
interface AccountData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  preferred_language: string;
}

interface BuyerProfileData {
  investment_type: string;
  budget_min: string;
  budget_max: string;
  preferred_locations: string[];
  property_type: string;
  timeline: string;
  financing_type: string;
}

interface BuyerSettingsData {
  enable_listing_alerts: boolean;
  alert_frequency: string;
  preferred_property_types: string[];
  preferred_regions: string[];
  minimum_roi: string;
}

interface NotificationPrefs {
  listing_alerts: boolean;
  price_changes: boolean;
  system_announcements: boolean;
  marketing_updates: boolean;
}

// ── skeleton card ─────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <Skeleton className="h-12 w-36 rounded-xl" />
    </div>
  );
}

// ── section wrapper ───────────────────────────────
function SettingsCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-ukon-navy/5 rounded-xl flex items-center justify-center">
            <Icon size={20} className="text-ukon-navy" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

// ── main component ────────────────────────────────
const BuyerSettings = () => {
  const { user, userType, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Section states
  const [account, setAccount] = useState<AccountData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    preferred_language: 'en',
  });
  const [savingAccount, setSavingAccount] = useState(false);

  const [buyerProfile, setBuyerProfile] = useState<BuyerProfileData>({
    investment_type: '',
    budget_min: '',
    budget_max: '',
    preferred_locations: [],
    property_type: '',
    timeline: '',
    financing_type: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [settings, setSettings] = useState<BuyerSettingsData>({
    enable_listing_alerts: true,
    alert_frequency: 'daily',
    preferred_property_types: [],
    preferred_regions: [],
    minimum_roi: '',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    listing_alerts: true,
    price_changes: true,
    system_announcements: true,
    marketing_updates: false,
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // ── access control ─────────────────────────────
  useEffect(() => {
    if (!user) {
      navigate(`/${language}/`);
      return;
    }
    if (userType === 'agent') {
      navigate(`/${language}/dashboard`);
      return;
    }
  }, [user, userType, navigate, language]);

  // ── fetch all data ─────────────────────────────
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [profileRes, buyerProfileRes, buyerSettingsRes, notifRes] =
          await Promise.all([
            supabase.from('user_profiles').select('*').eq('id', user.id).single(),
            supabase.from('buyer_profiles').select('*').eq('user_id', user.id).single(),
            supabase.from('buyer_settings').select('*').eq('user_id', user.id).single(),
            supabase.from('user_notification_preferences').select('*').eq('user_id', user.id).single(),
          ]);

        // Account
        setAccount({
          first_name: profileRes.data?.first_name || '',
          last_name: profileRes.data?.last_name || '',
          email: user.email || '',
          phone: profileRes.data?.phone || '',
          country: profileRes.data?.country || '',
          preferred_language: profileRes.data?.preferred_language || 'en',
        });
        if (!profileRes.data) {
          const name = user.user_metadata?.name || '';
          const parts = name.split(' ');
          setAccount((prev) => ({
            ...prev,
            first_name: parts[0] || '',
            last_name: parts.slice(1).join(' ') || '',
          }));
        }

        // Buyer profile
        if (buyerProfileRes.data) {
          setBuyerProfile({
            investment_type: buyerProfileRes.data.investment_type || '',
            budget_min: buyerProfileRes.data.budget_min?.toString() || '',
            budget_max: buyerProfileRes.data.budget_max?.toString() || '',
            preferred_locations: buyerProfileRes.data.preferred_locations || [],
            property_type: buyerProfileRes.data.property_type || '',
            timeline: buyerProfileRes.data.timeline || '',
            financing_type: buyerProfileRes.data.financing_type || '',
          });
        }

        // Buyer settings
        if (buyerSettingsRes.data) {
          setSettings({
            enable_listing_alerts: buyerSettingsRes.data.enable_listing_alerts ?? true,
            alert_frequency: buyerSettingsRes.data.alert_frequency || 'daily',
            preferred_property_types: buyerSettingsRes.data.preferred_property_types || [],
            preferred_regions: buyerSettingsRes.data.preferred_regions || [],
            minimum_roi: buyerSettingsRes.data.minimum_roi?.toString() || '',
          });
        }

        // Notifications
        if (notifRes.data) {
          setNotifications({
            listing_alerts: notifRes.data.listing_alerts ?? true,
            price_changes: notifRes.data.price_changes ?? true,
            system_announcements: notifRes.data.system_announcements ?? true,
            marketing_updates: notifRes.data.marketing_updates ?? false,
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // ── save handlers ──────────────────────────────

  const saveAccount = async () => {
    if (!user) return;
    setSavingAccount(true);
    try {
      const { error } = await supabase.from('user_profiles').upsert({
        id: user.id,
        first_name: account.first_name,
        last_name: account.last_name,
        full_name: `${account.first_name} ${account.last_name}`.trim(),
        phone: account.phone,
        country: account.country,
        preferred_language: account.preferred_language,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success('Account details saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save account');
    } finally {
      setSavingAccount(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase.from('buyer_profiles').upsert({
        user_id: user.id,
        investment_type: buyerProfile.investment_type,
        budget_min: buyerProfile.budget_min ? parseFloat(buyerProfile.budget_min) : null,
        budget_max: buyerProfile.budget_max ? parseFloat(buyerProfile.budget_max) : null,
        preferred_locations: buyerProfile.preferred_locations,
        property_type: buyerProfile.property_type,
        timeline: buyerProfile.timeline,
        financing_type: buyerProfile.financing_type,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      toast.success('Buyer profile saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    setSavingSettings(true);
    try {
      const { error } = await supabase.from('buyer_settings').upsert({
        user_id: user.id,
        enable_listing_alerts: settings.enable_listing_alerts,
        alert_frequency: settings.alert_frequency,
        preferred_property_types: settings.preferred_property_types,
        preferred_regions: settings.preferred_regions,
        minimum_roi: settings.minimum_roi ? parseFloat(settings.minimum_roi) : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      toast.success('Search & alert settings saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const saveNotifications = async () => {
    if (!user) return;
    setSavingNotifications(true);
    try {
      const { error } = await supabase.from('user_notification_preferences').upsert({
        user_id: user.id,
        listing_alerts: notifications.listing_alerts,
        price_changes: notifications.price_changes,
        system_announcements: notifications.system_announcements,
        marketing_updates: notifications.marketing_updates,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      toast.success('Notification preferences saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save notifications');
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeletingAccount(true);
    try {
      await Promise.all([
        supabase.from('buyer_profiles').delete().eq('user_id', user.id),
        supabase.from('buyer_settings').delete().eq('user_id', user.id),
        supabase.from('user_notification_preferences').delete().eq('user_id', user.id),
        supabase.from('user_profiles').delete().eq('id', user.id),
        supabase.from('saved_listings').delete().eq('user_id', user.id),
        supabase.from('search_alerts').delete().eq('user_id', user.id),
      ]);
      await signOut();
      toast.success('Account deleted');
      navigate(`/${language}/`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
      setDeletingAccount(false);
    }
  };

  // helper for comma-separated array inputs
  const parseArrayInput = (value: string): string[] =>
    value.split(',').map((s) => s.trim()).filter(Boolean);

  // ── loading ────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 bg-secondary/30">
          <div className="bg-white border-b border-border">
            <div className="max-w-5xl mx-auto px-6 py-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  // ── render ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 bg-secondary/30">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-border"
        >
          <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── SECTION 1: Account ──────────────────── */}
          <SettingsCard icon={User} title="Account">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={account.first_name}
                    onChange={(e) => setAccount({ ...account, first_name: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={account.last_name}
                    onChange={(e) => setAccount({ ...account, last_name: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={account.email} disabled className="h-12 rounded-xl bg-secondary/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={account.phone}
                    onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                    className="h-12 rounded-xl"
                    placeholder="+31 6 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={account.country}
                    onChange={(e) => setAccount({ ...account, country: e.target.value })}
                    className="h-12 rounded-xl"
                    placeholder="Netherlands"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select value={account.preferred_language} onValueChange={(v) => setAccount({ ...account, preferred_language: v })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="nl">Nederlands</SelectItem>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={saveAccount}
                disabled={savingAccount}
                className="bg-ukon-navy hover:bg-ukon-navy/90 rounded-xl h-11"
              >
                {savingAccount && <Loader2 size={16} className="mr-2 animate-spin" />}
                Save Account
              </Button>
            </div>
          </SettingsCard>

          {/* ── SECTION 2: Buyer Profile ───────────── */}
          <SettingsCard icon={Target} title="Buyer Profile">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Investment Type</Label>
                  <Select value={buyerProfile.investment_type} onValueChange={(v) => setBuyerProfile({ ...buyerProfile, investment_type: v })}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Use</SelectItem>
                      <SelectItem value="rental">Rental Income</SelectItem>
                      <SelectItem value="flip">Fix & Flip</SelectItem>
                      <SelectItem value="long-term">Long-term Hold</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={buyerProfile.property_type} onValueChange={(v) => setBuyerProfile({ ...buyerProfile, property_type: v })}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget Min (EUR)</Label>
                  <Input
                    type="number"
                    value={buyerProfile.budget_min}
                    onChange={(e) => setBuyerProfile({ ...buyerProfile, budget_min: e.target.value })}
                    className="h-12 rounded-xl"
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Budget Max (EUR)</Label>
                  <Input
                    type="number"
                    value={buyerProfile.budget_max}
                    onChange={(e) => setBuyerProfile({ ...buyerProfile, budget_max: e.target.value })}
                    className="h-12 rounded-xl"
                    placeholder="500000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Preferred Locations</Label>
                <Input
                  value={buyerProfile.preferred_locations.join(', ')}
                  onChange={(e) => setBuyerProfile({ ...buyerProfile, preferred_locations: parseArrayInput(e.target.value) })}
                  className="h-12 rounded-xl"
                  placeholder="Bali, Lombok, Java"
                />
                <p className="text-xs text-muted-foreground">Separate with commas</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Select value={buyerProfile.timeline} onValueChange={(v) => setBuyerProfile({ ...buyerProfile, timeline: v })}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1-3months">1-3 months</SelectItem>
                      <SelectItem value="3-6months">3-6 months</SelectItem>
                      <SelectItem value="6-12months">6-12 months</SelectItem>
                      <SelectItem value="exploring">Just exploring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Financing Type</Label>
                  <Select value={buyerProfile.financing_type} onValueChange={(v) => setBuyerProfile({ ...buyerProfile, financing_type: v })}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={saveProfile}
                disabled={savingProfile}
                className="bg-ukon-navy hover:bg-ukon-navy/90 rounded-xl h-11"
              >
                {savingProfile && <Loader2 size={16} className="mr-2 animate-spin" />}
                Save Profile
              </Button>
            </div>
          </SettingsCard>

          {/* ── SECTION 3: Search & Alerts ──────────── */}
          <SettingsCard icon={Search} title="Search & Alerts">
            <div className="space-y-5">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Enable Listing Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified about new matching properties</p>
                </div>
                <Switch
                  checked={settings.enable_listing_alerts}
                  onCheckedChange={(v) => setSettings({ ...settings, enable_listing_alerts: v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Alert Frequency</Label>
                <Select value={settings.alert_frequency} onValueChange={(v) => setSettings({ ...settings, alert_frequency: v })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Property Types</Label>
                <Input
                  value={settings.preferred_property_types.join(', ')}
                  onChange={(e) => setSettings({ ...settings, preferred_property_types: parseArrayInput(e.target.value) })}
                  className="h-12 rounded-xl"
                  placeholder="Villa, Apartment, Land"
                />
                <p className="text-xs text-muted-foreground">Separate with commas</p>
              </div>
              <div className="space-y-2">
                <Label>Preferred Regions</Label>
                <Input
                  value={settings.preferred_regions.join(', ')}
                  onChange={(e) => setSettings({ ...settings, preferred_regions: parseArrayInput(e.target.value) })}
                  className="h-12 rounded-xl"
                  placeholder="Bali, Jakarta, Surabaya"
                />
                <p className="text-xs text-muted-foreground">Separate with commas</p>
              </div>
              <div className="space-y-2">
                <Label>Minimum ROI (%)</Label>
                <Input
                  type="number"
                  value={settings.minimum_roi}
                  onChange={(e) => setSettings({ ...settings, minimum_roi: e.target.value })}
                  className="h-12 rounded-xl"
                  placeholder="8"
                  min="0"
                  step="0.5"
                />
              </div>
              <Button
                onClick={saveSettings}
                disabled={savingSettings}
                className="bg-ukon-navy hover:bg-ukon-navy/90 rounded-xl h-11"
              >
                {savingSettings && <Loader2 size={16} className="mr-2 animate-spin" />}
                Save Alert Settings
              </Button>
            </div>
          </SettingsCard>

          {/* ── SECTION 4: Notifications ───────────── */}
          <SettingsCard icon={Bell} title="Notifications">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Listing Alerts</p>
                  <p className="text-xs text-muted-foreground">New properties matching your criteria</p>
                </div>
                <Switch
                  checked={notifications.listing_alerts}
                  onCheckedChange={(v) => setNotifications({ ...notifications, listing_alerts: v })}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Price Changes</p>
                  <p className="text-xs text-muted-foreground">Alerts when saved property prices change</p>
                </div>
                <Switch
                  checked={notifications.price_changes}
                  onCheckedChange={(v) => setNotifications({ ...notifications, price_changes: v })}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">System Announcements</p>
                  <p className="text-xs text-muted-foreground">Platform updates and important notices</p>
                </div>
                <Switch
                  checked={notifications.system_announcements}
                  onCheckedChange={(v) => setNotifications({ ...notifications, system_announcements: v })}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Marketing Updates</p>
                  <p className="text-xs text-muted-foreground">Tips, promotions, and investment insights</p>
                </div>
                <Switch
                  checked={notifications.marketing_updates}
                  onCheckedChange={(v) => setNotifications({ ...notifications, marketing_updates: v })}
                />
              </div>
              <Button
                onClick={saveNotifications}
                disabled={savingNotifications}
                className="bg-ukon-navy hover:bg-ukon-navy/90 rounded-xl h-11 mt-2"
              >
                {savingNotifications && <Loader2 size={16} className="mr-2 animate-spin" />}
                Save Notifications
              </Button>
            </div>
          </SettingsCard>

          {/* ── SECTION 5: Security ────────────────── */}
          <SettingsCard icon={Shield} title="Security">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Change Password</h4>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 rounded-xl"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={savingPassword || !newPassword}
                  className="bg-ukon-navy hover:bg-ukon-navy/90 rounded-xl h-11"
                >
                  {savingPassword && <Loader2 size={16} className="mr-2 animate-spin" />}
                  Update Password
                </Button>
              </div>

              {/* Danger zone */}
              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-semibold text-red-600 mb-4">Danger Zone</h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="rounded-xl h-11 gap-2">
                      <AlertTriangle size={16} />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account,
                        saved properties, search alerts, and all settings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount}
                        className="bg-red-600 hover:bg-red-700 rounded-xl"
                      >
                        {deletingAccount ? (
                          <><Loader2 size={16} className="mr-2 animate-spin" /> Deleting...</>
                        ) : (
                          'Yes, delete my account'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerSettings;
