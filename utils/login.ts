// utils/register.ts
export const loginUser = async (
  email: string,
  password: string,
): Promise<Boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({
        email,
        password,

      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login failed:", errorData.message || response.statusText);
    //   alert(`login failed: ${errorData.message || "Unknown error"}`);
      return false;
    }

    const data = await response.json();
    console.log("Registered successfully:", data);
    // alert("Registration successful! You can now log in.");
    localStorage.setItem("access_token",data.access_token)
    return true;
    // router.push("/login"); // optional redirect logic
  } catch (error) {
    console.error("Network error:", error);
    alert("An unexpected error occurred. Please try again.");
    return false;
  }
};
