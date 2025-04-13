import ButtonLogin from "@/components/ButtonLogin";
import Head from "next/head";
import Image from "next/image";

export default function LoginForm() {
  return (
    <>
      <Head>
        <title>Login | Just a Chill Study</title>
      </Head>
      <div className="w-2/5 bg-white dark:bg-gray-700 rounded shadow-lg transition-all duration-300 flex justify-evenly items-center px-5 py-14 text-black dark:text-white">
        <div className="flex flex-col items-center gap-6 ">
          <h1 className="text-2xl font-poppins font-semibold">Welcome</h1>
          <p className="font-roboto">Please sign in to continue</p>
          <ButtonLogin />
        </div>
        <div className="flex flex-col items-center gap-5 font-roboto">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h2>Chill Study</h2>
        </div>
      </div>
    </>
  );
}
