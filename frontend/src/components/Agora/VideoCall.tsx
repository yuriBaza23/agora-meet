import { Body } from '../../components/Body'
import {   
  createClient,
  createMicrophoneAndCameraTracks,
  IAgoraRTCRemoteUser, 
  AgoraVideoPlayer} from 'agora-rtc-react';
import { useEffect, useState } from 'react';
import { Screen } from './Screen';
import { Clock } from './Clock';

export const useClient = createClient({ mode: "rtc", codec: "vp8" });
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCall = () => {
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  async function meetInit() {
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if(mediaType === 'video') {
        setUsers((prevUsers) => {
          return [...prevUsers, user];
        })
      }
      if(mediaType === 'audio') {
        user.audioTrack?.play();
      }
    })

    client.on('user-unpublished', async (user, type) => {
      if(type === 'video') {
        setUsers((prevUsers) => {
          return prevUsers.filter(u => u.uid !== user.uid);
        })
      }
      if(type === 'audio') {
        user.audioTrack?.stop();
      }
    })

    client.on('user-left', async (user) => {
      setUsers((prevUsers) => {
        return prevUsers.filter(u => u.uid !== user.uid);
      })
    })

    const channel = document.location.pathname.split('/')[2];
    const uid = document.location.pathname.split('/')[4];
    let token = document.location.pathname.split('/')[5];

    if(document.location.pathname.split('/')[6]) {
      document.location.pathname.split('/').map((part, index) => {
        if(index > 5) {
          token += `/${part}`;
        }
      })
    }
    const appId = process.env.NEXT_PUBLIC_APP_ID;

    if(!client.uid) {
      if(appId && 
        token && 
        channel && 
        uid
      ) {
        await client.join(
          appId, 
          channel, 
          token, 
          Number(uid)
        );
        if (tracks) await client.publish([tracks[0], tracks[1]]);
      }
    }

    console.log(users)
  }

  const mute = async (type: "audio" | "video") => {
    console.log(tracks && "okay")
    if (tracks && type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (tracks && type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        console.log({ ...ps, video: !ps.video })
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    if(tracks) {
      await client.unpublish([tracks[0], tracks[1]])
      await client.leave();
      client.removeAllListeners();
      // we close the tracks to perform cleanup
      tracks[0].close();
      tracks[1].close();
    }
  };

  useEffect(() => {
    if(ready && tracks) {
      meetInit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, tracks]);

  return (
    <Body>
      { ready && tracks && trackState.video && <AgoraVideoPlayer videoTrack={tracks[1]} className='w-screen' style={{ height: '100%' }}/> }
      { !trackState.video && <div className='w-screen bg-black-meet' style={{ height: '100%' }}/> }
      { ready && tracks && <Screen remotes={users} mute={mute} leaveChannel={leaveChannel} trackState={trackState}/>}
      <Clock/>
    </Body>
  )
}

export default VideoCall
