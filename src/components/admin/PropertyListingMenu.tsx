import { useState } from 'react';
import { Star, Zap, Trash2, MoreVertical, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PricingPlan {
  duration: string;
  price: number;
  save: number;
}

interface PropertyListingMenuProps {
  property: {
    id: string;
    title: string;
    featured?: boolean;
    featured_until?: string;
  };
  onRefresh?: () => void;
  onEdit?: (propertyId: string) => void;
}

export function PropertyListingMenu({ property, onRefresh, onEdit }: PropertyListingMenuProps) {
  const { t } = useLanguage();
  const [showFeaturedDialog, setShowFeaturedDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFeatured = property.featured || false;

  const featuredPricing = [
    { duration: '7 days', price: 29, save: 0 },
    { duration: '30 days', price: 99, save: 0 },
    { duration: '90 days', price: 249, save: 0 },
  ];

  const handleToggleFeatured = async (plan: PricingPlan) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('properties')
        .update({
          featured: !isFeatured,
          featured_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', property.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(
        isFeatured
          ? 'Featured status removed'
          : `Property featured for ${plan.duration}!`
      );
      setShowFeaturedDialog(false);
      onRefresh?.();
    } catch (err) {
      console.error('Error updating featured status:', err);
      toast.error('Failed to update featured status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Listing deleted successfully');
      setShowDeleteDialog(false);
      onRefresh?.();
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast.error('Failed to delete listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button onClick={(e) => e.stopPropagation()} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-muted-foreground">
            <MoreVertical size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
            {t('dashboard.actions') || 'Actions'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowFeaturedDialog(true)}
            className="cursor-pointer flex items-center gap-2"
          >
            <Star size={16} className={isFeatured ? 'fill-amber-400 text-amber-400' : ''} />
            <span className="text-sm">
              {isFeatured ? 'Manage Featured' : 'Make Featured'}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onEdit?.(property.id)}
            className="cursor-pointer flex items-center gap-2"
          >
            <Edit size={16} />
            <span className="text-sm">Edit Listing</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
            <span className="text-sm">Delete Listing</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showFeaturedDialog} onOpenChange={setShowFeaturedDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="text-amber-500" size={24} />
              Boost Your Listing with Featured
            </DialogTitle>
            <DialogDescription>
              Get more visibility and attract qualified buyers faster. Choose a plan that works for you.
            </DialogDescription>
          </DialogHeader>

          {isFeatured && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
              <p className="text-sm font-semibold text-green-900">
                ✓ This property is currently featured
              </p>
              <p className="text-xs text-green-700 mt-1">
                Featured until: {property.featured_until ? new Date(property.featured_until).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            {featuredPricing.map((plan, idx) => (
              <div
                key={idx}
                className="border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow hover:border-amber-400/50 relative"
              >
                {plan.save > 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Save {plan.save}%
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">{plan.duration}</p>
                  <p className="text-3xl font-bold text-[#0e2e50] mb-4">
                    ${plan.price}
                  </p>
                  <Button
                    onClick={() => handleToggleFeatured(plan)}
                    disabled={loading}
                    className="w-full bg-[#0e2e50] hover:bg-[#0e2e50]/90 text-white rounded-xl"
                  >
                    {loading ? 'Processing...' : 'Choose Plan'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 bg-secondary/30 rounded-2xl p-6">
            <h4 className="font-semibold text-[#0e2e50] text-sm">What You Get:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Featured placement on homepage
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Highlighted with star icon throughout site
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Increased visibility in search results
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Boost buyer engagement
              </li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFeaturedDialog(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            {isFeatured && (
              <Button
                variant="destructive"
                onClick={() => handleToggleFeatured({ duration: 'Immediately', price: 0, save: 0 })}
                disabled={loading}
                className="rounded-xl"
              >
                Remove Featured
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={24} />
              Delete Listing
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{property.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-sm font-semibold text-red-900">
              ⚠️ This will permanently delete the listing
            </p>
            <p className="text-xs text-red-700 mt-1">
              All images, details, and history will be removed from the system.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteListing}
              disabled={loading}
              className="rounded-xl"
            >
              {loading ? 'Deleting...' : 'Delete Listing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
