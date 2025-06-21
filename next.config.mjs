import { createCivicAuthPlugin } from "@civic/auth/nextjs"

const nextConfig = {
  /* config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "990f2c44-755c-4fac-ae3b-b29b9c1327da",
  loginSuccessUrl: "/onboarding/role",
});

export default withCivicAuth(nextConfig);

