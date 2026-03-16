const API_BASE = "/api/v1";

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function postAPI<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function fetchRepos() {
  return fetchAPI<{ repositories: any[]; total: number }>("/repos");
}

export function analyzeRepo(repositoryUrl: string) {
  return postAPI<any>("/repos/analyze", { repository_url: repositoryUrl });
}

export function fetchRepoHealth(owner: string, name: string) {
  return fetchAPI<any>(`/repos/${owner}/${name}/health`);
}

export function fetchHealthHistory(owner: string, name: string) {
  return fetchAPI<any>(`/repos/${owner}/${name}/health/history`);
}

export function fetchCommitAnalytics(owner: string, name: string) {
  return fetchAPI<any>(`/repos/${owner}/${name}/commits`);
}

export function fetchContributorAnalytics(owner: string, name: string) {
  return fetchAPI<any>(`/repos/${owner}/${name}/contributors`);
}

export function fetchPRAnalytics(owner: string, name: string) {
  return fetchAPI<any>(`/repos/${owner}/${name}/pull-requests`);
}

export function fetchIssueAnalytics(owner: string, name: string) {
  return fetchAPI<any>(`/repos/${owner}/${name}/issues`);
}

export function fetchCICDAnalytics(owner: string, name: string) {
  return fetchAPI<any>(`/repos/${owner}/${name}/cicd`);
}

export function fetchRisks(owner: string, name: string) {
  return fetchAPI<any>(`/repos/${owner}/${name}/risks`);
}
