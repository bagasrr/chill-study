// components/SwiperNavButton.tsx
import { IconButton } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { RefObject } from "react";

interface SwiperNavButtonProps {
  direction: "prev" | "next";
  buttonRef: RefObject<HTMLButtonElement>;
}

export default function SwiperNavButton({ direction, buttonRef }: SwiperNavButtonProps) {
  const isPrev = direction === "prev";

  return (
    <IconButton
      ref={buttonRef}
      sx={{
        border: "2px solid #1e293b",
        color: "#1e293b",
        backgroundColor: "#fff",
        "&:hover": {
          backgroundColor: "#f1f5f9",
        },
      }}
    >
      {isPrev ? <ArrowBackIosNew fontSize="small" /> : <ArrowForwardIos fontSize="small" />}
    </IconButton>
  );
}
