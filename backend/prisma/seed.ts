import { PrismaClient } from "@prisma/client";
import studentVIPJson from "../data/studentVIP_reviews.json";
import uniNotesJson from "../data/uninotes_reviews.json";

const prisma = new PrismaClient();

/**
 * Seed the database with the data from the JSON file for studentVIP and Uninotes reviews
 * @returns void
 * @throws Error
 */
async function main() {
  // Read JSON file
  const studentVIPData = studentVIPJson;

  for (const course of studentVIPData) {
    const courseCode = course.course;
    for (const review of course.reviews) {
      await prisma.reviewsScraped.create({
        data: {
          courseCode,
          source: "StudentVIP",
          authorName: review.authorName,
          title: "-",
          description: review.description,
          termTaken: review.termTaken,
          upvotes: [],
          overallRating: review.rating,
        },
      });
    }
  }

  const uniNotesData = uniNotesJson;

  for (const course of uniNotesData) {
    const courseCode = course.course;
    for (const review of course.reviews) {
      await prisma.reviewsScraped.create({
        data: {
          courseCode,
          source: "Uninotes",
          authorName: review.authorName,
          title: "-",
          description: review.description,
          termTaken: review.termTaken,
          upvotes: [],
          overallRating: review.rating,
        }
      })
    }
  }

}

main()
  .then(() => {
    console.log("Data seeded successfully");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });