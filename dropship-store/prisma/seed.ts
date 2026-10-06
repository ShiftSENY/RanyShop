import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
// 1. Create a pg connection pool using your DIRECT_URL (or DATABASE_URL)
const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const isLocal =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1");
const pool = new Pool({
  connectionString,
  // Supabase requires SSL; raw `pg` pools don't enable it by default.
  ...(isLocal || !connectionString
    ? {}
    : { ssl: { rejectUnauthorized: false } }),
});

// 2. Wrap the pool in PrismaPg adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log("Seeding database...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@landershop.com" },
    update: {},
    create: {
      email: "admin@landershop.com",
      passwordHash: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: customerPassword,
      name: "John Customer",
      role: "CUSTOMER",
    },
  });

  console.log("Created users:", { admin: admin.email, customer: customer.email });

  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Electronic gadgets and devices",
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: "fashion" },
    update: {},
    create: {
      name: "Fashion",
      slug: "fashion",
      description: "Trendy clothing and accessories",
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: "home-living" },
    update: {},
    create: {
      name: "Home & Living",
      slug: "home-living",
      description: "Home decor and essentials",
    },
  });

  const products = [
    {
      name: "Wireless Bluetooth Earbuds",
      slug: "wireless-bluetooth-earbuds",
      details: "Premium sound quality wireless earbuds with noise cancellation and long battery life.",
      originalPrice: 99.99,
      discountPrice: 49.99,
      categoryId: electronics.id,
      stock: 150,
    },
    {
      name: "Smart Watch Fitness Tracker",
      slug: "smart-watch-fitness-tracker",
      details: "Track your fitness goals with this smart watch featuring heart rate monitor and GPS.",
      originalPrice: 199.99,
      discountPrice: 89.99,
      categoryId: electronics.id,
      stock: 100,
    },
    {
      name: "LED Smart TV 43 inch",
      slug: "led-smart-tv-43-inch",
      details: "Crystal-clear 4K Ultra HD resolution with built-in streaming apps.",
      originalPrice: 499.99,
      discountPrice: 329.99,
      categoryId: electronics.id,
      stock: 50,
    },
    {
      name: "Cotton Graphic T-Shirt",
      slug: "cotton-graphic-t-shirt",
      details: "Comfortable 100% cotton t-shirt with unique graphic design.",
      originalPrice: 29.99,
      discountPrice: 14.99,
      categoryId: fashion.id,
      stock: 200,
    },
    {
      name: "Classic Denim Jacket",
      slug: "classic-denim-jacket",
      details: "Timeless denim jacket that never goes out of style.",
      originalPrice: 89.99,
      discountPrice: 54.99,
      categoryId: fashion.id,
      stock: 80,
    },
    {
      name: "Leather Crossbody Bag",
      slug: "leather-crossbody-bag",
      details: "Elegant genuine leather crossbody bag with multiple compartments.",
      originalPrice: 119.99,
      discountPrice: 69.99,
      categoryId: fashion.id,
      stock: 60,
    },
    {
      name: "Ceramic Coffee Mug Set",
      slug: "ceramic-coffee-mug-set",
      details: "Set of 4 ceramic coffee mugs, perfect for home or office.",
      originalPrice: 39.99,
      discountPrice: 19.99,
      categoryId: home.id,
      stock: 120,
    },
    {
      name: "LED Desk Lamp",
      slug: "led-desk-lamp",
      details: "Modern adjustable LED desk lamp with multiple color temperatures.",
      originalPrice: 49.99,
      discountPrice: 29.99,
      categoryId: home.id,
      stock: 90,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
