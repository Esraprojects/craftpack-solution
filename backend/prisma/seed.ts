import { PrismaClient, MaterialType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin User
  const adminPassword = await bcrypt.hash('Admin@Craftpack2024!', 12);
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@craftpacksolution.com' },
    update: {},
    create: {
      email:      'admin@craftpacksolution.com',
      name:       'Admin User',
      password:   adminPassword,
      role:       'super_admin',
      isVerified: true,
      company:    'Craftpack Solution',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Manager
  await prisma.user.upsert({
    where:  { email: 'manager@craftpacksolution.com' },
    update: {},
    create: {
      email:      'manager@craftpacksolution.com',
      name:       'Sarah Manager',
      password:   await bcrypt.hash('Manager@Craftpack2024!', 12),
      role:       'manager',
      isVerified: true,
    },
  });

  // Sample customers
  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'procurement@hyatt.com' },
      update: {},
      create: { email: 'procurement@hyatt.com', name: 'Yohannes Tadesse', password: await bcrypt.hash('Test1234!', 12), role: 'customer', isVerified: true, company: 'Hyatt Regency Ethiopia', phone: '+251911000001' },
    }),
    prisma.user.upsert({
      where: { email: 'ops@kaldis.com' },
      update: {},
      create: { email: 'ops@kaldis.com', name: 'Mekdes Alemu', password: await bcrypt.hash('Test1234!', 12), role: 'customer', isVerified: true, company: "Kaldi's Coffee", phone: '+251911000002' },
    }),
    prisma.user.upsert({
      where: { email: 'brand@safeway.et' },
      update: {},
      create: { email: 'brand@safeway.et', name: 'Daniel Girma', password: await bcrypt.hash('Test1234!', 12), role: 'customer', isVerified: true, company: 'Safeway Supermarket', phone: '+251911000003' },
    }),
  ]);
  console.log('✅ Customers created:', customers.length);

  // Products
  const products = [
    {
      name: 'Premium Kraft Shopping Bag',
      slug: 'premium-kraft-shopping-bag',
      description: 'Our signature Premium Kraft Shopping Bag combines durability with aesthetic appeal. Made from 100% natural kraft paper with reinforced handles, this bag offers an excellent canvas for custom printing and branding. Perfect for retail boutiques, fashion stores, and corporate gifting.',
      shortDescription: 'Heavy-duty kraft paper with reinforced handles. Perfect for retail & boutique stores.',
      category: 'shopping_bags' as const,
      images: [],
      thumbnail: '',
      basePrice: 12.50,
      isActive: true,
      isFeatured: true,
      tags: ['kraft', 'shopping', 'eco-friendly', 'custom-print', 'bestseller'],
      features: ['Heavy-duty kraft paper 150gsm', 'Reinforced rope handles', 'Flat bottom for stability', 'Custom printing up to 4 colors', 'Water-resistant coating option'],
      applications: ['Retail boutiques', 'Fashion stores', 'Gift shops', 'Corporate events'],
      variants: {
        create: [
          { name: 'Small (20×25×10cm)',  sku: 'PKB-S-KRAFT', price: 8.50,  material: MaterialType.kraft_paper, width: 20, height: 25, depth: 10, stock: 50000, minOrder: 500 },
          { name: 'Medium (30×40×12cm)', sku: 'PKB-M-KRAFT', price: 12.50, material: MaterialType.kraft_paper, width: 30, height: 40, depth: 12, stock: 30000, minOrder: 500 },
          { name: 'Large (40×50×15cm)',  sku: 'PKB-L-KRAFT', price: 18.00, material: MaterialType.kraft_paper, width: 40, height: 50, depth: 15, stock: 20000, minOrder: 300 },
        ],
      },
      bulkPricing: {
        create: [
          { minQuantity: 500,   maxQuantity: 999,   pricePerUnit: 12.50, discountPercent: 0  },
          { minQuantity: 1000,  maxQuantity: 4999,  pricePerUnit: 10.80, discountPercent: 14 },
          { minQuantity: 5000,  maxQuantity: 19999, pricePerUnit: 9.20,  discountPercent: 26 },
          { minQuantity: 20000, maxQuantity: undefined, pricePerUnit: 7.80, discountPercent: 38 },
        ],
      },
      customization: {
        create: { logoUpload: true, customColors: true, customText: true, embossing: false, foilStamping: false, spotUV: false, lamination: true },
      },
    },
    {
      name: 'Luxury Matte Laminated Gift Bag',
      slug: 'luxury-matte-laminated-gift-bag',
      description: 'Experience the pinnacle of packaging luxury with our Matte Laminated Gift Bag. Featuring a soft-touch matte lamination finish with optional hot foil stamping, this bag commands attention and communicates premium brand values.',
      shortDescription: 'Soft-touch matte lamination with gold foil stamping for premium brand experience.',
      category: 'luxury_bags' as const,
      images: [],
      thumbnail: '',
      basePrice: 28.00,
      isActive: true,
      isFeatured: true,
      tags: ['luxury', 'matte', 'laminated', 'foil-stamping', 'premium'],
      features: ['Soft-touch matte lamination', 'Gold/silver foil stamping available', 'Rigid board construction', 'Grosgrain ribbon handles', 'Spot UV coating option', 'Magnetic closure'],
      applications: ['Luxury retail', 'Jewelry stores', 'Premium brands', 'Corporate gifts', 'VIP events'],
      variants: {
        create: [
          { name: 'Medium (25×30×10cm)', sku: 'LML-M-ART', price: 28.00, material: MaterialType.art_paper,   width: 25, height: 30, depth: 10, stock: 10000, minOrder: 200 },
          { name: 'Large  (35×45×13cm)', sku: 'LML-L-ART', price: 38.00, material: MaterialType.ivory_board, width: 35, height: 45, depth: 13, stock: 5000,  minOrder: 100 },
        ],
      },
      bulkPricing: {
        create: [
          { minQuantity: 200,  maxQuantity: 499,  pricePerUnit: 28.00, discountPercent: 0  },
          { minQuantity: 500,  maxQuantity: 1999, pricePerUnit: 24.00, discountPercent: 14 },
          { minQuantity: 2000, maxQuantity: undefined, pricePerUnit: 19.50, discountPercent: 30 },
        ],
      },
      customization: {
        create: { logoUpload: true, customColors: true, customText: true, embossing: true, foilStamping: true, spotUV: true, lamination: true },
      },
    },
    {
      name: 'Eco Recycled Paper Bag',
      slug: 'eco-recycled-paper-bag',
      description: '100% recycled and biodegradable paper bag certified by FSC. Made from post-consumer recycled content with natural, unbleached appearance. Perfect for brands that want to showcase their environmental commitment.',
      shortDescription: '100% recycled & biodegradable. FSC certified materials. Ideal for eco-conscious brands.',
      category: 'eco_friendly' as const,
      images: [],
      thumbnail: '',
      basePrice: 8.75,
      isActive: true,
      isFeatured: true,
      tags: ['eco', 'recycled', 'biodegradable', 'fsc-certified', 'sustainable'],
      features: ['100% recycled paper content', 'Biodegradable in 90 days', 'FSC & ISO 14001 certified', 'Soy-based inks for printing', 'Natural fiber handles', 'Compostable optional'],
      applications: ['Eco-conscious brands', 'Organic stores', 'Farmers markets', 'Sustainable events', 'Green hotels'],
      variants: {
        create: [
          { name: 'Small  (20×25×8cm)',  sku: 'ECO-S-REC', price: 6.50,  material: MaterialType.recycled_paper, width: 20, height: 25, depth: 8,  stock: 100000, minOrder: 1000 },
          { name: 'Medium (30×35×10cm)', sku: 'ECO-M-REC', price: 8.75,  material: MaterialType.recycled_paper, width: 30, height: 35, depth: 10, stock: 80000,  minOrder: 1000 },
          { name: 'Large  (40×45×15cm)', sku: 'ECO-L-REC', price: 12.00, material: MaterialType.recycled_paper, width: 40, height: 45, depth: 15, stock: 50000,  minOrder: 500  },
        ],
      },
      bulkPricing: {
        create: [
          { minQuantity: 1000,  maxQuantity: 4999,  pricePerUnit: 8.75, discountPercent: 0  },
          { minQuantity: 5000,  maxQuantity: 19999, pricePerUnit: 7.20, discountPercent: 18 },
          { minQuantity: 20000, maxQuantity: undefined, pricePerUnit: 5.90, discountPercent: 33 },
        ],
      },
      customization: {
        create: { logoUpload: true, customColors: true, customText: true, embossing: false, foilStamping: false, spotUV: false, lamination: false },
      },
    },
  ];

  for (const productData of products) {
    const { variants, bulkPricing, customization, ...rest } = productData;
    await prisma.product.upsert({
      where:  { slug: rest.slug },
      update: {},
      create: { ...rest, variants, bulkPricing, customization },
    });
  }
  console.log('✅ Products seeded:', products.length);

  // Inventory Items
  const inventoryItems = [
    { name: 'Natural Brown Kraft Paper Roll (120gsm)', sku: 'RAW-KRAFT-120', category: 'Raw Material', currentStock: 2500, minStock: 500, maxStock: 10000, unit: 'kg', costPerUnit: 45, supplier: 'Addis Paper Mills' },
    { name: 'Art Paper Sheets (200gsm)', sku: 'RAW-ART-200', category: 'Raw Material', currentStock: 380, minStock: 200, maxStock: 3000, unit: 'kg', costPerUnit: 68, supplier: 'Ethiopia Paper Co.' },
    { name: 'Recycled Paper Pulp', sku: 'RAW-REC-PULP', category: 'Raw Material', currentStock: 1800, minStock: 400, maxStock: 8000, unit: 'kg', costPerUnit: 32, supplier: 'GreenCycle Ethiopia' },
    { name: 'Water-Based Printing Ink (Black)', sku: 'INK-BLK-WB', category: 'Consumable', currentStock: 45, minStock: 20, maxStock: 200, unit: 'liter', costPerUnit: 280, supplier: 'Colorways Supplies' },
    { name: 'Matte Lamination Film Roll', sku: 'FILM-MAT-50M', category: 'Consumable', currentStock: 12, minStock: 10, maxStock: 100, unit: 'rolls', costPerUnit: 1850, supplier: 'FlexoPack Import' },
    { name: 'Cotton Rope Handles (Natural)', sku: 'HDL-COT-NAT', category: 'Component', currentStock: 5000, minStock: 2000, maxStock: 50000, unit: 'pairs', costPerUnit: 2.8, supplier: 'Habesha Crafts' },
    { name: 'Gold Hot Foil Roll', sku: 'FOIL-GOLD-25M', category: 'Consumable', currentStock: 3, minStock: 5, maxStock: 50, unit: 'rolls', costPerUnit: 3200, supplier: 'FlexoPack Import' },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where:  { sku: item.sku },
      update: {},
      create: {
        ...item,
        status: item.currentStock <= item.minStock
          ? (item.currentStock === 0 ? 'out_of_stock' : 'low_stock')
          : 'in_stock',
        lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log('✅ Inventory seeded:', inventoryItems.length);

  // System Settings
  const settings = [
    { key: 'company_name',    value: 'Craftpack Solution',             category: 'general' },
    { key: 'company_address', value: 'Bole Sub-city, Addis Ababa, Ethiopia', category: 'general' },
    { key: 'company_phone',   value: '+251 911 000 000',               category: 'general' },
    { key: 'company_email',   value: 'info@craftpacksolution.com',     category: 'general' },
    { key: 'currency',        value: 'ETB',                            category: 'general' },
    { key: 'tax_rate',        value: '15',                             category: 'general' },
    { key: 'order_prefix',    value: 'CP',                             category: 'general' },
    { key: 'min_order_value', value: '500',                            category: 'general' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where:  { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ System settings seeded');

  console.log('\n🎉 Seeding complete!');
  console.log('─────────────────────────────────────────────');
  console.log('Admin:   admin@craftpacksolution.com / Admin@Craftpack2024!');
  console.log('Manager: manager@craftpacksolution.com / Manager@Craftpack2024!');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
