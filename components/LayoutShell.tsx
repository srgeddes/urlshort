import type { ReactNode } from "react";

type LayoutShellProps = {
  children: ReactNode;
};

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-md shadow-slate-200 sm:p-8">
        {children}
      </div>
    </main>
  );
}

