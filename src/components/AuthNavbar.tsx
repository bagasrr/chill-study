"use client";

import { useSession, signOut } from "next-auth/react";
import { Button, Avatar, Stack, Typography, Skeleton } from "@mui/material";
import Link from "next/link";

export default function AuthNavbar() {
  const { data: session, status } = useSession();
  if (status === "loading") return <Skeleton variant="rounded" width={200} height={40} animation="wave" />;

  if (status === "unauthenticated")
    return (
      <Link href="/login">
        <Button variant="outlined" color="primary">
          Login
        </Button>
      </Link>
    );

  console.log(session);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {session && (
        <>
          <Avatar alt={session.user?.name || ""} src={session.user?.image || ""} />
          <Typography>{session.user?.name}</Typography>
          <Button variant="outlined" color="primary" onClick={() => signOut()}>
            Logout
          </Button>
        </>
      )}
    </Stack>
  );
}
