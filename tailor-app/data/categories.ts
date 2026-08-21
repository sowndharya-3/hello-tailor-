// Shared stitching category list — sourced conceptually from Admin Category Management
export interface StitchCategory {
  id: string;
  name: string;
  icon: string; // Ionicons name
}

export const CATEGORIES: StitchCategory[] = [
  { id: 'blouse', name: 'Blouse Stitching', icon: 'shirt-outline' },
  { id: 'saree-fall', name: 'Saree Fall & Edging', icon: 'cut-outline' },
  { id: 'lehenga', name: 'Lehenga Stitching', icon: 'sparkles-outline' },
  { id: 'salwar', name: 'Salwar Kameez', icon: 'shirt-outline' },
  { id: 'kurta', name: "Men's Kurta Pajama", icon: 'shirt-outline' },
  { id: 'sherwani', name: 'Sherwani', icon: 'sparkles-outline' },
  { id: 'suit', name: "Men's Suit / Blazer", icon: 'briefcase-outline' },
  { id: 'shirt-pant', name: 'Shirt & Pant Stitching', icon: 'shirt-outline' },
  { id: 'gown', name: 'Gown Stitching', icon: 'sparkles-outline' },
  { id: 'alteration', name: 'Alterations & Resizing', icon: 'construct-outline' },
  { id: 'school-uniform', name: 'School Uniforms', icon: 'school-outline' },
  { id: 'embroidery', name: 'Embroidery Work', icon: 'flower-outline' },
];
