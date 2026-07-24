import UserTypeSelector from "@/components/onboarding/UserTypeSelector";

export default function Onboarding() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">

        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4">
            Welcome Home 👋
          </h1>

          <p className="text-gray-600 text-lg">
            Before we begin, we'd love to get to know you.
          </p>

          <p className="mt-2 text-xl font-medium">
            How would you like to use BAYTNA today?
          </p>
        </div>

        <UserTypeSelector />

      </div>
    </main>
  );
}