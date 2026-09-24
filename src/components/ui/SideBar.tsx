import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Test Cases', href: '/test-cases' },
  { label: 'Test Runs', href: '/test-runs' },
  { label: 'Bugs', href: '/bugs' },
  { label: 'Reports', href: '/reports' },
  { label: 'User', href: '/user' },
];

export default function SideBar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white p-4" aria-label="Sidebar">
      <div className="mb-6 border-b border-slate-200 px-2 pb-4">
        <p className="text-lg font-semibold text-slate-900">QA Tracker</p>
        <p className="text-sm text-slate-500">Project workspace</p>
      </div>
      <nav aria-label="Main navigation" className="space-y-1">
        {navItems.map(({ label, href }) => (
          <Link
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            href={href}
            key={label}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}