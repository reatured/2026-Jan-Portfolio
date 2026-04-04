import type { Project, SiteConfig } from '../index.js';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3002') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || `Request failed: ${response.statusText}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${(error as Error).message}`);
    }
  }

  // Data endpoints
  async getData(): Promise<{ projects: Project[]; site: SiteConfig }> {
    return this.request('/api/data');
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    const data = await this.getData();
    return data.projects;
  }

  async createProject(project: Omit<Project, 'id'>): Promise<{ ok: true }> {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: Project): Promise<{ ok: true }> {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<{ ok: true }> {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderProjects(ids: string[]): Promise<{ ok: true }> {
    return this.request('/api/projects/reorder', {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    });
  }

  // History endpoints
  async getProjectHistory(id: string): Promise<Array<{
    savedAt: string;
    snapshot: Project;
  }>> {
    return this.request(`/api/history/${id}`);
  }

  async restoreProjectVersion(
    id: string,
    savedAt: string
  ): Promise<{ ok: true }> {
    return this.request(`/api/history/${id}/restore`, {
      method: 'POST',
      body: JSON.stringify({ savedAt }),
    });
  }

  // Site config endpoints
  async updateSiteConfig(site: SiteConfig): Promise<{ ok: true }> {
    return this.request('/api/site', {
      method: 'PUT',
      body: JSON.stringify(site),
    });
  }

  // Upload endpoint
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || 'Upload failed', response.status);
    }

    return data.path;
  }
}

// Create a default instance
export const apiClient = new ApiClient();
