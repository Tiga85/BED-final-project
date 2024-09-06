import { PrismaClient } from "@prisma/client";
import usersData from "../data/users.json" assert { type: "json" };
import reviewsData from "../data/reviews.json" assert { type: "json" };
import propertiesData from "../data/properties.json" assert { type: "json" };
import hostsData from "../data/hosts.json" assert { type: "json" };
import bookingsData from "../data/bookings.json" assert { type: "json" };
import amenitiesData from "../data/amenities.json" assert { type: "json" };
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  for (const user of usersData.users) {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: user,
      });
    }
  }
  // Seed Hosts
  for (const host of hostsData.hosts) {
    const existingHost = await prisma.host.findUnique({
      where: { id: host.id },
    });

    if (!existingHost) {
      await prisma.host.create({
        data: host,
      });
    }
  }
  // Seed Properties
  for (const property of propertiesData.properties) {
    const existingProperty = await prisma.property.findUnique({
      where: { id: property.id },
    });

    if (!existingProperty) {
      await prisma.property.create({
        data: property,
      });
    }
  }

  // Seed Amenities
  for (const amenity of amenitiesData.amenities) {
    const existingAmenity = await prisma.amenity.findUnique({
      where: { id: amenity.id },
    });

    if (!existingAmenity) {
      await prisma.amenity.create({
        data: amenity,
      });
    }
  }
  // Seed Bookings
  for (const booking of bookingsData.bookings) {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
    });

    if (existingBooking) {
      // Optionally update existing record
      await prisma.booking.update({
        where: { id: booking.id },
        data: booking,
      });
    } else {
      // Create new record
      await prisma.booking.create({
        data: booking,
      });
    }
  }

  // Seed Reviews
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
      // Optionally update the existing review
      await prisma.review.update({
        where: { id: review.id },
        data: review,
      });
    } else {
      // Create new review
      await prisma.review.create({
        data: review,
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
