const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP ${response.status}: ${response.statusText}` }))
      throw new Error(error.message || `API request failed with status ${response.status}`)
    }

    return response.json()
  } catch (error: any) {
    // If it's already an Error with a message, throw it
    if (error.message) {
      throw error
    }
    // Otherwise, wrap it
    throw new Error("Network error: Unable to connect to API")
  }
}
