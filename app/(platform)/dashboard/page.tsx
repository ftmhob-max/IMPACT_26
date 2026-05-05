import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Welcome back. Continue your property assessment training.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickCard
          href="/courses"
          title="Browse Courses"
          description="Explore all available training modules"
          icon="📚"
          color="bg-blue-50 border-blue-100"
        />
        <QuickCard
          href="/formulas"
          title="Formula Index"
          description="53 formulas across 8 assessment sections"
          icon="∑"
          color="bg-violet-50 border-violet-100"
        />
        <QuickCard
          href="/profile"
          title="My Progress"
          description="View your exam history and scores"
          icon="📈"
          color="bg-emerald-50 border-emerald-100"
        />
      </div>

      {/* Placeholder: recent activity */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <p className="text-sm text-slate-400 text-center py-8">
          No activity yet. Start a course to see your progress here.
        </p>
      </div>
    </div>
  );
}

function QuickCard({
  href,
  title,
  description,
  icon,
  color,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-xl border p-5 hover:shadow-md transition-shadow duration-200 ${color}`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="font-semibold text-slate-800 text-sm">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </Link>
  );
}
