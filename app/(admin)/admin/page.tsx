import Link from "next/link";

export default function AdminDashboard() {
  const tools = [
    { href: "/admin/questions", label: "Question Bank", description: "Add, edit, and manage exam questions", icon: "❓" },
    { href: "/admin/quizzes",   label: "Quizzes",       description: "Build quizzes from the question bank", icon: "📝" },
    { href: "/admin/courses",   label: "Courses",       description: "Manage courses and lessons", icon: "🗂" },
    { href: "/admin/cohorts",   label: "Cohort Stats",  description: "View learner performance analytics", icon: "📊" },
    { href: "/admin/users",     label: "Users",         description: "Manage user roles and access", icon: "👥" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your e-learning platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5"
          >
            <div className="text-2xl mb-2">{tool.icon}</div>
            <p className="font-semibold text-slate-800 text-sm">{tool.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
