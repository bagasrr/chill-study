import YouTube from "react-youtube";

const VideoPlayer = ({ videoId, onEnd }: { videoId: string; onEnd: () => void }) => {
  console.log("Video Id : ", videoId);
  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return <YouTube videoId={videoId} opts={opts} onEnd={onEnd} />;
};

export default VideoPlayer;
