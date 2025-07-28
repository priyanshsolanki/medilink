import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from './../api/axiosInstance';
const VideoCallPage = () => {
  const { appointmentId } = useParams();
  const { search } = useLocation();
  const [roomInfo, setRoomInfo] = useState(null);

  const token = new URLSearchParams(search).get('token');

  useEffect(() => {
    if (!appointmentId) return;

    axiosInstance.get(`/video/${appointmentId}/token`)
      .then(res => {
        console.log(res.data)
        setRoomInfo(res.data)
        window.location.replace(`${process.env.REACT_APP_VIDEO_BASE_URL}/room/${res.data.roomName}?token=${res.data.token}`);
    }
    
    )
      .catch(err => console.error('Token error:', err));
  }, [token, appointmentId]);

  if (!roomInfo) return <p>Loading video session...</p>;

  return <></>;
};

export default VideoCallPage;
