import heroImage from "@/assets/hero section bale aur.avif";

export type LocalizedText = {
  id: string;
  en: string;
};

export interface BaleAurRoomType {
  id: number;
  slug: string;
  shortName: string;
  displayName: string;
  location: string;
  price: number;
  image: string;
  capacity: LocalizedText;
  bedInfo: LocalizedText;
  size: string;
  description: LocalizedText;
  highlight: LocalizedText;
}

export const baleAurImages = {
  hero: heroImage,
  exterior:
    "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/01d4fc29595ecc9254802de4a56298bc~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=5oNrJ6TV3q8v9Py27BbGT0vmYMQ%3D",
  interior:
    "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/e789321b54784ec3038e5dfd45cf0da3~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=BRdjLYXqWK8R2sK2iSLyLQ3EODI%3D",
  roadside:
    "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/bd0f678e8a2058a2c49acb1783c95b0f~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=BqRVc7OXv%2FlKL%2Bub5DuxZOlHnyI%3D",
  terrace:
    "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/32b520ed8628a204077d2fee01e28d70~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=UY0NWBb4MJgn%2BLvahe33YxO8d7o%3D",
  cabin:
    "https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/40e2ef33cd2af5e0ef2953bf747c3b48~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783915807&x-signature=hEpK5crlLiUoXM2rcYeA49BdIkE%3D",
} as const;

export const baleAurProperty = {
  name: "Bale Aur Sembalun",
  tagline: {
    id: "Luxury Mountain Stay Experience",
    en: "Luxury Mountain Stay Experience",
  },
  locationShort: "Sembalun Lawang, Lombok Timur",
  locationFull: "Jalan Raya Sembalun Lawang, Sembalun Lawang, Lombok Timur, Nusa Tenggara Barat, Indonesia",
  locationSearch: "Bale Aur Sembalun, Sembalun Lawang, Lombok Timur, Nusa Tenggara Barat",
  phone: "+62 823 2284 3759",
  email: "stay@baleaursembalun.id",
  breakfast: {
    id: "Sarapan a la carte Asia dengan hidangan hangat setiap pagi.",
    en: "Asian a la carte breakfast with warm dishes served every morning.",
  },
  checkIn: "14:00 - 22:30",
  checkOut: "08:00 - 12:00",
  airportDistance: {
    id: "Sekitar 74 km dari Bandara Internasional Lombok.",
    en: "Approximately 74 km from Lombok International Airport.",
  },
  reviewScore: "7.7",
  reviewCount: "116",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Bale%20Aur%20Sembalun%2C%20Jalan%20Raya%20Sembalun%20Lawang%2C%20Sembalun%20Lawang%2C%20Lombok%20Timur&z=13&output=embed",
  heroDescription: {
    id: "Bale Aur Sembalun menghadirkan pengalaman menginap pegunungan yang tenang dengan kabin kayu modern, udara sejuk Sembalun, dan panorama kaki Gunung Rinjani yang terasa hangat sejak pandangan pertama.",
    en: "Bale Aur Sembalun presents a calm mountain stay with modern timber cabins, cool Sembalun air, and foothill views of Mount Rinjani that feel warm from the very first glance.",
  },
  aboutDescription: {
    id: "Bale Aur Sembalun menawarkan pengalaman menginap dengan panorama pegunungan yang tenang dan alami. Setiap kamar memiliki view Sembalun yang terasa segar, cocok untuk staycation, healing, dan pengalaman alam premium dengan nuansa kayu natural serta desain modern mountain cabin.",
    en: "Bale Aur Sembalun offers a stay experience shaped by calm mountain panoramas and natural surroundings. Each room opens to fresh Sembalun views, ideal for staycations, healing escapes, and a premium nature retreat framed by natural timber and modern mountain-cabin design.",
  },
} as const;

export const baleAurFacilities = [
  "Non-smoking rooms",
  "Free WiFi",
  "Breakfast",
  "Mountain View",
  "Balcony",
  "Terrace",
  "Seating Area",
  "Private Bathroom",
] as const;

export const baleAurNearbyAttractions = [
  { name: "Bukit Pergasingan", distance: "3.8 km" },
  { name: "Gunung Rinjani National Park", distance: "2.1 km" },
  { name: "Air Terjun Telaga Madu", distance: "17 km" },
  { name: "Tetebatu Monkey Forest", distance: "41 km" },
] as const;

export const baleAurReviewCategories = [
  { label: "Staff", score: "8.9" },
  { label: "Facilities", score: "7.0" },
  { label: "Cleanliness", score: "8.0" },
  { label: "Comfort", score: "7.9" },
  { label: "Value for money", score: "8.5" },
  { label: "Location", score: "8.8" },
  { label: "Free WiFi", score: "7.5" },
] as const;

