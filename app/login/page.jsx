import { UserButton } from "@civic/auth/react";

export default function LoginPage () {
  return (
  <>
      <div className="h-screen flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold mb-4">Login to Grasp</h1>
        <UserButton />
      </div>
  </>
  )
}
