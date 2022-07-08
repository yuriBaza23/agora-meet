import React from 'react';
import { ImPhoneHangUp } from 'react-icons/im';
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from 'react-icons/fi';

interface IControlsProps {
  mute: (type: 'audio' | 'video') => void;
  leaveChannel: () =>  void;
  trackState: { audio: boolean, video: boolean }
}

function Controls({
  mute,
  leaveChannel,
  trackState
}: IControlsProps) {
  return(
    <div className='flex w-full h-full min-h-full bg-white items-center justify-center rounded shadow-lg'>
      <div className='w-72 flex justify-between'>
        <button onClick={() => mute('audio')} className='p-4 bg-gray-meet rounded-full transition-all duration-300 hover:opacity-75'>{
          trackState.audio ? 
          <FiMic/> : <FiMicOff/>
        }</button>
        <button onClick={leaveChannel} className='p-4 bg-red-meet rounded-full transition-all duration-300 hover:opacity-75'>
          <ImPhoneHangUp color='white'/>
        </button>
        <button onClick={() => mute('video')} className='p-4 bg-gray-meet rounded-full transition-all duration-300 hover:opacity-75'>{
          trackState.video ? 
          <FiVideo/> : <FiVideoOff/>
        }</button>
      </div>
    </div>
  );
}

export {Controls};