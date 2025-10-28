import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.media.deleteMany();
  console.log('🧹 Cleared existing data');

  // Create sample data - using strings instead of enums
  const sampleMedia = [
    {
      title: "Inception",
      type: "MOVIE",  // Changed to string
      director: "Christopher Nolan",
      budget: "$160M",
      location: "LA, Paris",
      duration: "148 min",
      yearTime: "2010"
    },
    {
      title: "Breaking Bad",
      type: "TV_SHOW",  // Changed to string
      director: "Vince Gilligan",
      budget: "$3M/ep",
      location: "Albuquerque",
      duration: "49 min/ep",
      yearTime: "2008-2013"
    },
    {
      title: "The Dark Knight",
      type: "MOVIE",
      director: "Christopher Nolan",
      budget: "$185M",
      location: "Chicago, London",
      duration: "152 min",
      yearTime: "2008"
    },
    {
      title: "Stranger Things",
      type: "TV_SHOW",
      director: "The Duffer Brothers",
      budget: "$8M/ep",
      location: "Atlanta, Georgia",
      duration: "50 min/ep",
      yearTime: "2016-2024"
    },
    {
      title: "The Shawshank Redemption",
      type: "MOVIE",
      director: "Frank Darabont",
      budget: "$25M",
      location: "Mansfield, Ohio",
      duration: "142 min",
      yearTime: "1994"
    },
    {
      title: "Game of Thrones",
      type: "TV_SHOW",
      director: "David Benioff, D.B. Weiss",
      budget: "$6M/ep",
      location: "Northern Ireland, Croatia",
      duration: "55 min/ep",
      yearTime: "2011-2019"
    }
  ];

  for (const media of sampleMedia) {
    await prisma.media.create({
      data: media,
    });
  }

  console.log('✅ Sample data created successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });