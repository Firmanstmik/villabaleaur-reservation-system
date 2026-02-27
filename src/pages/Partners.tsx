import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPanel } from '@/contexts/AuthPanelContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import heroBg from '@/assets/Ukon_Estate_Hero.avif';
import heroVideo from '@/assets/Ukon_Estate_hero-video-v2.mp4';

const Partners = () => {
  const { t, language } = useLanguage();
  const { user, userType, loading: authLoading } = useAuth();
  const { openAuthPanel } = useAuthPanel();

  const [existingApplication, setExistingApplication] = useState<{
    status: 'pending' | 'approved' | 'rejected';
  } | null>(null);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    agency_website: '',
    number_of_agents: '',
    areas_active: '',
    strategic_motivation: '',
    contact_email: '',
    contact_phone: '',
    linkedin: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || userType !== 'agent') {
      setCheckingApplication(false);
      return;
    }
    const checkExisting = async () => {
      const { data } = await supabase
        .from('partnership_applications')
        .select('status')
        .eq('user_id', user.id)
        .single();
      if (data) setExistingApplication(data as { status: 'pending' | 'approved' | 'rejected' });
      setCheckingApplication(false);
    };
    checkExisting();
  }, [user, userType, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('partnership_applications')
        .insert({
          user_id: user.id,
          agency_website: formData.agency_website,
          number_of_agents: parseInt(formData.number_of_agents, 10),
          areas_active: formData.areas_active,
          strategic_motivation: formData.strategic_motivation,
          contact_email: formData.contact_email || null,
          contact_phone: formData.contact_phone || null,
          linkedin: formData.linkedin || null,
        });
      if (error) {
        if (error.code === '23505') {
          toast.error(t('partners.formDuplicate'));
        } else {
          throw error;
        }
      } else {
        toast.success(t('partners.formSuccess'));
        setExistingApplication({ status: 'pending' });
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error(t('partners.formError'));
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderFormSection = () => {
    if (authLoading || checkingApplication) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-white mb-3">{t('partners.loginRequired')}</h3>
          <p className="text-white/60 leading-relaxed mb-8">{t('partners.loginRequiredText')}</p>
          <Button
            onClick={() => openAuthPanel('signup')}
            className="bg-white text-ukon-navy hover:bg-white/90 px-8 py-3 text-base font-medium"
          >
            {t('partners.loginCta')}
          </Button>
        </div>
      );
    }

    if (userType === 'buyer') {
      return (
        <div className="text-center max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-white mb-3">{t('partners.buyerNotice')}</h3>
          <p className="text-white/60 leading-relaxed">{t('partners.buyerNoticeText')}</p>
        </div>
      );
    }

    if (existingApplication) {
      const statusConfig = {
        pending: { icon: Clock, title: t('partners.statusPending'), text: t('partners.statusPendingText'), color: 'text-amber-400' },
        approved: { icon: CheckCircle, title: t('partners.statusApproved'), text: t('partners.statusApprovedText'), color: 'text-emerald-400' },
        rejected: { icon: XCircle, title: t('partners.statusRejected'), text: t('partners.statusRejectedText'), color: 'text-red-400' },
      };
      const config = statusConfig[existingApplication.status];
      const Icon = config.icon;

      return (
        <div className="text-center max-w-lg mx-auto">
          <Icon className={`h-12 w-12 ${config.color} mx-auto mb-4`} />
          <h3 className="text-2xl font-bold text-white mb-3">{config.title}</h3>
          <p className="text-white/60 leading-relaxed">{config.text}</p>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('partners.formHeadline')}</h3>
          <p className="text-white/60 leading-relaxed">{t('partners.formSubtext')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">{t('partners.formAgencyWebsite')}</Label>
              <Input
                type="url"
                required
                value={formData.agency_website}
                onChange={(e) => updateField('agency_website', e.target.value)}
                placeholder={t('partners.formAgencyWebsitePlaceholder')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">{t('partners.formNumberOfAgents')}</Label>
              <Input
                type="number"
                required
                min={1}
                value={formData.number_of_agents}
                onChange={(e) => updateField('number_of_agents', e.target.value)}
                placeholder={t('partners.formNumberOfAgentsPlaceholder')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/80 text-sm font-medium">{t('partners.formAreasActive')}</Label>
            <Input
              required
              value={formData.areas_active}
              onChange={(e) => updateField('areas_active', e.target.value)}
              placeholder={t('partners.formAreasActivePlaceholder')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80 text-sm font-medium">{t('partners.formStrategicMotivation')}</Label>
            <Textarea
              required
              rows={4}
              value={formData.strategic_motivation}
              onChange={(e) => updateField('strategic_motivation', e.target.value)}
              placeholder={t('partners.formStrategicMotivationPlaceholder')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-xl resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">{t('partners.formContactEmail')}</Label>
              <Input
                type="email"
                value={formData.contact_email}
                onChange={(e) => updateField('contact_email', e.target.value)}
                placeholder={t('partners.formContactEmailPlaceholder')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">{t('partners.formContactPhone')}</Label>
              <Input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => updateField('contact_phone', e.target.value)}
                placeholder={t('partners.formContactPhonePlaceholder')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/80 text-sm font-medium">{t('partners.formLinkedin')}</Label>
            <Input
              type="url"
              value={formData.linkedin}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder={t('partners.formLinkedinPlaceholder')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 h-12 rounded-xl"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-ukon-navy hover:bg-white/90 h-14 text-base font-medium rounded-xl"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t('partners.formSubmitting')}
                </>
              ) : (
                t('partners.formSubmit')
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <section className="relative py-28 md:py-36 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={heroBg}
            src={heroVideo}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: 'block', transform: 'scale(1.05)' }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[2.5rem] md:text-[3.25rem] lg:text-[4rem] font-bold text-white mb-6 tracking-tight leading-[1.1]"
              >
                {t('partners.heroHeadline')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl md:text-2xl text-white/75 font-light mb-5 max-w-xl"
              >
                {t('partners.heroSubheadline')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/50 text-lg"
              >
                {t('partners.heroSupportingLine')}
              </motion.p>
            </div>
          </div>
        </section>

        {/* 2. Why Partnerships Matter */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">
              <div>
                <h2 className="text-[2rem] md:text-[2.75rem] font-bold text-foreground leading-[1.15]">
                  {t('partners.introHeadline')}
                </h2>
              </div>
              <div className="space-y-6 max-w-lg">
                <p className="text-muted-foreground text-lg leading-[1.85]">
                  {t('partners.introText1')}
                </p>
                <p className="text-muted-foreground text-lg leading-[1.85]">
                  {t('partners.introText2')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. What We Are Building */}
        <section className="py-32 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              {t('partners.buildingHeadline')}
            </h2>
            <p className="text-muted-foreground text-lg leading-[1.85] text-center">
              {t('partners.buildingText')}
            </p>
          </div>
        </section>

        {/* 4. What We Expect */}
        <section className="py-32">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              {t('partners.expectHeadline')}
            </h2>
            <ul className="space-y-6 text-muted-foreground text-lg leading-[1.8]">
              {(['expectItem1', 'expectItem2', 'expectItem3', 'expectItem4'] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="mt-2.5 block w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                  <span>{t(`partners.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. What Partners Gain */}
        <section className="py-32 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
              {t('partners.gainHeadline')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {(['gainItem1', 'gainItem2', 'gainItem3', 'gainItem4'] as const).map((key) => (
                <div key={key}>
                  <div className="w-8 h-px bg-foreground/25 mb-6" />
                  <p className="text-muted-foreground leading-[1.8]">
                    {t(`partners.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Application Form */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="bg-ukon-navy rounded-xl p-14 md:p-20">
              {renderFormSection()}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Partners;
