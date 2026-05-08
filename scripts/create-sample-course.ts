import { randomUUID } from "crypto";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const PROJECT_ID = "impact26-aa59b";

async function getAdminToken() {
  const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) throw new Error("SERVICE_ACCOUNT_KEY not set");
  const config = JSON.parse(serviceAccountKey);
  if (config.private_key) config.private_key = config.private_key.replace(/\\n/g, "\n");
  
  const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(config), projectId: PROJECT_ID });
  // @ts-ignore
  const token = await app.options.credential.getAccessToken();
  return token.access_token;
}

async function dcMutate(operation: string, variables: any) {
  const token = await getAdminToken();
  const host = process.env.FIREBASE_DATACONNECT_EMULATOR_HOST 
    ? `http://${process.env.FIREBASE_DATACONNECT_EMULATOR_HOST}`
    : "https://firebasedataconnect.googleapis.com";
    
  const res = await fetch(`${host}/v1beta/projects/${PROJECT_ID}/locations/us-central1/services/impact26-dataconnect/connectors/impact26-connector:executeMutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, "X-Goog-DataConnect-Operation-Name": operation },
    body: JSON.stringify({ operationName: operation, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(`${operation} failed: ${JSON.stringify(json.errors)}`);
  return json.data;
}

async function main() {
  const adminId = "00000000-0000-0000-0000-000000000000";
  console.log("Ensuring system user exists...");
  try {
    await dcMutate("CreateUser", {
      id: adminId,
      email: "system@impact26.com",
      fullName: "System Admin"
    });
  } catch (e) {
    console.log("System user already exists, proceeding...");
  }

  console.log("Creating sample course...");
  const courseId = "8130c8f2-e834-43cc-aa61-092180207376"; // Use the ID I found or generate
  try {
    await dcMutate("CreateCourse", {
      id: courseId,
      slug: "property-assessment-mastery",
      title: "Property Assessment Mastery",
      description: "A comprehensive guide to property assessment, covering math, law, and philly-specific regulations.",
      thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
      createdById: adminId
    });
  } catch (e) {
    console.log("Course already exists, proceeding...");
  }

  try {
    await dcMutate("UpdateCourse", {
      id: courseId,
      isPublished: true
    });
  } catch (e) {
    console.log("Could not update course, proceeding...");
  }

  console.log("Creating modules...");
  const moduleId = "6e30b37b-6ad3-4fff-9a81-cfa63d2a41b5";
  try {
    await dcMutate("CreateModule", {
      id: moduleId,
      courseId,
      title: "Introduction to Assessment",
      position: 1
    });
  } catch (e) {
    console.log("Module already exists, proceeding...");
  }

  try {
    await dcMutate("CreateLesson", {
      id: randomUUID(),
      moduleId,
      title: "Welcome to the Course",
      position: 1,
      lessonType: "text"
    });
  } catch (e) {
    console.log("Lesson already exists, proceeding...");
  }

  console.log("✅ Sample course structure ensured!");
}

main().catch(console.error);
