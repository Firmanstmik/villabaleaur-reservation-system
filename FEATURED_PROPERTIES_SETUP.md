# Featured Properties Setup Guide

## Database Schema Changes

To enable the featured properties paid feature for sellers, you need to add the following columns to the `properties` table in Supabase:

### Required Columns

```sql
-- Add to the 'properties' table in Supabase
ALTER TABLE properties ADD COLUMN featured BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN featured_until TIMESTAMP;
```

### Optional Columns (for future enhancement)

```sql
-- Track featured purchase history
ALTER TABLE properties ADD COLUMN featured_purchases JSONB;

-- Example structure for featured_purchases:
-- [
--   {
--     "purchased_at": "2024-01-15T10:30:00Z",
--     "duration_days": 30,
--     "expires_at": "2024-02-14T10:30:00Z",
--     "price_paid": 99,
--     "status": "active"
--   }
-- ]
```

## Implementation Details

### Current State

The featured option is now available in the dashboard for sellers:

1. **Dashboard Integration**
   - Added "Featured" column to both overview and listings tables
   - Added star icon indicator for featured properties
   - Integrated `PropertyListingMenu` component with dropdown options

2. **PropertyListingMenu Component**
   - Located at: `src/components/admin/PropertyListingMenu.tsx`
   - Features:
     - Make/Manage Featured option with pricing plans
     - 7 days ($29), 30 days ($99), 90 days ($249)
     - Display current featured status with expiration date
     - Remove featured option for active listings

3. **Frontend Pricing Plans**
   ```
   - 7 days: $29
   - 30 days: $99
   - 90 days: $249
   ```

### What's Not Yet Implemented

- **Payment Processing**: Currently toggles featured flag without payment
- **Email Notifications**: No notifications sent to sellers
- **Stripe Integration**: Needs to be integrated with payment gateway
- **Admin Dashboard**: No analytics on featured listings performance

### Next Steps to Go Live

1. **Add database columns** (see SQL above)
2. **Integrate Stripe/Payment Gateway**
   - Add Stripe API integration
   - Update `PropertyListingMenu.tsx` to handle payment
   - Add webhook to confirm payment before setting featured flag

3. **Add Email Notifications**
   - Notify seller when featured status activated
   - Notify seller 2 days before expiration

4. **Track Analytics**
   - Monitor featured listings performance
   - Show sellers click-through rates and engagement

## Usage

### For Sellers

1. Go to Dashboard → Listings
2. Click the options menu (⋯) on a property
3. Select "Make Featured"
4. Choose a plan (7, 30, or 90 days)
5. Complete payment
6. Property appears on homepage with star icon

### For Admin

- View featured listings in the main dashboard
- See featured status in the properties table
- Monitor which properties are featured and their expiration dates
