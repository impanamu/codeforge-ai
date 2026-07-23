import HeroSearch from "../components/HeroSearch";
import RepositoryHealth from "../components/RepositoryHealth";
import RecentActivity from "../components/RecentActivity";
import RecentRepositories from "../components/RecentRepositories";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <HeroSearch />

      <div className="grid gap-6 xl:grid-cols-3">
        <RepositoryHealth />

        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
      </div>

      <RecentRepositories />
    </div>
  );
}