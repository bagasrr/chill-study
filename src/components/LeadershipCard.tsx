import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { LeadershipCard } from "@/lib/type";

export default function ActionAreaCard({ image, name, role, responsibility }: LeadershipCard) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia component="img" sx={{ height: 400, objectFit: "cover" }} image={image} alt={name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {role}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {responsibility}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
