import { randomUUID } from "crypto";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

async function main() {
  const adminId = "00000000-0000-0000-0000-000000000000";
  console.log("Ensuring system user exists...");
  try {
    await adminDcMutate("CreateUser", {
      id: adminId,
      email: "system@impact26.com",
      fullName: "System Admin",
    });
  } catch {
    console.log("System user already exists, proceeding...");
  }

  console.log("Creating sample course...");
  const courseId = "8130c8f2-e834-43cc-aa61-092180207376";
  try {
    await adminDcMutate("CreateCourse", {
      id: courseId,
      slug: "property-assessment-mastery",
      title: "Property Assessment Mastery",
      description:
        "A comprehensive guide to property assessment, covering math, law, and philly-specific regulations.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
      createdById: adminId,
    });
  } catch {
    console.log("Course already exists, proceeding...");
  }

  try {
    await adminDcMutate("UpdateCourse", {
      id: courseId,
      isPublished: true,
    });
  } catch {
    console.log("Could not update course, proceeding...");
  }

  console.log("Creating modules...");
  const moduleId = "6e30b37b-6ad3-4fff-9a81-cfa63d2a41b5";
  try {
    await adminDcMutate("CreateModule", {
      id: moduleId,
      courseId,
      title: "Introduction to Assessment",
      position: 1,
    });
  } catch {
    console.log("Module already exists, proceeding...");
  }

  try {
    await adminDcMutate("CreateLesson", {
      id: randomUUID(),
      moduleId,
      title: "Welcome to the Course",
      position: 1,
      lessonType: "text",
    });
  } catch {
    console.log("Lesson already exists, proceeding...");
  }

  console.log("✅ Sample course structure ensured!");
}

main().catch(console.error);
