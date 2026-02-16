import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { SortableImage } from './SortableImage';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import {
    Building2,
    MapPin,
    DollarSign,
    ChevronRight,
    ChevronLeft,
    Image as ImageIcon,
    Check,
    GripVertical,
    School,
    Hospital,
    ShoppingBag,
    Bus,
    Plane,
    Trees,
    Plus,
    Trash2,
    Upload,
    X,
    Loader2,
    Home,
    Car,
    FileText,
    Calendar,
    Layers,
    Info,
    ShieldCheck,
    Waves,
    Wind,
    Sun,
    Wifi,
    Tv
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { z } from 'zod';
import ListingPreview from './ListingPreview';
import { AddressAutocomplete } from '@/components/map/AddressAutocomplete';
import { fetchNearbyPOIs } from '@/lib/poi';
import POIEditor from './POIEditor';

const propertySchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    address: z.string().min(10, 'Full address is required'),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    formatted_address: z.string().optional(),
    price: z.string().refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Valid price is required'),
    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    m2: z.string().optional(),
    property_type: z.string(),
    listing_code: z.string(),
    images: z.array(z.string()).min(1, 'At least one image is required'),
}).refine(
    (data) => {
        if (data.address && data.address.length > 10) {
            return data.latitude !== null && data.longitude !== null;
        }
        return true;
    },
    {
        message: 'Please select a valid address from suggestions',
        path: ['address']
    }
);

type Step = 'basic' | 'details' | 'media' | 'amenities';

const AddPropertyForm = ({ onComplete }: { onComplete: () => void }) => {
    const [currentStep, setCurrentStep] = useState<Step>('basic');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [poiLoading, setPoiLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);

    const initialListingCode = useMemo(() => `UK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`, []);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        latitude: null as number | null,
        longitude: null as number | null,
        formatted_address: '',
        price: '',
        price_type: 'sale',
        bedrooms: '',
        bathrooms: '',
        m2: '',
        status: 'sale',
        property_type: 'Villa',
        ownership: 'Freehold',
        year_built: new Date().getFullYear().toString(),
        surface_area: '',
        building_area: '',
        listing_code: initialListingCode,
        featured: false,
        parking_spaces: '',
        parking_type: 'private',
        hoa_fees: '',
        property_tax: '',
        lot_size: '',
        stories: '',
        last_renovated: '',
        interior_features: [] as string[],
        appliances: [] as string[],
        hvac_type: '',
        outdoor_features: [] as string[],
        community_amenities: [] as string[],
        lifestyle_tags: [] as string[],
        energy_rating: '',
        neighborhood_description: '',
        available_date: '',
        virtual_tour_url: '',
        video_url: '',
        images: [] as string[],
        image_url: '',
        nearby_amenities: [] as any[],
        poi_fetched_at: null as string | null,
        poi_source: 'osm' as 'osm' | 'mapbox' | 'manual',
    });

    const steps: { id: Step; label: string; icon: any }[] = [
        { id: 'basic', label: 'Basic Info', icon: Building2 },
        { id: 'details', label: 'Specifications', icon: Layers },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'amenities', label: 'Amenities', icon: ShieldCheck },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => {
            const updates: any = { [name]: value };
            // Sync status with price_type for market filtering
            if (name === 'price_type') {
                updates.status = value;
            }
            return { ...prev, ...updates };
        });
    };

    const toggleFeature = (type: 'interior' | 'appliances' | 'outdoor' | 'community', value: string) => {
        const fieldName = type === 'community' ? 'community_amenities' : `${type}_features` as keyof typeof formData;

        const current = formData[fieldName as keyof typeof formData] as string[];
        setFormData(prev => ({
            ...prev,
            [fieldName]: current.includes(value)
                ? current.filter(i => i !== value)
                : [...current, value]
        }));
    };

    const handleFileUpload = async (files: File[]) => {
        setUploading(true);
        const totalFiles = files.length;
        let completedFiles = 0;

        const uploadPromises = files.map(async (file) => {
            try {
                const options = {
                    maxSizeMB: 0.8,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: 'image/webp'
                };

                const compressedFile = await imageCompression(file, options);
                const fileExt = 'webp';
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('property-images')
                    .upload(filePath, compressedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('property-images')
                    .getPublicUrl(filePath);

                // Update state incrementally for each successful upload
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, publicUrl],
                    image_url: prev.image_url || publicUrl
                }));

                completedFiles++;
            } catch (error: any) {
                console.error(`Error uploading ${file.name}:`, error);
                toast.error(`Failed to upload ${file.name}`);
            }
        });

        await Promise.all(uploadPromises);

        if (completedFiles > 0) {
            toast.success(`Successfully uploaded ${completedFiles} of ${totalFiles} images`);
        }
        setUploading(false);
    };

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        if (rejectedFiles.length > 0) {
            console.warn('Rejected files:', rejectedFiles);
            const reasons = rejectedFiles.map(rf => rf.errors.map((e: any) => e.message).join(', ')).join(' | ');
            toast.error(`Some files were rejected: ${reasons}`);
        }

        if (acceptedFiles.length > 0) {
            handleFileUpload(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg', '.JPG'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        maxSize: 52428800 // 50MB
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setFormData((prev) => {
                const oldIndex = prev.images.indexOf(active.id as string);
                const newIndex = prev.images.indexOf(over.id as string);
                const newImages = arrayMove(prev.images, oldIndex, newIndex);

                return {
                    ...prev,
                    images: newImages,
                    image_url: newImages[0] || prev.image_url
                };
            });
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            const removed = newImages.splice(index, 1)[0];
            return {
                ...prev,
                images: newImages,
                image_url: prev.image_url === removed ? (newImages[0] || '') : prev.image_url
            };
        });
    };

    const handleSubmit = async () => {
        setErrors({});

        // Validate required fields
        const validation = propertySchema.safeParse(formData);
        if (!validation.success) {
            const newErrors: Record<string, string> = {};
            validation.error.issues.forEach(issue => {
                newErrors[issue.path[0]] = issue.message;
            });
            setErrors(newErrors);

            // Jump to first step with error
            if (newErrors.title || newErrors.description || newErrors.address || newErrors.price) {
                setCurrentStep('basic');
            } else if (newErrors.images) {
                setCurrentStep('media');
            }

            toast.error('Please fix the errors before publishing');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                bedrooms: parseInt(formData.bedrooms) || 0,
                bathrooms: parseInt(formData.bathrooms) || 0,
                m2: parseInt(formData.m2) || 0,
                parking_spaces: parseInt(formData.parking_spaces) || 0,
                hoa_fees: parseFloat(formData.hoa_fees) || 0,
                property_tax: parseFloat(formData.property_tax) || 0,
                lot_size: parseFloat(formData.lot_size) || 0,
                stories: parseInt(formData.stories) || 0,
                last_renovated: formData.last_renovated ? parseInt(formData.last_renovated) : null,
                available_date: formData.available_date || null,
                latitude: formData.latitude,
                longitude: formData.longitude,
                formatted_address: formData.formatted_address,
                nearby_amenities: formData.nearby_amenities || [],
                poi_fetched_at: formData.poi_fetched_at,
                poi_source: formData.poi_source,
                user_id: user.id,
                published_at: new Date().toISOString(), // Default to published for now
                last_modified_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('properties')
                .insert([payload]);

            if (error) throw error;

            toast.success('Property published successfully!');
            onComplete();
        } catch (error: any) {
            toast.error(error.message || 'Error publishing property');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep === 'basic') setCurrentStep('details');
        else if (currentStep === 'details') setCurrentStep('media');
        else if (currentStep === 'media') setCurrentStep('amenities');
    };

    const prevStep = () => {
        if (currentStep === 'details') setCurrentStep('basic');
        else if (currentStep === 'media') setCurrentStep('details');
        else if (currentStep === 'amenities') setCurrentStep('media');
    };

    return (
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-border max-w-5xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-[#0e2e50] tracking-tight">Create Listing</h2>
                    <p className="text-muted-foreground font-medium mt-2">Elevate your property to a premium standard.</p>
                </div>

                {/* Steps Progress */}
                <div className="flex items-center gap-3">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <button
                                onClick={() => setCurrentStep(step.id)}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${currentStep === step.id
                                    ? 'bg-[#0e2e50] text-white shadow-xl shadow-[#0e2e50]/20 scale-110'
                                    : steps.findIndex(s => s.id === currentStep) > index
                                        ? 'bg-ukon-green/20 text-ukon-green'
                                        : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40'
                                    }`}
                            >
                                <step.icon size={20} />
                            </button>
                            {index < steps.length - 1 && (
                                <div className="w-6 h-[2px] bg-border mx-1" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    {currentStep === 'basic' && (
                        <motion.div
                            key="basic"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 gap-8">
                                <div className="flex items-center justify-between gap-6">
                                    <div className="space-y-2 flex-1">
                                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Property Title</label>
                                        <Input
                                            name="title"
                                            placeholder="e.g. Modern Minimalist Villa with Pool"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`h-16 rounded-[1.5rem] bg-secondary/5 font-bold text-lg px-6 ${errors.title ? 'border-ukon-red ring-1 ring-ukon-red' : 'border-border'}`}
                                        />
                                        {errors.title && <p className="text-xs text-ukon-red font-bold ml-2">{errors.title}</p>}
                                    </div>
                                    <div className="space-y-2 w-48">
                                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Listing Code</label>
                                        <div className="h-16 rounded-[1.5rem] bg-muted flex items-center justify-center font-mono font-bold text-[#0e2e50]">
                                            {formData.listing_code}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#0e2e50] ml-1 uppercase">Type</label>
                                        <Select value={formData.property_type} onValueChange={(v) => handleSelectChange('property_type', v)}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-secondary/5 font-bold border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {['Villa', 'House', 'Apartment', 'Penthouse', 'Commercial', 'Land'].map(t => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Listed For</label>
                                        <Select value={formData.price_type} onValueChange={(v) => handleSelectChange('price_type', v)}>
                                            <SelectTrigger className="h-16 rounded-[1.5rem] bg-secondary/5 border-border font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                <SelectItem value="sale">For Sale</SelectItem>
                                                <SelectItem value="rent">For Rent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0e2e50] ml-1">Address</label>
                                    <AddressAutocomplete
                                        value={formData.address}
                                        onChange={(v) => setFormData(prev => ({ ...prev, address: v }))}
                                        onSelect={async (result) => {
                                            // Set address info
                                            setFormData(prev => ({
                                                ...prev,
                                                address: result.address,
                                                formatted_address: result.formattedAddress,
                                                latitude: result.latitude,
                                                longitude: result.longitude,
                                                nearby_amenities: [], // Clear old POIs
                                            }));

                                            // Fetch POIs
                                            setPoiLoading(true);
                                            toast.info('Finding nearby amenities...');
                                            try {
                                                const pois = await fetchNearbyPOIs(
                                                    result.latitude,
                                                    result.longitude
                                                );
                                                setFormData(prev => ({
                                                    ...prev,
                                                    nearby_amenities: pois,
                                                    poi_fetched_at: new Date().toISOString(),
                                                    poi_source: 'osm'
                                                }));

                                                if (pois.length === 0) {
                                                    toast.warning(
                                                        'No nearby amenities found in this area'
                                                    );
                                                } else {
                                                    toast.success(
                                                        `Found ${pois.length} nearby points of interest`
                                                    );
                                                }
                                            } catch (error) {
                                                console.error('POI fetch error:', error);
                                                toast.error(
                                                    'Could not load nearby amenities. You can add them manually.'
                                                );
                                            } finally {
                                                setPoiLoading(false);
                                            }
                                        }}
                                        error={errors.address}
                                        placeholder="Start typing your property address..."
                                        disabled={poiLoading}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Property Description</label>
                                        <Textarea
                                            name="description"
                                            placeholder="Describe the property's unique features, floors, and vibe..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className={`min-h-[200px] rounded-[2rem] bg-secondary/5 border-border resize-none p-6 font-medium leading-relaxed ${errors.description ? 'border-ukon-red ring-1 ring-ukon-red' : ''}`}
                                        />
                                        {errors.description && <p className="text-xs text-ukon-red font-bold ml-2">{errors.description}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#0e2e50] ml-1">Neighborhood Context</label>
                                        <Textarea
                                            name="neighborhood_description"
                                            placeholder="Describe the area, local vibes, security, and schools..."
                                            value={formData.neighborhood_description}
                                            onChange={handleInputChange}
                                            className="min-h-[200px] rounded-[2rem] bg-secondary/5 border-border resize-none p-6 font-medium leading-relaxed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0e2e50] ml-1">Price</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0e2e50]" size={20} />
                                        <Input
                                            name="price"
                                            type="number"
                                            placeholder="1,250,000"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="pl-16 h-16 rounded-[1.5rem] bg-secondary/5 border-border text-xl font-black text-[#0e2e50]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Bedrooms', name: 'bedrooms', icon: Home },
                                    { label: 'Bathrooms', name: 'bathrooms', icon: Waves },
                                    { label: 'Area (m²)', name: 'm2', icon: Layers },
                                    { label: 'Stories', name: 'stories', icon: Building2 },
                                ].map((item) => (
                                    <div key={item.name} className="space-y-2">
                                        <label className="text-sm font-bold text-[#0e2e50] ml-1">{item.label}</label>
                                        <div className="relative">
                                            <item.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0e2e50]/50" size={16} />
                                            <Input
                                                name={item.name}
                                                type="number"
                                                value={(formData as any)[item.name]}
                                                onChange={handleInputChange}
                                                className="pl-12 h-14 rounded-2xl bg-secondary/5 border-border font-bold"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2e50]/40 ml-1">Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0e2e50] ml-1 uppercase">Ownership</label>
                                            <Select value={formData.ownership} onValueChange={(v) => handleSelectChange('ownership', v)}>
                                                <SelectTrigger className="h-14 rounded-2xl bg-secondary/5 font-bold border-border">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="Freehold">Freehold</SelectItem>
                                                    <SelectItem value="Leasehold">Leasehold</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2e50]/40 ml-1">Parking Specifications</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0e2e50] ml-1 uppercase">Spaces</label>
                                            <Input name="parking_spaces" type="number" value={formData.parking_spaces} onChange={handleInputChange} className="h-14 rounded-2xl bg-secondary/5 font-bold border-border" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#0e2e50] ml-1 uppercase">Type</label>
                                            <Select value={formData.parking_type} onValueChange={(v) => handleSelectChange('parking_type', v)}>
                                                <SelectTrigger className="h-14 rounded-2xl bg-secondary/5 font-bold border-border">
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
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-secondary/5 rounded-[2.5rem] border border-border/50">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2e50]/40 ml-1">Financials & Size</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#0e2e50]/60 uppercase ml-1">HOA Fees</label>
                                            <Input name="hoa_fees" type="number" value={formData.hoa_fees} onChange={handleInputChange} placeholder="0" className="h-14 rounded-2xl bg-white font-bold border-border" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#0e2e50]/60 uppercase ml-1">Tax (Yr)</label>
                                            <Input name="property_tax" type="number" value={formData.property_tax} onChange={handleInputChange} placeholder="0" className="h-14 rounded-2xl bg-white font-bold border-border" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#0e2e50]/60 uppercase ml-1">Lot Size</label>
                                            <Input name="lot_size" type="number" value={formData.lot_size} onChange={handleInputChange} placeholder="0" className="h-14 rounded-2xl bg-white font-bold border-border" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#0e2e50]/60 uppercase ml-1">Energy Rating</label>
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

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2e50]/40 ml-1">Timeline & Build</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#0e2e50]/60 uppercase ml-1">Available From</label>
                                            <Input name="available_date" type="date" value={formData.available_date} onChange={handleInputChange} className="h-14 rounded-2xl bg-white font-bold border-border" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#0e2e50]/60 uppercase ml-1">Year Built</label>
                                            <Input name="year_built" type="number" value={formData.year_built} onChange={handleInputChange} placeholder="2024" className="h-14 rounded-2xl bg-white font-bold border-border" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#0e2e50]/60 uppercase ml-1">Last Renovated</label>
                                            <Input name="last_renovated" type="number" value={formData.last_renovated} onChange={handleInputChange} placeholder="YYYY" className="h-14 rounded-2xl bg-white font-bold border-border" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 'media' && (
                        <motion.div
                            key="media"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-bold text-[#0e2e50] ml-1 uppercase tracking-widest">Media Assets</label>
                                    <Info size={16} className="text-muted-foreground" />
                                </div>

                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-[3rem] p-16 transition-all duration-500 flex flex-col items-center justify-center text-center cursor-pointer group ${errors.images ? 'border-ukon-red bg-ukon-red/5' : isDragActive ? 'border-[#0e2e50] bg-[#0e2e50]/5' : 'border-border/60 hover:border-[#0e2e50]/30 hover:bg-secondary/10'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 ${errors.images ? 'bg-ukon-red/20 text-ukon-red' : 'bg-[#0e2e50]/5 text-[#0e2e50] group-hover:bg-[#0e2e50] group-hover:text-white'}`}>
                                        {uploading ? (
                                            <Loader2 size={36} className="animate-spin" />
                                        ) : (
                                            <Upload size={36} />
                                        )}
                                    </div>
                                    <h4 className={`text-2xl font-black ${errors.images ? 'text-ukon-red' : 'text-[#0e2e50]'}`}>
                                        {isDragActive ? 'Drop to Upload' : 'Drag & Drop Media'}
                                    </h4>
                                    {errors.images ? (
                                        <p className="text-ukon-red mt-2 font-bold uppercase tracking-widest text-xs">{errors.images}</p>
                                    ) : (
                                        <p className="text-muted-foreground mt-2 font-medium max-w-xs">
                                            High-resolution photos increase conversion by up to 40%. WEBP, JPG, PNG supported.
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#0e2e50] ml-1 uppercase tracking-widest">Virtual Tour URL</label>
                                        <Input
                                            name="virtual_tour_url"
                                            placeholder="https://matterport.com/..."
                                            value={formData.virtual_tour_url}
                                            onChange={handleInputChange}
                                            className="h-14 rounded-2xl bg-secondary/5 border-border"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#0e2e50] ml-1 uppercase tracking-widest">Video URL</label>
                                        <Input
                                            name="video_url"
                                            placeholder="https://youtube.com/..."
                                            value={formData.video_url}
                                            onChange={handleInputChange}
                                            className="h-14 rounded-2xl bg-secondary/5 border-border"
                                        />
                                    </div>
                                </div>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <h4 className="font-black text-[#0e2e50] text-lg uppercase tracking-wider">Asset Gallery ({formData.images.length})</h4>
                                        <p className="text-[10px] font-black text-ukon-green bg-ukon-green/10 px-3 py-1 rounded-full uppercase tracking-widest">Auto-compressed (WebP)</p>
                                    </div>
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                        modifiers={[restrictToFirstScrollableAncestor]}
                                    >
                                        <SortableContext
                                            items={formData.images}
                                            strategy={rectSortingStrategy}
                                        >
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                {formData.images.map((url, index) => (
                                                    <SortableImage
                                                        key={url}
                                                        url={url}
                                                        index={index}
                                                        onRemove={removeImage}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {currentStep === 'amenities' && (
                        <motion.div
                            key="amenities"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            {/* Nearby Points of Interest */}
                            <div className="p-8 bg-secondary/5 rounded-[2.5rem] border border-border/50">
                                <POIEditor
                                    pois={formData.nearby_amenities}
                                    onChange={(pois) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            nearby_amenities: pois
                                        }))
                                    }
                                    loading={poiLoading}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#0e2e50]/40 ml-1">Interior Features</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'smart-home', label: 'Smart Home System', icon: Wifi },
                                            { id: 'hardwood', label: 'Hardwood Floors', icon: Home },
                                            { id: 'ac', label: 'Central AC', icon: Wind },
                                            { id: 'fireplace', label: 'Fireplace', icon: Sun },
                                            { id: 'home-theater', label: 'Home Theater', icon: Tv },
                                        ].map(feat => (
                                            <button
                                                key={feat.id}
                                                onClick={() => toggleFeature('interior', feat.id)}
                                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${formData.interior_features.includes(feat.id)
                                                    ? 'border-[#0e2e50] bg-[#0e2e50]/5 shadow-lg shadow-[#0e2e50]/5'
                                                    : 'border-border/50 bg-white hover:border-[#0e2e50]/20'
                                                    }`}
                                            >
                                                <feat.icon size={20} className={formData.interior_features.includes(feat.id) ? 'text-[#000]' : 'text-[#000]'} />
                                                <span className="font-bold text-[#0e2e50]">{feat.label}</span>
                                                {formData.interior_features.includes(feat.id) && (
                                                    <div className="ml-auto w-6 h-6 bg-[#0e2e50] rounded-full flex items-center justify-center text-white">
                                                        <Check size={14} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#0e2e50]/40 ml-1">Outdoor Life</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'pool', label: 'Private Pool', icon: Waves },
                                            { id: 'garden', label: 'Lush Garden', icon: Trees },
                                            { id: 'outdoor-kitchen', label: 'Outdoor Kitchen', icon: ShoppingBag },
                                            { id: 'deck', label: 'Terrace Deck', icon: Building2 },
                                            { id: 'sea-view', label: 'Ocean View', icon: Waves },
                                        ].map(feat => (
                                            <button
                                                key={feat.id}
                                                onClick={() => toggleFeature('outdoor', feat.id)}
                                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${formData.outdoor_features.includes(feat.id)
                                                    ? 'border-ukon-green bg-ukon-green/5 shadow-lg shadow-ukon-green/5'
                                                    : 'border-border/50 bg-white hover:border-ukon-green/20'
                                                    }`}
                                            >
                                                <feat.icon size={20} className={formData.outdoor_features.includes(feat.id) ? 'text-[#000]' : 'text-[#000]'} />
                                                <span className="font-bold text-[#0e2e50]">{feat.label}</span>
                                                {formData.outdoor_features.includes(feat.id) && (
                                                    <div className="ml-auto w-6 h-6 bg-ukon-green rounded-full flex items-center justify-center text-white">
                                                        <Check size={14} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#0e2e50]/40 ml-1">Lifestyle Tags</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'Waterfront', label: 'Waterfront', icon: Waves },
                                            { id: 'Beachfront', label: 'Beachfront', icon: Waves },
                                            { id: 'City Center', label: 'City Center', icon: Building2 },
                                            { id: 'Gated', label: 'Gated', icon: ShieldCheck },
                                            { id: 'Pool', label: 'Pool', icon: Waves },
                                            { id: 'Garden', label: 'Garden', icon: Trees },
                                        ].map(tag => (
                                            <button
                                                key={tag.id}
                                                onClick={() => {
                                                    const updated = formData.lifestyle_tags.includes(tag.id)
                                                        ? formData.lifestyle_tags.filter(t => t !== tag.id)
                                                        : [...formData.lifestyle_tags, tag.id];
                                                    setFormData(prev => ({ ...prev, lifestyle_tags: updated }));
                                                }}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${formData.lifestyle_tags.includes(tag.id)
                                                    ? 'border-ukon-navy bg-ukon-navy/5 shadow-lg shadow-ukon-navy/5'
                                                    : 'border-border/50 bg-white hover:border-ukon-navy/20'
                                                    }`}
                                            >
                                                <tag.icon size={18} className={formData.lifestyle_tags.includes(tag.id) ? 'text-[#0e2e50]' : 'text-[#0e2e50]'} />
                                                <span className="text-sm font-bold text-[#0e2e50]">{tag.label}</span>
                                                {formData.lifestyle_tags.includes(tag.id) && (
                                                    <div className="ml-auto w-5 h-5 bg-ukon-navy rounded-full flex items-center justify-center text-white">
                                                        <Check size={12} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showPreview && (
                    <ListingPreview
                        data={formData}
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </AnimatePresence>

            <div className="mt-16 pt-10 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 'basic' || loading}
                        className="h-16 px-8 rounded-2xl gap-3 font-bold text-[#0e2e50] hover:bg-secondary/20"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onComplete}
                        disabled={loading}
                        className="h-16 px-8 rounded-2xl gap-3 font-bold text-ukon-red hover:bg-ukon-red/10"
                    >
                        Cancel
                    </Button>
                </div>

                {currentStep === 'amenities' ? (
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowPreview(true)}
                            className="h-16 px-12 rounded-2xl gap-3 border-[#0e2e50] text-[#0e2e50] font-black text-lg hover:bg-[#0e2e50]/5"
                        >
                            Preview
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || uploading}
                            className="h-16 px-12 rounded-2xl gap-3 bg-[#0e2e50] hover:bg-[#0e2e50]/90 text-white font-black text-lg shadow-2xl shadow-[#0e2e50]/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                            Publish Listing
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={nextStep}
                        disabled={loading || uploading}
                        className="h-16 px-12 rounded-2xl gap-3 bg-[#0e2e50] hover:bg-[#0e2e50]/90 text-white font-black text-lg shadow-2xl shadow-[#0e2e50]/20"
                    >
                        Next Step
                        <ChevronRight size={20} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AddPropertyForm;
