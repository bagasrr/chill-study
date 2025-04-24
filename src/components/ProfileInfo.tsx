"use client";

import { Avatar, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

const ProfileInfo = () => {
  const { data: session } = useSession();
  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar alt={session?.user?.name || ""} src={session?.user?.image || ""} />
        <Typography>{session?.user?.name}</Typography>
      </Stack>
    </div>
  );
};

export default ProfileInfo;
