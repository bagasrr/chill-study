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

  return (
    <div className="flex flex-col gap-4 items-center lg:flex-row">
      {session && (
        <>
          <Link href="/profile">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar alt={session.user?.name || ""} src={session.user?.image || ""} />
              <Typography>{session.user?.name}</Typography>
            </Stack>
          </Link>
          <Button variant="outlined" color="primary" onClick={() => fetch("/api/auth/logout", { method: "GET" }).then(() => signOut({ redirect: true, callbackUrl: "/" }))}>
            Logout
          </Button>
        </>
      )}
    </div>
  );
}
