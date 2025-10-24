// Mock auth for MVP - Real authentication coming in next update
export async function auth() {
  // Return a mock session for development
  return {
    user: {
      id: "demo-user-1",
      name: "Demo User",
      email: "demo@example.com",
      householdId: "demo-household-1",
      role: "admin",
    },
  };
}

export const signIn = async () => {
  console.log("Sign in - Coming in next update");
};

export const signOut = async () => {
  console.log("Sign out - Coming in next update");
};

export const handlers = {
  GET: async () => Response.json({ message: "Auth coming soon" }, { status: 501 }),
  POST: async () => Response.json({ message: "Auth coming soon" }, { status: 501 }),
};
