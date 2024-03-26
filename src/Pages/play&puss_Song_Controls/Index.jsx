import React, { useEffect, useRef, useState } from 'react';
import './controls.scss'; // Make sure to import your SCSS file

const CardProfile = () => {
  const [index, setIndex] = useState(3);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [pause, setPause] = useState(false);
  const playerRef = useRef(null);
  const timelineRef = useRef(null);
  const playheadRef = useRef(null);
  const hoverPlayheadRef = useRef(null);

  const musicList = [
    { name: 'Nice piano and ukulele', author: 'Royalty', img: 'https://www.bensound.com/bensound-img/buddy.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-buddy.mp3', duration: '2:02' },
    { name: 'Gentle acoustic', author: 'Acoustic', img: 'https://www.bensound.com/bensound-img/sunny.jpg', audio: 'https://www.bensound.com//bensound-music/bensound-sunny.mp3', duration: '2:20' },
    { name: 'Corporate motivational', author: 'Corporate', img: 'https://www.bensound.com/bensound-img/energy.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-energy.mp3', duration: '2:59' },
    { name: 'Slow cinematic', author: 'Royalty', img: 'https://www.bensound.com/bensound-img/slowmotion.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3', duration: '3:26' },
    { name: 'Nice piano and ukulele', author: 'Royalty', img: 'https://www.bensound.com/bensound-img/buddy.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-buddy.mp3', duration: '2:02' },
    { name: 'Gentle acoustic', author: 'Acoustic', img: 'https://www.bensound.com/bensound-img/sunny.jpg', audio: 'https://www.bensound.com//bensound-music/bensound-sunny.mp3', duration: '2:20' },
    { name: 'Corporate motivational', author: 'Corporate', img: 'https://www.bensound.com/bensound-img/energy.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-energy.mp3', duration: '2:59' },
    { name: 'Slow cinematic', author: 'Royalty', img: 'https://www.bensound.com/bensound-img/slowmotion.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3', duration: '3:26' },
    { name: 'Nice piano and ukulele', author: 'Royalty', img: 'https://www.bensound.com/bensound-img/buddy.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-buddy.mp3', duration: '2:02' },
    { name: 'Gentle acoustic', author: 'Acoustic', img: 'https://www.bensound.com/bensound-img/sunny.jpg', audio: 'https://www.bensound.com//bensound-music/bensound-sunny.mp3', duration: '2:20' },
    { name: 'Corporate motivational', author: 'Corporate', img: 'https://www.bensound.com/bensound-img/energy.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-energy.mp3', duration: '2:59' },
    { name: 'Slow cinematic', author: 'Royalty', img: 'https://www.bensound.com/bensound-img/slowmotion.jpg', audio: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3', duration: '3:26' },
  ];

  const formatTime = (currentTime) => {
    const minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);

    seconds = (seconds >= 10) ? seconds : "0" + seconds % 60;

    const formattedTime = minutes + ":" + seconds;

    return formattedTime;
  };

  const updatePlayer = () => {
    const currentSong = musicList[index];
    const audio = new Audio(currentSong.audio);
    playerRef.current.load();
  };

  const changeCurrentTime = (e) => {
    const duration = playerRef.current.duration;
    const playheadWidth = timelineRef.current.offsetWidth;
    const offsetWidth = timelineRef.current.offsetLeft;
    const userClickWidth = e.clientX - offsetWidth;
    const userClickWidthInPercent = (userClickWidth * 100) / playheadWidth;

    playheadRef.current.style.width = userClickWidthInPercent + "%";
    playerRef.current.currentTime = (duration * userClickWidthInPercent) / 100;
  };

  const hoverTimeLine = (e) => {
    const duration = playerRef.current.duration;
    const playheadWidth = timelineRef.current.offsetWidth;
    const offsetWidth = timelineRef.current.offsetLeft;
    const userClickWidth = e.clientX - offsetWidth;
    const userClickWidthInPercent = (userClickWidth * 100) / playheadWidth;

    if (userClickWidthInPercent <= 100) {
      hoverPlayheadRef.current.style.width = userClickWidthInPercent + "%";
    }

    const time = (duration * userClickWidthInPercent) / 100;

    if ((time >= 0) && (time <= duration)) {
      hoverPlayheadRef.current.dataset.content = formatTime(time);
    }
  };

  const resetTimeLine = () => {
    hoverPlayheadRef.current.style.width = 0;
  };

  const timeUpdate = () => {
    const duration = playerRef.current.duration;
    const timelineWidth = timelineRef.current.offsetWidth - playheadRef.current.offsetWidth;
    const playPercent = 100 * (playerRef.current.currentTime / duration);
    playheadRef.current.style.width = playPercent + "%";
    const formattedTime = formatTime(parseInt(playerRef.current.currentTime));
    setCurrentTime(formattedTime);
  };

  const nextSong = () => {
    setIndex((prevIndex) => (prevIndex + 1) % musicList.length);
    updatePlayer();
    if (pause) {
      playerRef.current.play();
    }
  };

  const prevSong = () => {
    setIndex((prevIndex) => (prevIndex + musicList.length - 1) % musicList.length);
    updatePlayer();
    if (pause) {
      playerRef.current.play();
    }
  };

  const playOrPause = () => {
    const currentSong = musicList[index];
    const audio = new Audio(currentSong.audio);
    if (!pause) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
    setPause((prevPause) => !prevPause);
  };

  const clickAudio = (key) => {
    setIndex(key);
    updatePlayer();
    if (pause) {
      playerRef.current.play();
    }
  };

  useEffect(() => {
    playerRef.current.addEventListener("timeupdate", timeUpdate, false);
    playerRef.current.addEventListener("ended", nextSong, false);
    timelineRef.current.addEventListener("click", changeCurrentTime, false);
    timelineRef.current.addEventListener("mousemove", hoverTimeLine, false);
    timelineRef.current.addEventListener("mouseout", resetTimeLine, false);

    return () => {
      playerRef.current.removeEventListener("timeupdate", timeUpdate);
      playerRef.current.removeEventListener("ended", nextSong);
      timelineRef.current.removeEventListener("click", changeCurrentTime);
      timelineRef.current.removeEventListener("mousemove", hoverTimeLine);
      timelineRef.current.removeEventListener("mouseout", resetTimeLine);
    };
  }, [index, pause]);

  return (
    <div className="card">
      <div className="current-song">
        <audio ref={playerRef}>
          <source src={musicList[index].audio} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
        <div className="img-wrap">
          <img src={musicList[index].img} alt="Album Cover" />
        </div>
        <span className="song-name">{musicList[index].name}</span>
        <span className="song-autor">{musicList[index].author}</span>

        <div className="time">
          <div className="current-time">{currentTime}</div>
          <div className="end-time">{musicList[index].duration}</div>
        </div>

        <div ref={timelineRef} id="timeline">
          <div ref={playheadRef} id="playhead"></div>
          <div ref={hoverPlayheadRef} className="hover-playhead" data-content="0:00"></div>
        </div>

        <div className="controls">
          <button onClick={prevSong} className="prev prev-next current-btn">
            <i className="fas fa-backward"></i>
          </button>

          <button onClick={playOrPause} className="play current-btn">
            {!pause ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i>}
          </button>

          <button onClick={nextSong} className="next prev-next current-btn">
            <i className="fas fa-forward"></i>
          </button>
        </div>
      </div>

      <div className="play-list">
        {musicList.map((music, key) => (
          <div
            key={key}
            onClick={() => clickAudio(key)}
            className={`track ${index === key && !pause ? 'current-audio' : ''} ${index === key && pause ? 'play-now' : ''}`}
          >
            <img className="track-img" src={music.img} alt="Track Cover" />
            <div className="track-discr">
              <span className="track-name">{music.name}</span>
              <span className="track-author">{music.author}</span>
            </div>
            <span className="track-duration">{index === key ? currentTime : music.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProfile;
