import Link from "next/link";

// Server component — fetches published courses from Data Connect
async function getCourses() {
  // Populated after Data Connect is configured and migration script is run
  return [];
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Course Catalog</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Property assessment training courses
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center space-y-4">
          <p className="text-slate-400 text-sm">No courses published yet.</p>
          <p className="text-slate-400 text-xs">
            Admins can create courses in the{" "}
            <Link href="/admin/courses" className="text-blue-600 hover:underline">
              admin panel
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(courses as Array<{ id: string; slug: string; title: string; description?: string; thumbnailUrl?: string }>).map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="block bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              {course.thumbnailUrl && (
                <div className="aspect-video bg-slate-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="font-semibold text-slate-800">{course.title}</h2>
              {course.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
