import Head from "next/head";
import Image from "next/image";

export default function LoginFOrm() {
  const handleGoogleLogin = () => {
    console.log("Login with Google clicked!");
  };

  return (
    <>
      <Head>
        <title>Login | Just a Chill Study</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 transition-all duration-300">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Login with your Google account to continue</p>
          </div>
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:shadow-md transition duration-200 dark:bg-gray-700 dark:border-gray-600">
            <Image src={"https://www.svgrepo.com/show/475656/google-color.svg"} alt="Google Logo" width={24} height={24} />
            <span className="text-sm font-medium text-gray-700 dark:text-white">Continue with Google</span>
          </button>
        </div>
      </div>
    </>
  );
}
