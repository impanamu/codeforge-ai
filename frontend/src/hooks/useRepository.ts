import { useQuery } from "@tanstack/react-query";

import { getRepository } from "@/api/repositories";
import type { Repository } from "@/api/repositories";

export function useRepository(id: number) {
  return useQuery<Repository>({
    queryKey: ["repository", id],
    queryFn: () => getRepository(id),
    enabled: id > 0,
  });
}