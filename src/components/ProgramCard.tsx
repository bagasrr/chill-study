"use client";

import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";

interface ProgramCardProps {
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}

const ProgramCard = ({ image, title, description, buttonText = "Learn More", onClick }: ProgramCardProps) => {
  return (
    <Card sx={{ display: "flex", width: "100%", maxWidth: 900, height: 300, flexDirection: { xs: "column", lg: "row" }, boxShadow: 4 }}>
      <CardMedia
        component="img"
        image={image}
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
            <Typography variant="body2" color="text.secondary">
              {description}
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
