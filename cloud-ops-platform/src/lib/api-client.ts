export async function apiCall<T>(
  endpoint: string,
  credentials: string,
  extraBody: Record<string, unknown> = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentials, ...extraBody }),
  });
  return response.json();
}

export async function apiPut<T>(
  endpoint: string,
  credentials: string,
  extraBody: Record<string, unknown> = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentials, ...extraBody }),
  });
  return response.json();
}
