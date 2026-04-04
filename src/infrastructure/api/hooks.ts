import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project, SiteConfig } from '@types';
import { apiClient } from '../../../packages/shared/src/api/client';

// Query keys
export const queryKeys = {
  all: ['data'] as const,
  projects: () => [...queryKeys.all, 'projects'] as const,
  project: (id: string) => [...queryKeys.projects(), id] as const,
  site: () => [...queryKeys.all, 'site'] as const,
  history: (id: string) => [...queryKeys.project(id), 'history'] as const,
};

// Queries
export function useData() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: () => apiClient.getData(),
  });
}

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects(),
    queryFn: () => apiClient.getProjects(),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: async () => {
      const projects = await apiClient.getProjects();
      return projects.find(p => p.slug === id);
    },
    enabled: !!id,
  });
}

export function useSiteConfig() {
  return useQuery({
    queryKey: queryKeys.site(),
    queryFn: async () => {
      const data = await apiClient.getData();
      return data.site;
    },
  });
}

export function useProjectHistory(id: string) {
  return useQuery({
    queryKey: queryKeys.history(id),
    queryFn: () => apiClient.getProjectHistory(id),
    enabled: !!id,
  });
}

// Mutations
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: Omit<Project, 'id'>) => apiClient.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, project }: { id: string; project: Project }) => 
      apiClient.updateProject(id, project),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useReorderProjects() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids: string[]) => apiClient.reorderProjects(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (site: SiteConfig) => apiClient.updateSiteConfig(site),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.site() });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useRestoreProjectVersion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, savedAt }: { id: string; savedAt: string }) => 
      apiClient.restoreProjectVersion(id, savedAt),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}
