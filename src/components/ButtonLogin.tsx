import { Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

const ButtonLogin = () => {
  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => signIn("google")} aria-label={"Button Login with Google"}>
        <GoogleIcon />
        <Typography variant="button" className="pl-2">
          Sign in with Google
        </Typography>
      </Button>
    </>
  );
};

export default ButtonLogin;
