"use client";
import { Button, Typography } from "@mui/material";
// import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import Image from "next/image";

const ButtonLogin = () => {
  return (
    <Button variant="outlined" color="info" onClick={() => signIn("google")} aria-label={"Button Login with Google"}>
      <Image src={"https://www.svgrepo.com/show/475656/google-color.svg"} alt="Google Logo" width={24} height={24} />
      <Typography variant="button" className="pl-2">
        Sign in with Google
      </Typography>
    </Button>
  );
};

export default ButtonLogin;
