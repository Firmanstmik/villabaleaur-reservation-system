import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Settings,
  Bell,
  Shield,
  Megaphone,
  Camera,
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
import { supabase } from '@/lib/supabase';
import { uploadProfileImage } from '@/lib/uploadProfileImage';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SellerSettingsProps {
  user: SupabaseUser;
}

// ── types ─────────────────────────────────────────
interface AccountData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  preferred_language: string;
}

interface SellerProfileData {
  agency_name: string;
  license_number: string;
  bio: string;
  office_address: string;
  website: string;
  profile_image_url: string;
  public_profile_enabled: boolean;
}

interface ListingDefaults {
  default_country: string;
  default_currency: string;
  default_ownership_type: string;
  default_commission_percentage: string;
  show_price_publicly: boolean;
  show_contact_form: boolean;
}

interface LeadSettings {
  email_notifications_enabled: boolean;
  auto_response_message: string;
  webhook_url: string;
}

interface NotificationPrefs {
  inquiry_received: boolean;
  system_announcements: boolean;
  marketing_updates: boolean;
}

// ── skeleton card ─────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-border shadow-sm p-8 space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
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
      className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0e2e50]/5 rounded-2xl flex items-center justify-center">
            <Icon size={20} className="text-[#0e2e50]" />
          </div>
          <h3 className="text-lg font-bold text-[#0e2e50]">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

