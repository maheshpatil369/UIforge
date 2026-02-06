import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="relative">
        {/* Background Decoration */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm normal-case',
              card: 'shadow-2xl border border-slate-200 rounded-2xl',
              headerTitle: 'text-2xl font-bold text-slate-800',
              headerSubtitle: 'text-slate-500'
            }
          }}
        />
      </div>
    </div>
  );
}