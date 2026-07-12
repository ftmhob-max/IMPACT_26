// Backend certificate eligibility services: lib/firebase/certificates.ts
// Eligibility is based only on published lessons and owner-scoped progress.

import { adminDcQuery } from "@/lib/firebase/admin-dc";

export interface CertificateCourse {
  id: string;
  slug: string;
  title: string;
  isPublished?: boolean;
  modules_on_course: Array<{
    lessons_on_module: Array<{ id: string }>;
  }>;
}

/**
 * Fails closed when a certificate lookup returns a draft or incomplete record.
 */
export function isPublishedCertificateCourse(
  course: CertificateCourse | null,
): course is CertificateCourse {
  return course?.isPublished === true;
}

export interface CertificateLessonProgress {
  lesson: { id: string };
  status: string;
  completedAt: string | null;
}

export interface CertificateEligibility {
  eligible: boolean;
  issueDate: string | null;
  publishedLessonCount: number;
  completedLessonCount: number;
}

interface CertificateProgressData {
  userCourseProgress: Array<{ completedAt: string | null }>;
  userLessonProgresses: CertificateLessonProgress[];
}

export function deriveCertificateEligibility(
  course: CertificateCourse,
  lessonProgress: CertificateLessonProgress[],
  courseCompletedAt: string | null,
  referenceDate: Date = new Date(),
): CertificateEligibility {
  const publishedLessonIds = new Set(
    course.modules_on_course.flatMap((courseModule) =>
      courseModule.lessons_on_module.map((lesson) => lesson.id),
    ),
  );
  const completedPublishedLessons = lessonProgress.filter(
    (progress) =>
      publishedLessonIds.has(progress.lesson.id) && progress.status === "completed",
  );
  const completedLessonIds = new Set(
    completedPublishedLessons.map((progress) => progress.lesson.id),
  );
  const eligible =
    publishedLessonIds.size > 0 && completedLessonIds.size === publishedLessonIds.size;

  if (!eligible) {
    return {
      eligible: false,
      issueDate: null,
      publishedLessonCount: publishedLessonIds.size,
      completedLessonCount: completedLessonIds.size,
    };
  }

  const validLessonCompletionTimes = completedPublishedLessons
    .map((progress) => progress.completedAt)
    .filter((timestamp): timestamp is string => timestamp !== null)
    .map((timestamp) => Date.parse(timestamp))
    .filter((timestamp) => !Number.isNaN(timestamp));
  const latestLessonCompletion =
    validLessonCompletionTimes.length > 0
      ? new Date(Math.max(...validLessonCompletionTimes)).toISOString()
      : null;
  const validCourseCompletion =
    courseCompletedAt !== null && !Number.isNaN(Date.parse(courseCompletedAt))
      ? new Date(courseCompletedAt).toISOString()
      : null;

  return {
    eligible: true,
    issueDate: latestLessonCompletion ?? validCourseCompletion ?? referenceDate.toISOString(),
    publishedLessonCount: publishedLessonIds.size,
    completedLessonCount: completedLessonIds.size,
  };
}

export async function getCourseCertificateEligibility(
  userId: string,
  slug: string,
): Promise<{ course: CertificateCourse | null; eligibility: CertificateEligibility | null }> {
  const courseData = await adminDcQuery<{ courses: CertificateCourse[] }>(
    "GetPublishedCourseBySlug",
    { slug },
  );
  const course = courseData.courses[0] ?? null;
  if (!isPublishedCertificateCourse(course)) {
    return { course: null, eligibility: null };
  }

  const progressData = await adminDcQuery<CertificateProgressData>(
    "GetUserCourseProgressFull",
    { userId, courseId: course.id },
  );

  return {
    course,
    eligibility: deriveCertificateEligibility(
      course,
      progressData.userLessonProgresses,
      progressData.userCourseProgress[0]?.completedAt ?? null,
    ),
  };
}
