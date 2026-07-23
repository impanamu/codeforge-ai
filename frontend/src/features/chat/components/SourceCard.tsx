import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Source } from "../types";

interface Props {
  source: Source;
}

export function SourceCard({ source }: Props) {
  return (
    <Card className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3 transition-colors hover:bg-muted">
      <div className="rounded-lg bg-primary/10 p-2">
        <FileText className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1">
        <p className="font-medium">{source.file_path}</p>

        <p className="text-sm text-muted-foreground">
          Lines {source.start_line} - {source.end_line}
        </p>
      </div>
    </Card>
  );
}