// ── main component ────────────────────────────────
export default function SellerSettings({ user }: SellerSettingsProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  // Section states
  const [account, setAccount] = useState<AccountData>({
    first_name: '',
    last_name: '',
    email: user.email || '',
    phone: '',
    country: '',
    preferred_language: 'en',
  });
  const [savingAccount, setSavingAccount] = useState(false);

  const [profile, setProfile] = useState<SellerProfileData>({
    agency_name: '',
    license_number: '',
    bio: '',
    office_address: '',
    website: '',
    profile_image_url: '',
    public_profile_enabled: false,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [defaults, setDefaults] = useState<ListingDefaults>({
    default_country: '',
    default_currency: 'EUR',
    default_ownership_type: 'freehold',
    default_commission_percentage: '',
    show_price_publicly: true,
    show_contact_form: true,
  });
  const [savingDefaults, setSavingDefaults] = useState(false);

  const [leads, setLeads] = useState<LeadSettings>({
    email_notifications_enabled: true,
    auto_response_message: '',
    webhook_url: '',
  });
  const [savingLeads, setSavingLeads] = useState(false);

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    inquiry_received: true,
    system_announcements: true,
    marketing_updates: false,
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // ── fetch all data ─────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, sellerProfileRes, settingsRes, leadRes, notifRes] =
          await Promise.all([
            supabase.from('user_profiles').select('*').eq('id', user.id).single(),
            supabase.from('seller_profiles').select('*').eq('user_id', user.id).single(),
            supabase.from('seller_settings').select('*').eq('user_id', user.id).single(),
            supabase.from('seller_lead_settings').select('*').eq('user_id', user.id).single(),
            supabase.from('user_notification_preferences').select('*').eq('user_id', user.id).single(),
          ]);

        // Account (user_profiles)
        if (profileRes.data) {
          setAccount((prev) => ({
            ...prev,
            first_name: profileRes.data.first_name || '',
            last_name: profileRes.data.last_name || '',
            phone: profileRes.data.phone || '',
            country: profileRes.data.country || '',
            preferred_language: profileRes.data.preferred_language || 'en',
          }));
        } else {
          // Populate from auth metadata
          const name = user.user_metadata?.name || '';
          const parts = name.split(' ');
          setAccount((prev) => ({
            ...prev,
            first_name: parts[0] || '',
            last_name: parts.slice(1).join(' ') || '',
          }));
        }

        // Seller profile
        if (sellerProfileRes.data) {
          setProfile({
            agency_name: sellerProfileRes.data.agency_name || '',
            license_number: sellerProfileRes.data.license_number || '',
            bio: sellerProfileRes.data.bio || '',
            office_address: sellerProfileRes.data.office_address || '',
            website: sellerProfileRes.data.website || '',
            profile_image_url: sellerProfileRes.data.profile_image_url || '',
            public_profile_enabled: sellerProfileRes.data.public_profile_enabled ?? false,
          });
        }

        // Listing defaults
        if (settingsRes.data) {
          setDefaults({
            default_country: settingsRes.data.default_country || '',
            default_currency: settingsRes.data.default_currency || 'EUR',
            default_ownership_type: settingsRes.data.default_ownership_type || 'freehold',
            default_commission_percentage: settingsRes.data.default_commission_percentage?.toString() || '',
            show_price_publicly: settingsRes.data.show_price_publicly ?? true,
            show_contact_form: settingsRes.data.show_contact_form ?? true,
          });
        }

        // Lead settings
        if (leadRes.data) {
          setLeads({
            email_notifications_enabled: leadRes.data.email_notifications_enabled ?? true,
            auto_response_message: leadRes.data.auto_response_message || '',
            webhook_url: leadRes.data.webhook_url || '',
          });
        }

        // Notification prefs
        if (notifRes.data) {
          setNotifications({
            inquiry_received: notifRes.data.inquiry_received ?? true,
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
  }, [user.id]);

  // ── save handlers ──────────────────────────────

  const saveAccount = async () => {
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
    setSavingProfile(true);
    try {
      const { error } = await supabase.from('seller_profiles').upsert({
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      toast.success('Seller profile saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save seller profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadProfileImage(user.id, file);
      setProfile((prev) => ({ ...prev, profile_image_url: url }));
      // Auto-save after upload
      await supabase.from('seller_profiles').upsert({
        user_id: user.id,
        ...profile,
        profile_image_url: url,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      toast.success('Profile image updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveDefaults = async () => {
    setSavingDefaults(true);
    try {
      const { error } = await supabase.from('seller_settings').upsert({
        user_id: user.id,
        default_country: defaults.default_country,
        default_currency: defaults.default_currency,
        default_ownership_type: defaults.default_ownership_type,
        default_commission_percentage: defaults.default_commission_percentage ? parseFloat(defaults.default_commission_percentage) : null,
        show_price_publicly: defaults.show_price_publicly,
        show_contact_form: defaults.show_contact_form,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      toast.success('Listing defaults saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save listing defaults');
    } finally {
      setSavingDefaults(false);
    }
  };

  const saveLeads = async () => {
    setSavingLeads(true);
    try {
      const { error } = await supabase.from('seller_lead_settings').upsert({
        user_id: user.id,
        ...leads,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      toast.success('Lead settings saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save lead settings');
    } finally {
      setSavingLeads(false);
    }
  };

  const saveNotifications = async () => {
    setSavingNotifications(true);
    try {
      const { error } = await supabase.from('user_notification_preferences').upsert({
        user_id: user.id,
        inquiry_received: notifications.inquiry_received,
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
    setDeletingAccount(true);
    try {
      // Delete related rows first
      await Promise.all([
        supabase.from('seller_profiles').delete().eq('user_id', user.id),
        supabase.from('seller_settings').delete().eq('user_id', user.id),
        supabase.from('seller_lead_settings').delete().eq('user_id', user.id),
        supabase.from('user_notification_preferences').delete().eq('user_id', user.id),
        supabase.from('user_profiles').delete().eq('id', user.id),
        supabase.from('properties').delete().eq('user_id', user.id),
      ]);
      // Sign out (actual auth.users deletion requires server-side admin call)
      await supabase.auth.signOut();
      toast.success('Account deleted');
      navigate(`/${language}/`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
      setDeletingAccount(false);
    }
  };

  // ── render ─────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0e2e50]">Settings</h2>
          <p className="text-muted-foreground mt-2 font-medium">Manage your account and preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#0e2e50]">Settings</h2>
        <p className="text-muted-foreground mt-2 font-medium">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              className="bg-[#0e2e50] hover:bg-[#0e2e50]/90 rounded-xl h-11"
            >
              {savingAccount && <Loader2 size={16} className="mr-2 animate-spin" />}
              Save Account
            </Button>
          </div>
        </SettingsCard>

        {/* ── SECTION 2: Seller Profile ───────────── */}
        <SettingsCard icon={Building2} title="Seller Profile">
          <div className="space-y-5">
            {/* Profile image */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl bg-secondary/50 overflow-hidden border border-border flex items-center justify-center">
                {profile.profile_image_url ? (
                  <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={24} className="text-muted-foreground" />
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 size={20} className="text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 5MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agency Name</Label>
                <Input
                  value={profile.agency_name}
                  onChange={(e) => setProfile({ ...profile, agency_name: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>License Number</Label>
                <Input
                  value={profile.license_number}
                  onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-[#0e2e50]/20 focus:outline-none resize-none text-sm"
                placeholder="Tell potential buyers about yourself..."
              />
            </div>
            <div className="space-y-2">
              <Label>Office Address</Label>
              <Input
                value={profile.office_address}
                onChange={(e) => setProfile({ ...profile, office_address: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="h-12 rounded-xl"
                placeholder="https://"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Public Profile</p>
                <p className="text-xs text-muted-foreground">Allow buyers to see your profile page</p>
              </div>
              <Switch
                checked={profile.public_profile_enabled}
                onCheckedChange={(v) => setProfile({ ...profile, public_profile_enabled: v })}
              />
            </div>
            <Button
              onClick={saveProfile}
              disabled={savingProfile}
              className="bg-[#0e2e50] hover:bg-[#0e2e50]/90 rounded-xl h-11"
            >
              {savingProfile && <Loader2 size={16} className="mr-2 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </SettingsCard>

        {/* ── SECTION 3: Listing Defaults ─────────── */}
        <SettingsCard icon={Settings} title="Listing Defaults">
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Country</Label>
                <Input
                  value={defaults.default_country}
                  onChange={(e) => setDefaults({ ...defaults, default_country: e.target.value })}
                  className="h-12 rounded-xl"
                  placeholder="Indonesia"
                />
              </div>
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select value={defaults.default_currency} onValueChange={(v) => setDefaults({ ...defaults, default_currency: v })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="IDR">IDR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ownership Type</Label>
                <Select value={defaults.default_ownership_type} onValueChange={(v) => setDefaults({ ...defaults, default_ownership_type: v })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freehold">Freehold</SelectItem>
                    <SelectItem value="leasehold">Leasehold</SelectItem>
                    <SelectItem value="right-to-use">Right to Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Commission %</Label>
                <Input
                  type="number"
                  value={defaults.default_commission_percentage}
                  onChange={(e) => setDefaults({ ...defaults, default_commission_percentage: e.target.value })}
                  className="h-12 rounded-xl"
                  placeholder="5"
                  min="0"
                  max="100"
                  step="0.5"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Show Price Publicly</p>
                  <p className="text-xs text-muted-foreground">Display prices on property listings</p>
                </div>
                <Switch
                  checked={defaults.show_price_publicly}
                  onCheckedChange={(v) => setDefaults({ ...defaults, show_price_publicly: v })}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Show Contact Form</p>
                  <p className="text-xs text-muted-foreground">Display contact form on listings</p>
                </div>
                <Switch
                  checked={defaults.show_contact_form}
                  onCheckedChange={(v) => setDefaults({ ...defaults, show_contact_form: v })}
                />
              </div>
            </div>
            <Button
              onClick={saveDefaults}
              disabled={savingDefaults}
              className="bg-[#0e2e50] hover:bg-[#0e2e50]/90 rounded-xl h-11"
            >
              {savingDefaults && <Loader2 size={16} className="mr-2 animate-spin" />}
              Save Defaults
            </Button>
          </div>
        </SettingsCard>

        {/* ── SECTION 4: Lead Settings ────────────── */}
        <SettingsCard icon={Megaphone} title="Lead Settings">
          <div className="space-y-5">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified when a lead comes in</p>
              </div>
              <Switch
                checked={leads.email_notifications_enabled}
                onCheckedChange={(v) => setLeads({ ...leads, email_notifications_enabled: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>Auto-Response Message</Label>
              <textarea
                value={leads.auto_response_message}
                onChange={(e) => setLeads({ ...leads, auto_response_message: e.target.value })}
                className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-[#0e2e50]/20 focus:outline-none resize-none text-sm"
                placeholder="Thank you for your inquiry. I will get back to you within 24 hours."
              />
            </div>
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input
                value={leads.webhook_url}
                onChange={(e) => setLeads({ ...leads, webhook_url: e.target.value })}
                className="h-12 rounded-xl"
                placeholder="https://hooks.example.com/leads"
              />
              <p className="text-xs text-muted-foreground">Optional: Forward new leads to your CRM</p>
            </div>
            <Button
              onClick={saveLeads}
              disabled={savingLeads}
              className="bg-[#0e2e50] hover:bg-[#0e2e50]/90 rounded-xl h-11"
            >
              {savingLeads && <Loader2 size={16} className="mr-2 animate-spin" />}
              Save Lead Settings
            </Button>
          </div>
        </SettingsCard>

        {/* ── SECTION 5: Notifications ────────────── */}
        <SettingsCard icon={Bell} title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Inquiry Received</p>
                <p className="text-xs text-muted-foreground">When someone sends an inquiry on your listing</p>
              </div>
              <Switch
                checked={notifications.inquiry_received}
                onCheckedChange={(v) => setNotifications({ ...notifications, inquiry_received: v })}
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
                <p className="text-xs text-muted-foreground">Tips, promotions, and news</p>
              </div>
              <Switch
                checked={notifications.marketing_updates}
                onCheckedChange={(v) => setNotifications({ ...notifications, marketing_updates: v })}
              />
            </div>
            <Button
              onClick={saveNotifications}
              disabled={savingNotifications}
              className="bg-[#0e2e50] hover:bg-[#0e2e50]/90 rounded-xl h-11 mt-2"
            >
              {savingNotifications && <Loader2 size={16} className="mr-2 animate-spin" />}
              Save Notifications
            </Button>
          </div>
        </SettingsCard>

        {/* ── SECTION 6: Security ─────────────────── */}
        <SettingsCard icon={Shield} title="Security">
          <div className="space-y-6">
            {/* Change password */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#0e2e50] uppercase tracking-wider">Change Password</h4>
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
                className="bg-[#0e2e50] hover:bg-[#0e2e50]/90 rounded-xl h-11"
              >
                {savingPassword && <Loader2 size={16} className="mr-2 animate-spin" />}
                Update Password
              </Button>
            </div>

            {/* Danger zone */}
            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4">Danger Zone</h4>
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
                      all your listings, leads, and settings data.
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
  );
}
