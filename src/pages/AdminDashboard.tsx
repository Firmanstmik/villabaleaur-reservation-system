import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AdminGuard } from '@/components/guards/AdminGuard';
import PartnerManagement from '@/components/admin/PartnerManagement';

type AdminTab = 'partners';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('partners');
    const navigate = useNavigate();
    const { language, t } = useLanguage();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Logged out successfully');
        navigate(`/${language}/`);
    };

    const navigationItems = [
        { id: 'partners' as AdminTab, icon: Shield, label: t('admin.partnerManagement') },
    ];

    return (
        <AdminGuard>
            <div className="min-h-screen bg-secondary/30 flex">
                {/* Sidebar */}
                <aside className="w-64 bg-[#0e2e50] text-white flex flex-col p-6 fixed h-full z-10">
                    <div className="mb-10 px-2">
                        <h1 className="text-xl font-bold tracking-tighter text-white">UKON ESTATE</h1>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1 font-bold">{t('admin.title')}</p>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${activeTab === item.id
                                    ? 'bg-white text-[#0e2e50] font-bold shadow-lg'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon size={20} className={activeTab === item.id ? 'text-[#0e2e50] scale-110' : 'group-hover:scale-110 transition-transform'} />
                                {item.label}
                                {activeTab === item.id && (
                                    <motion.div
                                        layoutId="adminActiveTab"
                                        className="absolute inset-0 bg-white rounded-2xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Back to Agent Dashboard */}
                    <button
                        onClick={() => navigate(`/${language}/dashboard`)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition-all mb-2"
                    >
                        <LayoutDashboard size={20} />
                        {t('admin.backToDashboard')}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white/60 hover:text-white hover:bg-ukon-red/20 transition-all border border-transparent hover:border-ukon-red/30"
                    >
                        <LogOut size={20} />
                        {t('navigation.logout')}
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'partners' && (
                                <motion.div
                                    key="partners"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <PartnerManagement />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
};

export default AdminDashboard;
