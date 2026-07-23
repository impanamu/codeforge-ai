export default function DashboardHeader() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="mb-10">
      <p className="text-sm uppercase tracking-widest text-blue-400">
        Dashboard
      </p>

      <h1 className="mt-2 text-4xl font-bold text-white">
        {greeting} 👋
      </h1>

      <p className="mt-3 max-w-2xl text-slate-400">
        Welcome back to CodeForge AI. Here's an overview of your repositories,
        AI activity, and project insights.
      </p>
    </div>
  );
}