import { api } from "@/api/client";

export interface Repository {
  id: number;
  name: string;
  github_url: string;
  default_branch: string;
  local_path: string;

  status: string;
  indexed_files: number;
  indexed_chunks: number;
  last_indexed_at: string | null;
}

export async function getRepository(
  id: number,
): Promise<Repository> {
  const response = await api.get<Repository>(
    `/repositories/${id}`,
  );

  return response.data;
}