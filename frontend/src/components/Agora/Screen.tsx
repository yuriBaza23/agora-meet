import React, { useEffect, useState } from 'react';
import { Remotes } from './Remote';
import { IAgoraRTCRemoteUser } from 'agora-rtc-react';
import { Config } from './Config';
import { Controls } from './Controls';

interface IScreenProps {
  remotes: IAgoraRTCRemoteUser[];
  mute: (type: 'audio' | 'video') => void;
  leaveChannel: () =>  void;
  trackState: { audio: boolean, video: boolean }
}

function Screen({ remotes, mute, leaveChannel, trackState }: IScreenProps) {
  // tailwind error (h-screen) at ^3.0.24
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if(typeof window !== "undefined") {
      setHeight(window.innerHeight);  
    }
  }, []);

  if(height === 0) {
    return <div/>;
  } else  {
    return(
      <main className='flex flex-col w-full p-10 absolute' style={{ height: height }}>
        <div className='flex w-full' style={{ height: height - 160 }}>
          <Config/>
          <Remotes remotes={remotes}/>
        </div>
        <div className='flex w-full' style={{ height: 80 }}>
          <Controls mute={mute} leaveChannel={leaveChannel} trackState={trackState}/>
        </div>
      </main>
    );
  }
}

export {Screen};