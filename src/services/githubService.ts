// 1. Wir definieren genau, welche Daten wir von GitHub erwarten (TypeScript-Liebe!)
export interface GitHubRepoInfo {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  language: string | null;
  url: string;
  updatedAt: string;
  ownerAvatar: string;
}

// 2. Die Funktion, die die Daten von GitHub holt
export async function fetchRepoInfo(owner: string, repo: string): Promise<GitHubRepoInfo | null> {
  try {
    // Wir nutzen das native fetch() von Node.js
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

    // Wenn der Status 404 ist, gibt es das Repo nicht
    if (response.status === 404) {
      return null; 
    }

    // Wenn etwas anderes schiefgeht (z.B. Rate Limit)
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    // JSON-Daten auslesen
    const data = await response.json();

    // Wir mappen das riesige GitHub-JSON auf unser sauberes Interface
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      language: data.language,
      url: data.html_url,
      updatedAt: data.updated_at,
      ownerAvatar: data.owner.avatar_url,
    };
  } catch (error) {
    console.error("Fehler beim Abrufen der GitHub-Daten:", error);
    throw error;
  }
}