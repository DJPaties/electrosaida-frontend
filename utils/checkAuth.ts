"use client";

export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "POST", 
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}
