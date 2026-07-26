import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repositoriesApi } from '../api/repositoriesApi';
import { searchApi } from '../api/searchApi';
import { chatApi } from '../api/chatApi';
import { healthApi } from '../api/healthApi';

// System Health query
export const useHealth = () =>
  useQuery({
    queryKey: ['system-health'],
    queryFn: healthApi.getHealth,
    refetchInterval: 30000,
    retry: 1,
  });

// Repositories list query — auto-refetches every 3 s when any repo is indexing
export const useRepositories = (enabled = true) => {
  const result = useQuery({
    queryKey: ['repositories'],
    queryFn: repositoriesApi.getRepositories,
    enabled,
    staleTime: 5000,
    refetchInterval: (data) => {
      // data is the query data from the cache
      const repos = data?.state?.data ?? [];
      const isIndexing = repos.some(r => r.status === 'indexing');
      return isIndexing ? 3000 : false;  // poll every 3 s while any repo is indexing
    },
  });
  return result;
};

// Repository detail query — auto-refetches when still indexing
export const useRepositoryDetail = (repositoryId) =>
  useQuery({
    queryKey: ['repository', repositoryId],
    queryFn: () => repositoriesApi.getRepository(repositoryId),
    enabled: !!repositoryId,
    refetchInterval: (data) => {
      const repo = data?.state?.data;
      return repo?.status === 'indexing' ? 3000 : false;
    },
  });

// Create Repository mutation
export const useCreateRepository = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repositoriesApi.createRepository,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['repositories'] }),
  });
};

// Delete Repository mutation
export const useDeleteRepository = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repositoriesApi.deleteRepository,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['repositories'] }),
  });
};

// Index Repository mutation
export const useIndexRepository = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repositoryId) => repositoriesApi.indexRepository(repositoryId),
    onSuccess: (_, repositoryId) => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['repository', repositoryId] });
    },
  });
};

// Search Repository mutation
export const useSearchRepository = () =>
  useMutation({
    mutationFn: ({ repositoryId, question }) => searchApi.searchRepository(repositoryId, question),
  });

// Chat Repository mutation
export const useChatRepository = () =>
  useMutation({
    mutationFn: ({ repositoryId, question }) => chatApi.chatWithRepository(repositoryId, question),
  });
