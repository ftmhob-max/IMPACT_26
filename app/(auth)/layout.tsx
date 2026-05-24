export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-stretch justify-center overflow-x-hidden bg-white sm:items-center sm:bg-[#f7f8f6] sm:px-4 sm:py-8">
      {children}
    </div>
  );
}
