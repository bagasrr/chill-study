// file: komponen/MediaPlayer/VideoPlayer.tsx

"use client";

import YouTube, { YouTubeProps } from "react-youtube";

// 1. Definisikan tipe untuk props, tambahkan onPlay
interface VideoPlayerProps {
  videoId: string;
  onPlay: () => void; // Fungsi yang akan dipanggil saat video mulai diputar
  onEnd: () => void; // Fungsi yang akan dipanggil saat video selesai
}

const VideoPlayer = ({ videoId, onPlay, onEnd }: VideoPlayerProps) => {
  // 2. Opsi untuk player YouTube
  const opts: YouTubeProps["opts"] = {
    height: "400", // Anda bisa sesuaikan ukurannya
    width: "100%",
    playerVars: {
      autoplay: 0, // Jangan autoplay
      modestbranding: 1, // Sembunyikan logo YouTube yang terlalu besar
      rel: 0, // Jangan tampilkan video terkait di akhir
    },
  };

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onEnd={onEnd}
      onPlay={onPlay} // 3. Teruskan fungsi onPlay ke komponen YouTube
      className="aspect-video w-full"
    />
  );
};

export default VideoPlayer;