export const baleAurReviewHighlights = [
  {
    name: "Sulastri",
    country: "Indonesia",
    quote: {
      id: "Pemandangan gunungnya langsung di depan mata dan air hangatnya bekerja dengan baik, jadi stay terasa nyaman sejak pagi.",
      en: "The mountain view sits right in front of the room and the hot water works well, so the stay feels comfortable from the very first morning.",
    },
  },
  {
    name: "Barbora",
    country: "Czech Republic",
    quote: {
      id: "Kamarnya bersih, nyaman, dan punya ruang yang cukup untuk beberapa hari istirahat tenang di udara Sembalun yang sejuk.",
      en: "The room felt clean, comfortable, and spacious enough for a few restful days in the cool Sembalun air.",
    },
  },
  {
    name: "Farha",
    country: "Malaysia",
    quote: {
      id: "View perbukitan Sembalun dari kamar terasa megah, sejuk, dan cocok sekali untuk healing yang tenang.",
      en: "The rolling Sembalun hills from the room feel majestic, cool, and perfect for a calm healing escape.",
    },
  },
  {
    name: "Sofia",
    country: "Malaysia",
    quote: {
      id: "Pemandangan paginya indah untuk sunrise, lokasinya dekat warung makan, dan suasananya pas untuk mountain stay yang santai.",
      en: "The morning view is beautiful for sunrise, the location is close to food stalls, and the atmosphere is perfect for a relaxed mountain stay.",
    },
  },
] as const;

export const baleAurRoomTypes: BaleAurRoomType[] = [
  {
    id: 1,
    slug: "standard-double-room",
    shortName: "Standard Double Room",
    displayName: "Bale Aur Sembalun - Standard Double Room",
    location: baleAurProperty.locationShort,
    price: 650000,
    image: baleAurImages.hero,
    capacity: {
      id: "2 tamu",
      en: "2 guests",
    },
    bedInfo: {
      id: "1 double bed",
      en: "1 double bed",
    },
    size: "15 m2",
    description: {
      id: "Kamar double hangat dengan seating area, teras privat, dan panorama pegunungan Sembalun untuk stay sederhana yang tetap refined.",
      en: "A warm double room with a seating area, private terrace, and Sembalun mountain panorama for a simple yet refined stay.",
    },
    highlight: {
      id: "Teras privat dengan mountain view yang tenang.",
      en: "A private terrace with a calm mountain view.",
    },
  },
  {
    id: 2,
    slug: "family-room",
    shortName: "Family Room",
    displayName: "Bale Aur Sembalun - Family Room",
    location: baleAurProperty.locationShort,
    price: 980000,
    image: baleAurImages.exterior,
    capacity: {
      id: "4 tamu",
      en: "4 guests",
    },
    bedInfo: {
      id: "2 double bed",
      en: "2 double beds",
    },
    size: "15 m2",
    description: {
      id: "Pilihan family room untuk tamu yang ingin menikmati udara sejuk, suasana kayu natural, dan kenyamanan stay bersama keluarga kecil di Bale Aur.",
      en: "A family room designed for guests who want cool air, natural timber ambience, and a comfortable Bale Aur stay with a small family.",
    },
    highlight: {
      id: "Ideal untuk family stay dengan suasana pegunungan.",
      en: "Ideal for a family stay in a mountain setting.",
    },
  },
  {
    id: 3,
    slug: "double-room-with-balcony",
    shortName: "Double Room with Balcony",
    displayName: "Bale Aur Sembalun - Double Room with Balcony",
    location: baleAurProperty.locationShort,
    price: 780000,
    image: baleAurImages.interior,
    capacity: {
      id: "2 tamu",
      en: "2 guests",
    },
    bedInfo: {
      id: "1 double bed",
      en: "1 double bed",
    },
    size: "15 m2",
    description: {
      id: "Kamar dengan balkon privat untuk menikmati sunrise Sembalun, udara dingin pagi, dan momen santai yang terasa intimate.",
      en: "A room with a private balcony for enjoying Sembalun sunrise, cool morning air, and intimate slow-living moments.",
    },
    highlight: {
      id: "Balcony stay untuk sunrise dan udara pegunungan.",
      en: "A balcony stay for sunrise and cool mountain air.",
    },
  },
  {
    id: 4,
    slug: "studio-with-mountain-view",
    shortName: "Studio with Mountain View",
    displayName: "Bale Aur Sembalun - Studio with Mountain View",
    location: baleAurProperty.locationShort,
    price: 890000,
    image: baleAurImages.cabin,
    capacity: {
      id: "4 tamu",
      en: "4 guests",
    },
    bedInfo: {
      id: "1 single bed dan 1 double bed",
      en: "1 single bed and 1 double bed",
    },
    size: "15 m2",
    description: {
      id: "Studio mountain view dengan seating area dan teras yang menghadap lanskap Sembalun, cocok untuk stay yang lebih fleksibel dan terasa alami.",
      en: "A mountain-view studio with a seating area and terrace facing the Sembalun landscape, ideal for a more flexible and nature-led stay.",
    },
    highlight: {
      id: "Studio dengan view pegunungan dan seating area.",
      en: "A studio with mountain views and a seating area.",
    },
  },
];

export function getBaleAurRoomType(id: number) {
  return baleAurRoomTypes.find((room) => room.id === id);
}
