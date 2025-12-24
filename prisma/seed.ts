import { PrismaClient, NoteCategory, GenderProfile } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Notes
  const notes = await Promise.all([
    // Top Notes
    prisma.note.upsert({
      where: { name: "Bergamot" },
      update: {},
      create: {
        name: "Bergamot",
        category: NoteCategory.TOP,
        description: "Fresh, citrusy, and slightly bitter",
      },
    }),
    prisma.note.upsert({
      where: { name: "Lemon" },
      update: {},
      create: {
        name: "Lemon",
        category: NoteCategory.TOP,
        description: "Bright and zesty citrus",
      },
    }),
    prisma.note.upsert({
      where: { name: "Orange" },
      update: {},
      create: {
        name: "Orange",
        category: NoteCategory.TOP,
        description: "Sweet and juicy citrus",
      },
    }),
    prisma.note.upsert({
      where: { name: "Lavender" },
      update: {},
      create: {
        name: "Lavender",
        category: NoteCategory.TOP,
        description: "Calming and floral",
      },
    }),
    prisma.note.upsert({
      where: { name: "Pink Pepper" },
      update: {},
      create: {
        name: "Pink Pepper",
        category: NoteCategory.TOP,
        description: "Spicy and vibrant",
      },
    }),

    // Middle Notes
    prisma.note.upsert({
      where: { name: "Rose" },
      update: {},
      create: {
        name: "Rose",
        category: NoteCategory.MIDDLE,
        description: "Classic and romantic floral",
      },
    }),
    prisma.note.upsert({
      where: { name: "Jasmine" },
      update: {},
      create: {
        name: "Jasmine",
        category: NoteCategory.MIDDLE,
        description: "Intoxicating and sweet floral",
      },
    }),
    prisma.note.upsert({
      where: { name: "Lily" },
      update: {},
      create: {
        name: "Lily",
        category: NoteCategory.MIDDLE,
        description: "Elegant and fresh floral",
      },
    }),
    prisma.note.upsert({
      where: { name: "Cinnamon" },
      update: {},
      create: {
        name: "Cinnamon",
        category: NoteCategory.MIDDLE,
        description: "Warm and spicy",
      },
    }),
    prisma.note.upsert({
      where: { name: "Cardamom" },
      update: {},
      create: {
        name: "Cardamom",
        category: NoteCategory.MIDDLE,
        description: "Aromatic and exotic spice",
      },
    }),

    // Base Notes
    prisma.note.upsert({
      where: { name: "Vanilla" },
      update: {},
      create: {
        name: "Vanilla",
        category: NoteCategory.BASE,
        description: "Sweet and comforting",
      },
    }),
    prisma.note.upsert({
      where: { name: "Oud" },
      update: {},
      create: {
        name: "Oud",
        category: NoteCategory.BASE,
        description: "Rich and woody",
      },
    }),
    prisma.note.upsert({
      where: { name: "Musk" },
      update: {},
      create: {
        name: "Musk",
        category: NoteCategory.BASE,
        description: "Animalic and sensual",
      },
    }),
    prisma.note.upsert({
      where: { name: "Amber" },
      update: {},
      create: {
        name: "Amber",
        category: NoteCategory.BASE,
        description: "Warm and resinous",
      },
    }),
    prisma.note.upsert({
      where: { name: "Sandalwood" },
      update: {},
      create: {
        name: "Sandalwood",
        category: NoteCategory.BASE,
        description: "Creamy and woody",
      },
    }),
  ]);

  console.log(`✅ Created ${notes.length} notes`);

  // Create Bottle Sizes
  const bottleSizes = await Promise.all([
    prisma.bottleSize.upsert({
      where: { sizeMl: 50 },
      update: {},
      create: {
        sizeMl: 50,
        basePrice: 89.99,
      },
    }),
    prisma.bottleSize.upsert({
      where: { sizeMl: 100 },
      update: {},
      create: {
        sizeMl: 100,
        basePrice: 159.99,
      },
    }),
  ]);

  console.log(`✅ Created ${bottleSizes.length} bottle sizes`);

  // Create Sample Products
  const bergamot = notes.find((n) => n.name === "Bergamot")!;
  const rose = notes.find((n) => n.name === "Rose")!;
  const vanilla = notes.find((n) => n.name === "Vanilla")!;
  const jasmine = notes.find((n) => n.name === "Jasmine")!;
  const oud = notes.find((n) => n.name === "Oud")!;
  const sandalwood = notes.find((n) => n.name === "Sandalwood")!;

  // Create products first
  const product1 = await prisma.product.upsert({
    where: { id: "classic-elegance" },
    update: {},
    create: {
      id: "classic-elegance",
      name: "Classic Elegance",
      slug: "classic-elegance",
      brand: "Rawaj",
      description: "A timeless fragrance with floral and woody notes",
      price: 129.99,
      stockQty: 50,
      isActive: true,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: "modern-fresh" },
    update: {},
    create: {
      id: "modern-fresh",
      name: "Modern Fresh",
      slug: "modern-fresh",
      brand: "Rawaj",
      description: "A contemporary blend of citrus and aquatic notes",
      price: 119.99,
      stockQty: 30,
      isActive: true,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: "oriental-spice" },
    update: {},
    create: {
      id: "oriental-spice",
      name: "Oriental Spice",
      slug: "oriental-spice",
      brand: "Rawaj",
      description: "Rich and warm with oud and vanilla",
      price: 149.99,
      stockQty: 25,
      isActive: true,
    },
  });

  // Create product notes (delete existing first, then create)
  await prisma.productNote.deleteMany({
    where: {
      productId: {
        in: [product1.id, product2.id, product3.id],
      },
    },
  });

  await Promise.all([
    prisma.productNote.create({
      data: {
        productId: product1.id,
        noteId: bergamot.id,
        strength: 3,
      },
    }),
    prisma.productNote.create({
      data: {
        productId: product1.id,
        noteId: rose.id,
        strength: 5,
      },
    }),
    prisma.productNote.create({
      data: {
        productId: product1.id,
        noteId: vanilla.id,
        strength: 4,
      },
    }),
    prisma.productNote.create({
      data: {
        productId: product2.id,
        noteId: bergamot.id,
        strength: 5,
      },
    }),
    prisma.productNote.create({
      data: {
        productId: product2.id,
        noteId: jasmine.id,
        strength: 3,
      },
    }),
    prisma.productNote.create({
      data: {
        productId: product2.id,
        noteId: sandalwood.id,
        strength: 2,
      },
    }),
    prisma.productNote.create({
      data: {
        productId: product3.id,
        noteId: rose.id,
        strength: 2,
      },
    }),
    prisma.productNote.create({
      data: {
        productId: product3.id,
        noteId: oud.id,
        strength: 5,
      },
    }),
    prisma.productNote.create({
      data: {
        productId: product3.id,
        noteId: vanilla.id,
        strength: 4,
      },
    }),
  ]);

  const products = [product1, product2, product3];

  console.log(`✅ Created ${products.length} products`);

  // Create Inspirations (famous perfumes - for search/matching only)
  const inspirations = await Promise.all([
    prisma.inspiration.upsert({
      where: { id: "insp-sauvage" },
      update: {},
      create: {
        id: "insp-sauvage",
        displayName: "Dior Sauvage",
        searchableAliases: ["sauvage", "dior sauvage", "sauvage dior"],
        genderProfile: GenderProfile.MASCULINE,
        topNotes: ["Bergamot", "Pepper"],
        middleNotes: ["Lavender", "Pink Pepper", "Patchouli"],
        baseNotes: ["Ambroxan", "Cedar", "Labdanum"],
        mainAccords: ["fresh", "spicy", "woody", "aromatic"],
        moodTags: ["confident", "bold", "modern", "energetic"],
        intensity: 4,
      },
    }),
    prisma.inspiration.upsert({
      where: { id: "insp-bleu" },
      update: {},
      create: {
        id: "insp-bleu",
        displayName: "Bleu de Chanel",
        searchableAliases: ["bleu de chanel", "bleu", "chanel bleu"],
        genderProfile: GenderProfile.MASCULINE,
        topNotes: ["Lemon", "Mint", "Pink Pepper", "Grapefruit"],
        middleNotes: ["Ginger", "Jasmine", "Nutmeg"],
        baseNotes: ["Incense", "Patchouli", "Cedar", "Sandalwood"],
        mainAccords: ["woody", "fresh", "spicy", "aromatic"],
        moodTags: ["sophisticated", "elegant", "refined", "versatile"],
        intensity: 3,
      },
    }),
    prisma.inspiration.upsert({
      where: { id: "insp-chanel5" },
      update: {},
      create: {
        id: "insp-chanel5",
        displayName: "Chanel No. 5",
        searchableAliases: ["chanel no 5", "chanel number 5", "no 5"],
        genderProfile: GenderProfile.FEMININE,
        topNotes: ["Aldehydes", "Lemon", "Neroli", "Ylang-Ylang"],
        middleNotes: ["Rose", "Jasmine", "Lily of the Valley"],
        baseNotes: ["Vanilla", "Amber", "Sandalwood", "Vetiver"],
        mainAccords: ["floral", "aldehydic", "powdery", "woody"],
        moodTags: ["timeless", "elegant", "classic", "sophisticated"],
        intensity: 4,
      },
    }),
    prisma.inspiration.upsert({
      where: { id: "insp-tom-ford" },
      update: {},
      create: {
        id: "insp-tom-ford",
        displayName: "Tom Ford Black Orchid",
        searchableAliases: [
          "black orchid",
          "tom ford black orchid",
          "tf black orchid",
        ],
        genderProfile: GenderProfile.MIXED,
        topNotes: ["Truffle", "Blackcurrant", "Bergamot"],
        middleNotes: ["Orchid", "Fruit", "Spices"],
        baseNotes: ["Patchouli", "Vanilla", "Incense", "Amber"],
        mainAccords: ["oriental", "floral", "woody", "spicy"],
        moodTags: ["luxurious", "sensual", "mysterious", "bold"],
        intensity: 5,
      },
    }),
  ]);

  console.log(`✅ Created ${inspirations.length} inspirations`);

  // Link products to inspirations with similarity scores
  // Classic Elegance inspired by Chanel No. 5
  await prisma.productInspiration.upsert({
    where: {
      productId_inspirationId: {
        productId: product1.id,
        inspirationId: inspirations.find((i) => i.id === "insp-chanel5")!.id,
      },
    },
    update: { similarityScore: 0.75 },
    create: {
      productId: product1.id,
      inspirationId: inspirations.find((i) => i.id === "insp-chanel5")!.id,
      similarityScore: 0.75,
    },
  });

  // Modern Fresh inspired by Bleu de Chanel
  await prisma.productInspiration.upsert({
    where: {
      productId_inspirationId: {
        productId: product2.id,
        inspirationId: inspirations.find((i) => i.id === "insp-bleu")!.id,
      },
    },
    update: { similarityScore: 0.7 },
    create: {
      productId: product2.id,
      inspirationId: inspirations.find((i) => i.id === "insp-bleu")!.id,
      similarityScore: 0.7,
    },
  });

  // Oriental Spice inspired by Tom Ford Black Orchid
  await prisma.productInspiration.upsert({
    where: {
      productId_inspirationId: {
        productId: product3.id,
        inspirationId: inspirations.find((i) => i.id === "insp-tom-ford")!.id,
      },
    },
    update: { similarityScore: 0.8 },
    create: {
      productId: product3.id,
      inspirationId: inspirations.find((i) => i.id === "insp-tom-ford")!.id,
      similarityScore: 0.8,
    },
  });

  // Add slug to existing products
  await prisma.product.update({
    where: { id: product1.id },
    data: { slug: "classic-elegance" },
  });
  await prisma.product.update({
    where: { id: product2.id },
    data: { slug: "modern-fresh" },
  });
  await prisma.product.update({
    where: { id: product3.id },
    data: { slug: "oriental-spice" },
  });

  console.log("✅ Linked products to inspirations");

  // Create a test user (optional)
  const hashedPassword = await bcrypt.hash("password123", 10);
  const testUser = await prisma.user.upsert({
    where: { email: "test@rawaj.com" },
    update: {},
    create: {
      email: "test@rawaj.com",
      password: hashedPassword,
      fullName: "Test User",
    },
  });

  console.log(`✅ Created test user: ${testUser.email}`);
  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
