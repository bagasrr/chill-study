"use client";
import { Button, Typography } from "@mui/material";
// import GoogleIcon from "@mui/icons-material/Google";
// import { signIn } from "next-auth/react";
import Image from "next/image";

// const ButtonLogin = () => {
//   return (
//     <Button variant="outlined" color="info" onClick={() => signIn("google")} aria-label={"Button Login with Google"}>
//       <Image src={"https://www.svgrepo.com/show/475656/google-color.svg"} alt="Google Logo" width={24} height={24} />
//       <Typography variant="button" className="pl-2">
//         Sign in with Google
//       </Typography>
//     </Button>
//   );
// };

// export default ButtonLogin;

import { signIn } from "next-auth/react";
import { toastError } from "@/lib/toastUtils";

export default function ButtonLogin() {
  const handleLogin = async () => {
    const res = await signIn("google", {
      redirect: false, // ⬅️ biar gak redirect otomatis
      callbackUrl: "/", // ⬅️ redirect manual kalau sukses
    });

    if (res?.error) {
      toastError(res.error); // ⬅️ langsung tampilin error dari backend
    } else if (res?.ok && res.url) {
      window.location.href = res.url; // ⬅️ redirect manual kalau sukses
    }
  };

  return (
    <Button variant="outlined" color="info" onClick={handleLogin} aria-label={"Button Login with Google"}>
      <Image src={"https://www.svgrepo.com/show/475656/google-color.svg"} alt="Google Logo" width={24} height={24} />
      <Typography variant="button" className="pl-2">
        Sign in with Google
      </Typography>
    </Button>
  );
}
