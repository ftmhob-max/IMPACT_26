import { redirect } from "next/navigation";
import { LearnerPage, PageHeader } from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { SettingsClient } from "@/components/profile/SettingsClient";
import { getLearnerSession } from "@/lib/firebase/learner-session";

export default async function SettingsPage() {
  const session = await getLearnerSession();
  if (!session) redirect("/sign-in");

  return (
    <LearnerPage>
      <PageHeader
        eyebrow="Settings"
        title="Platform settings"
        description="Set study reminders, notification preferences, display defaults, privacy, and security shortcuts."
        icon={Icons.Settings}
      />
      <SettingsClient />
    </LearnerPage>
  );
}
