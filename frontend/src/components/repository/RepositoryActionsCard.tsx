import { Button } from "@/components/ui/button";

export default function RepositoryActionsCard() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold text-white">
        Actions
      </h2>

      <div className="flex flex-wrap gap-4">
        <Button disabled>
          Ask AI
        </Button>

        <Button
          variant="secondary"
          disabled
        >
          Re-index
        </Button>

        <Button
          variant="destructive"
          disabled
        >
          Delete Repository
        </Button>
      </div>
    </div>
  );
}