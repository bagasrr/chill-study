import axios from "axios";

export const saveProgress = async (materiId: string) => {
  return axios.post("/api/progress", { materiId });
};

export const completeProgress = async (materiId: string) => {
  return axios.post("/api/progress/complete", { materiId });
};
