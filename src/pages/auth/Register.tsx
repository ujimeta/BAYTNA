import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <RegisterForm />
      </div>
    </div>
  );
}