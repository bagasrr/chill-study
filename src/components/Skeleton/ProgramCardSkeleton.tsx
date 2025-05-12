"use client";

import { Card, CardContent, CardMedia, Skeleton, Box, CardActions, Button } from "@mui/material";

const ProgramCardSkeleton = () => {
  return (
    <Card
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: 500,
        height: 300,
        flexDirection: { xs: "column", lg: "row" },
        boxShadow: 4,
      }}
    >
      <Skeleton variant="rectangular" width={{ xs: "100%", lg: 200 }} height={300} sx={{ display: { xs: "block", lg: "none" } }} />
      <CardMedia
        sx={{
          display: { xs: "none", lg: "block" },
          width: 200,
          height: 300,
          backgroundColor: "#e0e0e0",
        }}
      />
      <Box sx={{ flex: "1 1 auto", p: 2 }}>
        <CardContent>
          <Skeleton variant="text" height={40} width="80%" />
          <Skeleton variant="text" height={20} width="100%" />
          <Skeleton variant="text" height={20} width="95%" />
          <Skeleton variant="text" height={20} width="90%" />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width={100} height={36} />
        </CardActions>
      </Box>
    </Card>
  );
};

export default ProgramCardSkeleton;
