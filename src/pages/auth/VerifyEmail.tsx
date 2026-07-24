export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FBF9]">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-serif font-bold text-[#355E4B]">
          Verify Your Email
        </h1>

        <p className="mt-5 text-gray-600 leading-7">
          We've sent a verification email to your inbox.
        </p>

        <p className="mt-3 text-gray-500">
          Please verify your email before signing in.
        </p>
      </div>
    </div>
  );
}