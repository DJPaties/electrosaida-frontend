// utils/register.ts
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  fullPhone: string
): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone: fullPhone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Registration failed:", errorData.message || response.statusText);
      alert(`Registration failed: ${errorData.message || "Unknown error"}`);
      return;
    }

    const data = await response.json();
    console.log("Registered successfully:", data);
    alert("Registration successful! You can now log in.");
    // router.push("/login"); // optional redirect logic
  } catch (error) {
    console.error("Network error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
};
