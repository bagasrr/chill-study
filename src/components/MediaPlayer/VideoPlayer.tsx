import YouTube from "react-youtube";

const VideoPlayer = ({ videoId }: { videoId: string }) => {
  console.log("Video Id : ", videoId);
  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return <YouTube videoId={videoId} opts={opts} />;
};

export default VideoPlayer;
