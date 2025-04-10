// src/lib/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: `'Noto Sans', sans-serif`,
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0f0f0f",
      paper: "#121212",
    },
    primary: {
      main: "#00FFBF",
    },
    secondary: {
      main: "#FF4C29",
    },
    text: {
      primary: "#EAEAEA",
      secondary: "#A0A0A0",
    },
  },
});

export default theme;
