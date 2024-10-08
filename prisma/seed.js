import { PrismaClient } from "@prisma/client";
import usersData from "../data/users.json" assert { type: "json" };
import reviewsData from "../data/reviews.json" assert { type: "json" };
import propertiesData from "../data/properties.json" assert { type: "json" };
import hostsData from "../data/hosts.json" assert { type: "json" };
import bookingsData from "../data/bookings.json" assert { type: "json" };
import amenitiesData from "../data/amenities.json" assert { type: "json" };

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

async function main() {
  try {
    console.log("Starting database seeding...");

    console.log("Seeding Users...");
    await prisma.user.createMany({
      data: usersData.users,
      skipDuplicates: true, // Avoid creating duplicates
    });

    console.log("Seeding Hosts...");
    await prisma.host.createMany({
      data: hostsData.hosts,
      skipDuplicates: true,
    });

    console.log("Seeding Properties...");
    await prisma.property.createMany({
      data: propertiesData.properties,
      skipDuplicates: true,
    });

    console.log("Seeding Amenities...");
    await prisma.amenity.createMany({
      data: amenitiesData.amenities,
      skipDuplicates: true,
    });

    console.log("Seeding Bookings...");
    for (const booking of bookingsData.bookings) {
      const existingBooking = await prisma.booking.findUnique({
        where: { id: booking.id },
      });

      if (existingBooking) {
        console.log(`Updating Booking with ID ${booking.id}`);
        await prisma.booking.update({
          where: { id: booking.id },
          data: booking,
        });
      } else {
        console.log(`Creating new Booking with ID ${booking.id}`);
        await prisma.booking.create({
          data: booking,
        });
      }
    }

    console.log("Seeding Reviews...");
    for (const review of reviewsData.reviews) {
      const existingProperty = await prisma.property.findUnique({
        where: { id: review.propertyId },
      });

      if (!existingProperty) {
        console.error(
          `Property with id ${review.propertyId} does not exist. Skipping review creation.`
        );
        continue; // Skip this review if the property does not exist
      }

      const existingReview = await prisma.review.findUnique({
        where: { id: review.id },
      });

      if (existingReview) {
        console.log(`Updating Review with ID ${review.id}`);
        await prisma.review.update({
          where: { id: review.id },
          data: review,
        });
      } else {
        console.log(`Creating new Review with ID ${review.id}`);
        await prisma.review.create({
          data: review,
        });
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()

.then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
