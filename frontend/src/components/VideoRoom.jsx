// VideoRoom.jsx
import React, { useEffect, useState, useRef } from 'react';
import { connect, createLocalVideoTrack } from 'twilio-video';

const VideoRoom = ({ roomName, token }) => {
  const [room, setRoom] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const joinRoom = async () => {
      const videoTrack = await createLocalVideoTrack();

      connect(token, {
        name: roomName,
        tracks: [videoTrack],
      }).then(room => {
        setRoom(room);

        // Local video
        const localTrack = Array.from(room.localParticipant.videoTracks.values())[0].track;
        localVideoRef.current.appendChild(localTrack.attach());

        // Remote participant
        room.on('participantConnected', participant => {
          participant.on('trackSubscribed', track => {
            remoteVideoRef.current.appendChild(track.attach());
          });
        });

        room.on('participantDisconnected', () => {
          remoteVideoRef.current.innerHTML = '';
        });
      });
    };

    joinRoom();
    return () => room && room.disconnect();
  }, [token, roomName]);

  const toggleMic = () => {
    room.localParticipant.audioTracks.forEach(publication => {
      micOn ? publication.track.disable() : publication.track.enable();
    });
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    room.localParticipant.videoTracks.forEach(publication => {
      camOn ? publication.track.disable() : publication.track.enable();
    });
    setCamOn(!camOn);
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      const stream = await navigator.mediaDevices.getDisplayMedia();
      const screenTrack = stream.getTracks()[0];

      room.localParticipant.unpublish(Array.from(room.localParticipant.videoTracks.values())[0].track);
      room.localParticipant.publishTrack(screenTrack);
      setScreenSharing(true);
    } else {
      const videoTrack = await createLocalVideoTrack();
      room.localParticipant.unpublish(Array.from(room.localParticipant.videoTracks.values())[0].track);
      room.localParticipant.publishTrack(videoTrack);
      setScreenSharing(false);
    }
  };

  const leaveRoom = () => {
    room.disconnect();
    setRoom(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div ref={localVideoRef} className="w-1/2" />
        <div ref={remoteVideoRef} className="w-1/2" />
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button onClick={toggleMic}>{micOn ? 'Mute' : 'Unmute'}</button>
        <button onClick={toggleCam}>{camOn ? 'Stop Cam' : 'Start Cam'}</button>
        <button onClick={toggleScreenShare}>{screenSharing ? 'Stop Share' : 'Share Screen'}</button>
        <button onClick={leaveRoom} className="text-red-600">Leave</button>
      </div>
    </div>
  );
};

export default VideoRoom;
