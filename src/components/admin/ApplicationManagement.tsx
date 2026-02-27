import { useState, useEffect } from 'react';
import { FileText, Search, Loader2, CheckCircle, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PartnershipApplication {
    id: string;
    user_id: string;
    agency_website: string;
    number_of_agents: number;
    areas_active: string;
    strategic_motivation: string;
    linkedin: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by: string | null;
    reviewed_at: string | null;
    created_at: string;
    applicant_email: string | null;
    applicant_agency_name: string | null;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const ApplicationManagement = () => {
    const { t } = useLanguage();
    const [applications, setApplications] = useState<PartnershipApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [processing, setProcessing] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        applicationId: string;
        applicantName: string;
        decision: 'approved' | 'rejected';
    }>({ open: false, applicationId: '', applicantName: '', decision: 'approved' });

    const fetchApplications = async () => {
        try {
            const { data, error } = await supabase.rpc('get_partnership_applications_admin');
            if (error) throw error;
            setApplications((data as PartnershipApplication[]) || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
            toast.error('Failed to load partnership applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleDecisionRequest = (app: PartnershipApplication, decision: 'approved' | 'rejected') => {
        setConfirmDialog({
            open: true,
            applicationId: app.id,
            applicantName: app.applicant_agency_name || app.applicant_email || 'Unknown',
            decision,
        });
    };

    const handleConfirmDecision = async () => {
        const { applicationId, decision } = confirmDialog;
        setConfirmDialog(prev => ({ ...prev, open: false }));
        setProcessing(applicationId);

        try {
            const { error } = await supabase.rpc('review_partnership_application', {
                p_application_id: applicationId,
                p_decision: decision,
            });
            if (error) throw error;

            setApplications(prev =>
                prev.map(a =>
                    a.id === applicationId ? { ...a, status: decision } : a
                )
            );

            toast.success(
                decision === 'approved'
                    ? 'Partnership application approved'
                    : 'Partnership application rejected'
            );
        } catch (err) {
            console.error('Error reviewing application:', err);
            toast.error('Failed to review application');
        } finally {
            setProcessing(null);
        }
    };

    const filteredApplications = applications.filter(a => {
        if (statusFilter !== 'all' && a.status !== statusFilter) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            a.applicant_agency_name?.toLowerCase().includes(q) ||
            a.applicant_email?.toLowerCase().includes(q) ||
            a.areas_active?.toLowerCase().includes(q)
        );
    });

    const pendingCount = applications.filter(a => a.status === 'pending').length;

    const statusBadge = (status: string) => {
        const config: Record<string, { icon: typeof Clock; label: string; className: string }> = {
            pending: { icon: Clock, label: 'Pending', className: 'bg-amber-100 text-amber-700' },
            approved: { icon: CheckCircle, label: 'Approved', className: 'bg-emerald-100 text-emerald-700' },
            rejected: { icon: XCircle, label: 'Rejected', className: 'bg-red-100 text-red-700' },
        };
        const c = config[status] || config.pending;
        const Icon = c.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${c.className}`}>
                <Icon size={10} />
                {c.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-[#0e2e50]" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#0e2e50]">{t('admin.applications')}</h2>
                    <p className="text-muted-foreground mt-2 font-medium">
                        {applications.length} {t('admin.applications').toLowerCase()} &middot; {pendingCount} pending
                    </p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, or area..."
                        className="pl-10 rounded-xl h-12"
                    />
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 mb-8">
                {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors duration-150 capitalize ${
                            statusFilter === filter
                                ? 'bg-[#0e2e50] text-white'
                                : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
                        }`}
                    >
                        {filter === 'all' ? 'All' : filter}
                        {filter === 'pending' && pendingCount > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-white/20 rounded-full">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <FileText size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="font-medium">{t('admin.noApplications')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApplications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden"
                        >
                            {/* Main Row */}
                            <div
                                className="px-8 py-6 flex items-center gap-6 cursor-pointer hover:bg-secondary/20 transition-colors"
                                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="font-bold text-[#0e2e50] truncate">
                                            {app.applicant_agency_name || 'Unnamed Agency'}
                                        </p>
                                        {statusBadge(app.status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {app.applicant_email || '—'}
                                    </p>
                                </div>

                                <div className="hidden md:block text-sm text-muted-foreground">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('admin.applicationAgents')}</span>
                                    <p className="font-bold text-foreground">{app.number_of_agents}</p>
                                </div>

                                <div className="hidden lg:block text-sm text-muted-foreground max-w-48">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('admin.applicationAreas')}</span>
                                    <p className="truncate text-foreground">{app.areas_active}</p>
                                </div>

                                <div className="hidden md:block text-sm text-muted-foreground">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('admin.applicationDate')}</span>
                                    <p className="text-foreground">{new Date(app.created_at).toLocaleDateString()}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {app.status === 'pending' && processing !== app.id && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); handleDecisionRequest(app, 'approved'); }}
                                                className="bg-[#0e2e50] text-white hover:bg-[#0e2e50]/90 rounded-xl h-9 px-4"
                                            >
                                                <CheckCircle size={14} className="mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => { e.stopPropagation(); handleDecisionRequest(app, 'rejected'); }}
                                                className="rounded-xl h-9 px-4 text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <XCircle size={14} className="mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {processing === app.id && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                    {expandedId === app.id ? (
                                        <ChevronUp size={18} className="text-muted-foreground" />
                                    ) : (
                                        <ChevronDown size={18} className="text-muted-foreground" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Detail */}
                            {expandedId === app.id && (
                                <div className="px-8 py-6 border-t border-border bg-secondary/10 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('admin.applicationWebsite')}</span>
                                            <a
                                                href={app.agency_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-[#0e2e50] font-medium hover:underline mt-1"
                                            >
                                                {app.agency_website}
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                        {app.linkedin && (
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">LinkedIn</span>
                                                <a
                                                    href={app.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[#0e2e50] font-medium hover:underline mt-1"
                                                >
                                                    {app.linkedin}
                                                    <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {app.contact_email && (
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('admin.applicationContactEmail')}</span>
                                                <p className="text-foreground mt-1">{app.contact_email}</p>
                                            </div>
                                        )}
                                        {app.contact_phone && (
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('admin.applicationContactPhone')}</span>
                                                <p className="text-foreground mt-1">{app.contact_phone}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('admin.applicationMotivation')}</span>
                                        <p className="text-foreground leading-relaxed mt-1 whitespace-pre-wrap">
                                            {app.strategic_motivation}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog.decision === 'approved'
                                ? t('admin.applicationApproveConfirm')
                                : t('admin.applicationRejectConfirm')
                            }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog.decision === 'approved'
                                ? t('admin.applicationApproveDesc').replace('{name}', confirmDialog.applicantName)
                                : t('admin.applicationRejectDesc').replace('{name}', confirmDialog.applicantName)
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDecision}
                            className={confirmDialog.decision === 'rejected'
                                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                : 'bg-[#0e2e50] text-white hover:bg-[#0e2e50]/90'
                            }
                        >
                            {confirmDialog.decision === 'approved' ? 'Approve' : 'Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ApplicationManagement;
