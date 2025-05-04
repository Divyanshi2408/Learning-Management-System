import React, { useRef, useState } from "react";

const VideoPlayer = ({ src, title }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    videoRef.current.playbackRate = newSpeed;
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="w-full max-w-lg bg-gray-900 p-4 rounded-lg shadow-lg text-white">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="relative">
        <video ref={videoRef} src={src} className="w-full h-60 rounded-lg" controls />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-3">
        <button onClick={togglePlay} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
          {playing ? "Pause" : "Play"}
        </button>

        <label className="text-sm">
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="ml-2"
          />
        </label>

        <label className="text-sm">
          Speed:
          <select value={speed} onChange={handleSpeedChange} className="ml-2 px-2 py-1 bg-gray-700">
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </label>

        <button onClick={handleFullscreen} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
          Fullscreen
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
