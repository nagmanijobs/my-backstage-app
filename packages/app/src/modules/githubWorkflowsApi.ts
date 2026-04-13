import {
  ApiBlueprint,
  createFrontendModule,
  discoveryApiRef,
} from '@backstage/frontend-plugin-api';
import { fetchApiRef } from '@backstage/core-plugin-api';
import {
  githubWorkflowsApiRef,
  type GithubWorkflowsApi,
  type JobsResponse,
  type WorkflowRun,
  type EnvironmentsResponse,
  type Workflows,
  type Branch,
} from '@veecode-platform/github-workflows-common';

type DiscoveryApi = {
  getBaseUrl(pluginId: string): Promise<string>;
};

type FetchApi = {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
};

class GithubWorkflowsApiClient implements GithubWorkflowsApi {
  constructor(
    private readonly discoveryApi: DiscoveryApi,
    private readonly fetchApi: FetchApi,
  ) {}

  private async fetchFromBackend<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('github-workflow-backend');
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  private async postToBackend<T>(endpoint: string, body: object): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('github-workflow-backend');
    const url = `${baseUrl}/${endpoint}`;

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  async listWorkflows(
    hostname: string,
    githubRepoSlug: string,
    branch: string,
    filter?: string[],
  ): Promise<Workflows[]> {
    const params: Record<string, string> = { hostname, githubRepoSlug, branch };
    if (filter && filter.length > 0) {
      params.filter = filter.join(',');
    }

    return this.fetchFromBackend<Workflows[]>('workflows', params);
  }

  async listBranchesFromRepo(hostname: string, githubRepoSlug: string): Promise<Branch[]> {
    return this.fetchFromBackend<Branch[]>('branches', { hostname, githubRepoSlug });
  }

  async getBranchDefaultFromRepo(hostname: string, githubRepoSlug: string): Promise<string> {
    return this.fetchFromBackend<string>('default-branch', { hostname, githubRepoSlug });
  }

  async startWorkflowRun(
    hostname: string,
    githubRepoSlug: string,
    workflowId: number,
    branch: string,
    inputs?: { [key: string]: unknown },
  ): Promise<number> {
    const response = await this.postToBackend<{ status: number }>('start-workflow', {
      hostname,
      githubRepoSlug,
      workflowId,
      branch,
      ...(inputs ? { inputs } : {}),
    });

    return response.status;
  }

  async stopWorkflowRun(hostname: string, githubRepoSlug: string, runId: number): Promise<number> {
    const response = await this.postToBackend<{ status: number }>('stop-workflow', {
      hostname,
      githubRepoSlug,
      runId,
    });

    return response.status;
  }

  async listJobsForWorkflowRun(
    hostname: string,
    githubRepoSlug: string,
    id: number,
    pageSize?: number,
    page?: number,
  ): Promise<JobsResponse> {
    const params: Record<string, string> = {
      hostname,
      githubRepoSlug,
      id: String(id),
    };
    if (pageSize) {
      params.pageSize = String(pageSize);
    }
    if (page) {
      params.page = String(page);
    }

    return this.fetchFromBackend<JobsResponse>('jobs', params);
  }

  async getWorkflowRunById(
    hostname: string,
    githubRepoSlug: string,
    runId: number,
  ): Promise<WorkflowRun> {
    return this.fetchFromBackend<WorkflowRun>('workflow-run', {
      hostname,
      githubRepoSlug,
      runId: String(runId),
    });
  }

  async downloadJobLogsForWorkflowRun(
    hostname: string,
    githubRepoSlug: string,
    jobId: number,
  ): Promise<string> {
    return this.fetchFromBackend<string>('download-logs', {
      hostname,
      githubRepoSlug,
      jobId: String(jobId),
    });
  }

  async getEnvironmentsList(
    hostname: string,
    githubRepoSlug: string,
  ): Promise<EnvironmentsResponse> {
    return this.fetchFromBackend<EnvironmentsResponse>('environments', {
      hostname,
      githubRepoSlug,
    });
  }
}

const githubWorkflowsApiModule = createFrontendModule({
  pluginId: 'github-workflows',
  extensions: [
    ApiBlueprint.make({
      params: defineParams =>
        defineParams({
          api: githubWorkflowsApiRef,
          deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
          factory: ({ discoveryApi, fetchApi }) =>
            new GithubWorkflowsApiClient(discoveryApi, fetchApi),
        }),
    }),
  ],
});

export default githubWorkflowsApiModule;
