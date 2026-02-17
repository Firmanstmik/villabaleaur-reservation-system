import { NumericStepper } from './NumericStepper';
import { DatePickerField } from './DatePickerField';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SpecificationsStepProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (field: string, value: string) => void;
}

export function SpecificationsStep({
    formData,
    handleInputChange,
    handleSelectChange,
}: SpecificationsStepProps) {
    return (
        <div className="space-y-[30px]">
            {/* PANEL 1 — STRUCTURE */}
            <div className="bg-muted/[0.04] rounded-2xl p-7 space-y-[18px]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80 mb-0">Structure</h3>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                    <NumericStepper
                        label="Bedrooms"
                        value={formData.bedrooms}
                        onChange={(v) => handleInputChange({ target: { name: 'bedrooms', value: v } } as any)}
                    />
                    <NumericStepper
                        label="Bathrooms"
                        value={formData.bathrooms}
                        onChange={(v) => handleInputChange({ target: { name: 'bathrooms', value: v } } as any)}
                    />
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Building Area</label>
                        <div className="relative">
                            <Input
                                name="m2"
                                type="number"
                                value={formData.m2}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="pr-14 h-14 rounded-2xl bg-white border-border font-bold text-right"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground/70 leading-none">m²</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Land Size</label>
                        <div className="relative">
                            <Input
                                name="land_size"
                                type="number"
                                value={formData.land_size}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="pr-14 h-14 rounded-2xl bg-white border-border font-bold text-right"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground/70 leading-none">m²</span>
                        </div>
                    </div>
                </div>

                {/* Stories (Apartment only) */}
                {formData.property_type === 'Apartment' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#0e2e50] ml-1">Stories</label>
                            <Input
                                name="stories"
                                type="number"
                                value={formData.stories}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="h-14 rounded-2xl bg-white border-border font-bold"
                            />
                        </div>
                    </div>
                )}

                {/* Parking Type */}
                <div className="space-y-1.5 pt-1.5 border-t border-muted/10">
                    <label className="text-sm font-bold text-[#0e2e50] pt-3 block ml-1">Parking Type</label>
                    <Select value={formData.parking_type} onValueChange={(v) => handleSelectChange('parking_type', v)}>
                        <SelectTrigger className="h-14 rounded-2xl bg-white font-bold border-border">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="private">Private Garage</SelectItem>
                            <SelectItem value="carport">Carport</SelectItem>
                            <SelectItem value="shared">Shared</SelectItem>
                            <SelectItem value="street">Street</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* PANEL 2 — CLASSIFICATION & LEGAL */}
            <div className="bg-muted/[0.04] rounded-2xl p-7 space-y-[18px]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80 mb-0">Classification & Legal</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Zoning</label>
                        <Select value={formData.zoning} onValueChange={(v) => handleSelectChange('zoning', v)}>
                            <SelectTrigger className="h-14 rounded-2xl bg-white font-bold border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="Residential">Residential</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                                <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                                <SelectItem value="Agricultural">Agricultural</SelectItem>
                                <SelectItem value="Industrial">Industrial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Furnishing</label>
                        <Select value={formData.furnishing} onValueChange={(v) => handleSelectChange('furnishing', v)}>
                            <SelectTrigger className="h-14 rounded-2xl bg-white font-bold border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="unfurnished">Unfurnished</SelectItem>
                                <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                                <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Ownership</label>
                        <Select value={formData.ownership} onValueChange={(v) => handleSelectChange('ownership', v)}>
                            <SelectTrigger className="h-14 rounded-2xl bg-white font-bold border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="Freehold">Freehold</SelectItem>
                                <SelectItem value="Leasehold">Leasehold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {formData.ownership === 'Leasehold' ? (
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#0e2e50] ml-1">Lease Years</label>
                            <Input
                                name="lease_years"
                                type="number"
                                value={formData.lease_years}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="h-14 rounded-2xl bg-white border-border font-bold"
                            />
                        </div>
                    ) : (
                        <div aria-hidden className="hidden md:block" />
                    )}
                </div>
            </div>

            {/* PANEL 3 — CONDITION & AVAILABILITY */}
            <div className="bg-muted/[0.04] rounded-2xl p-7 space-y-[18px]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80 mb-0">Condition & Availability</h3>

                <div className="grid grid-cols-3 gap-[18px]">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Year Built</label>
                        <Input
                            name="year_built"
                            type="number"
                            value={formData.year_built}
                            onChange={handleInputChange}
                            placeholder="YYYY"
                            className="h-14 rounded-2xl bg-white border-border font-bold w-full"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Last Renovated</label>
                        <Input
                            name="last_renovated"
                            type="number"
                            value={formData.last_renovated}
                            onChange={handleInputChange}
                            placeholder="YYYY"
                            className="h-14 rounded-2xl bg-white border-border font-bold w-full"
                        />
                    </div>
                    <DatePickerField
                        label="Available From"
                        value={formData.available_date}
                        onChange={(isoDate) => handleInputChange({ target: { name: 'available_date', value: isoDate } } as any)}
                    />
                </div>
            </div>

            {/* Country-Specific: Energy Rating (Netherlands) */}
            {formData.countryCode === 'NL' && (
                <div className="bg-muted/[0.04] rounded-2xl p-7 space-y-[18px]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80 mb-0">Energy Rating</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#0e2e50] ml-1">Rating</label>
                            <Select value={formData.energy_rating} onValueChange={(v) => handleSelectChange('energy_rating', v)}>
                                <SelectTrigger className="h-14 rounded-2xl bg-white font-bold border-border">
                                    <SelectValue placeholder="A-G" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {['A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map(r => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
