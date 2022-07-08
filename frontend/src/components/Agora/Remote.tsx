import React, { useEffect, useState } from 'react';
import { IAgoraRTCRemoteUser, AgoraVideoPlayer } from 'agora-rtc-react';

interface IRemotesProps {
  remotes: IAgoraRTCRemoteUser[];
}

function Remotes({ remotes }: IRemotesProps) {
  const [max, setMax] = useState(document.getElementById('remotes')?.offsetHeight);

  useEffect(() => {
    if(!max) {
      setMax(document.getElementById('remotes')?.offsetHeight)
    }
  }, [max])

  return(
    <div id='remotes' className='flex flex-col w-64 mb-20 bg-black-meet ml-auto p-2 rounded box-border shadow-lg'>
      {remotes.length > 0 &&
        remotes.map((user, index) => {
          if (max && user.videoTrack && index < Math.floor(max/(130 + 16))) {
            return (
              <AgoraVideoPlayer style={{height: 130, width: '100%', minHeight: 130}} className='rounded mb-2' videoTrack={user.videoTrack} key={user.uid} />
            );
          } else return null;
      })}
      {max && remotes.length < max/130 && Array.apply(0, new Array(Math.floor(max/(130 + 16) - remotes.length))).map((_, i) => {
        return <div style={{height: 130, width: '100%', minHeight: 130}} className='bg-black-light mb-2' key={i}/>
      })}

      <div style={{height: max && 130 - ((max - Math.floor(max/(130 + 16) - remotes.length)*130) - 130), width: '100%'}} className='bg-black-light mb-2'/>
    </div>
  );
}

export {Remotes};