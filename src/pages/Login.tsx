import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success('Successfully logged in');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Error logging in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-20 w-72 h-72 bg-ukon-red/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -right-20 w-72 h-72 bg-[#0e2e50]/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Site
                    </button>
                    <div className="w-16 h-16 bg-[#0e2e50] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <LogIn className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
                    <p className="text-muted-foreground mt-2">Sign in to manage your property catalog</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                type="email"
                                required
                                placeholder="admin@ukonestate.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 h-12 rounded-xl bg-secondary/20 border-border focus:border-[#0e2e50] focus:ring-0 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-12 h-12 rounded-xl bg-secondary/20 border-border focus:border-[#0e2e50] focus:ring-0 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-[#0e2e50] hover:bg-[#0e2e50]/90 text-white font-bold text-lg shadow-lg transition-all"
                    >
                        {loading ? 'Sign in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        Protected area for Ukon Estate Administrators.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
