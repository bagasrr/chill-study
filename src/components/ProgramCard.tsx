"use client";

import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import Link from "next/link";

interface ProgramCardProps {
  thumbnail: string;
  title: string;
  deskripsi: string;
  buttonText?: string;
  onClick?: () => void;
  link: string;
}

const ProgramCard = ({ thumbnail, title, deskripsi, buttonText = "Learn More", onClick, link = "" }: ProgramCardProps) => {
  return (
    <Card sx={{ display: "flex", width: "100%", maxWidth: 500, height: 300, flexDirection: { xs: "column", lg: "row" }, boxShadow: 4 }}>
      <CardMedia
        component="img"
        image={thumbnail}
        alt={title}
        sx={{
          width: { xs: "100%", lg: 200 },
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ flex: "1 1 auto" }}>
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="max-h-[100px] overflow-auto ">
              {deskripsi}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link href={link}>
            <Button size="small" color="primary">
              {buttonText}
            </Button>
          </Link>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
