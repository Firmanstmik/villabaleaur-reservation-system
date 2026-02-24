import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Bell,
  Settings,
  LogOut,
  Trash2,
  MapPin,
  DollarSign,
  Home,
  X as XIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Tab = 'saved' | 'alerts' | 'settings';

interface SavedProperty {
  id: string;
  property_id: string;
  created_at: string;
  property?: any;
}

interface SearchAlert {
  id: string;
  name: string;
  search_params: any;
  email_notifications: boolean;
  created_at: string;
}

const Account = () => {
  const { user, signOut, userType } = useAuth();
  const { t, language } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [searchAlerts, setSearchAlerts] = useState<SearchAlert[]>([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Redirect agents and non-authenticated users
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

  // Load user data
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // Load saved properties
        const { data: savedData, error: savedError } = await supabase
          .from('saved_listings')
          .select(`
            id,
            property_id,
            created_at,
            property:property_id(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (savedError) throw savedError;
        setSavedProperties(savedData || []);

        // Load search alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from('search_alerts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (alertsError) throw alertsError;
        setSearchAlerts(alertsData || []);

        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        if (profileData) {
          setFullName(profileData.full_name || '');
          setPhone(profileData.phone || '');
          setBio(profileData.bio || '');
        } else {
          // Set initial name from auth metadata
          setFullName(user.user_metadata?.name || '');
        }
      } catch (error) {
        console.error('Error loading account data:', error);
        toast.error(t('common.failedToLoadAccount'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleRemoveSavedProperty = async (savedListingId: string) => {
    try {
      const { error } = await supabase
        .from('saved_listings')
        .delete()
        .eq('id', savedListingId);

      if (error) throw error;

      setSavedProperties(savedProperties.filter((p) => p.id !== savedListingId));
      toast.success(t('common.propertyRemoved'));
    } catch (error) {
      console.error('Error removing property:', error);
      toast.error(t('common.failedToRemove'));
    }
  };

  const handleRemoveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('search_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setSearchAlerts(searchAlerts.filter((a) => a.id !== alertId));
      toast.success(t('common.alertRemoved'));
    } catch (error) {
      console.error('Error removing alert:', error);
      toast.error(t('common.failedToRemoveAlert'));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSavingProfile(true);

      const { error } = await supabase.from('user_profiles').upsert({
        id: user.id,
        full_name: fullName,
        phone,
        bio,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success(t('common.profileUpdated'));
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('common.failedToUpdate'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(t('auth.messages.successfulLogout'));
      navigate(`/${language}/`);
    } catch (error) {
      toast.error(t('auth.messages.failedLogout'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ukon-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="flex-1 bg-secondary/30">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-border"
        >
          <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground">{t('account.myAccount')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">{t('account.saved')}</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t('account.alerts')}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t('account.settings')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Saved Properties Tab */}
          <TabsContent value="saved" className="space-y-6 mt-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('account.savedProperties')}</h2>

              {savedProperties.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-12 text-center border border-border"
                >
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">{t('account.noSavedProperties')}</p>
                  <Button
                    onClick={() => navigate(`/${language}/properties`)}
                    className="mt-4 bg-ukon-navy hover:bg-ukon-navy/90"
                  >
                    {t('account.browseProperties')}
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {savedProperties.map((saved, index) => (
                      <motion.div
                        key={saved.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl overflow-hidden border border-border hover:border-ukon-navy/30 transition-colors group"
                      >
                        {/* Property Image */}
                        <div className="relative h-48 bg-secondary overflow-hidden">
                          {saved.property?.images?.[0] ? (
                            <img
                              src={saved.property.images[0]}
                              alt={saved.property?.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ukon-navy/20 to-ukon-navy/10">
                              <Home className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveSavedProperty(saved.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Property Details */}
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {saved.property?.title}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            {saved.property?.location}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-ukon-red" />
                              <span className="font-bold text-lg text-ukon-red">
                                {formatPrice(saved.property?.price || 0, currency, language)}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/${language}/property/${saved.property?.id}`)}
                            >
                              {t('propertyDetail.seeMore')}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Search Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6 mt-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{t('account.searchAlerts')}</h2>
                <Button className="bg-ukon-navy hover:bg-ukon-navy/90">
                  <Bell className="h-4 w-4 mr-2" />
                  {t('account.createAlert')}
                </Button>
              </div>

              {searchAlerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-12 text-center border border-border"
                >
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">{t('account.noSearchAlerts')}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('account.createAlertDescription')}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {searchAlerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl p-6 border border-border flex items-center justify-between hover:border-ukon-navy/30 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{alert.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {JSON.stringify(alert.search_params || {})}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {alert.email_notifications ? `📧 ${t('account.emailNotificationsEnabled')}` : t('account.noNotifications')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAlert(alert.id)}
                          className="text-ukon-red hover:bg-ukon-red/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-border"
            >
              <h2 className="text-xl font-semibold mb-6">{t('account.accountSettings')}</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
                className="space-y-6"
              >
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">{t('account.fullName')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('account.yourName')}
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t('account.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="h-12 rounded-xl bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('account.changeEmailContact')}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('account.phoneNumber')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('account.phoneExample')}
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">{t('account.bio')}</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t('account.tellUsAbout')}
                    className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ukon-navy focus:outline-none resize-none"
                  />
                </div>

                {/* Save Button */}
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full h-12 bg-ukon-navy hover:bg-ukon-navy/90 text-white font-semibold rounded-xl"
                >
                  {isSavingProfile ? t('account.saving') : t('account.saveChanges')}
                </Button>
              </form>

              {/* Full Settings Link */}
              <div className="mt-8 pt-8 border-t border-border">
                <Button
                  onClick={() => navigate(`/${language}/account/settings`)}
                  variant="outline"
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 mb-4"
                >
                  <Settings className="h-4 w-4" />
                  All Settings
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t('account.signOut')}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Account;
