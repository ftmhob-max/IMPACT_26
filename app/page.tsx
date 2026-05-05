import { redirect } from "next/navigation";

// Root "/" redirects to the dashboard (protected) or sign-in (middleware handles it)
export default function Home() {
  redirect("/dashboard");
}
