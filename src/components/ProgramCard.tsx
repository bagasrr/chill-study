"use client";

import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";

interface ProgramCardProps {
  thumbnail: string;
  title: string;
  deskripsi: string;
  buttonText?: string;
  onClick?: () => void;
}

const ProgramCard = ({ thumbnail, title, deskripsi, buttonText = "Learn More", onClick }: ProgramCardProps) => {
  return (
    <Card sx={{ display: "flex", width: "100%", maxWidth: 900, height: 300, flexDirection: { xs: "column", lg: "row" }, boxShadow: 4 }}>
      <CardMedia
        component="img"
        image={thumbnail}
        alt={title}
        sx={{
          width: { xs: "100%", lg: 300 },
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
          <Button size="small" color="primary" onClick={onClick}>
            {buttonText}
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
