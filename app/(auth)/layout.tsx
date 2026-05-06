export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-start overflow-x-hidden bg-[#f7f8f6] px-4 py-8 sm:justify-center">
      {children}
    </div>
  );
}
