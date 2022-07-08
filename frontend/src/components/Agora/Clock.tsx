import { differenceInSeconds } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';

interface IClockProps {}

function Clock({}: IClockProps) {
  const [channel, setChannel] = useState<string>();

  const [date, setDate] = useState<string>();
  const dateInit = new Date();
  
  function refreshClock() {
    let seconds = differenceInSeconds(new Date(), new Date(dateInit));
    let clock = new Date('2001-02-23T00:00:00.000Z');
    clock.setSeconds(seconds);
    setDate(clock.toISOString().substring(11, 19));
  }

  const getData = useCallback(() => {
    setChannel(document.location.pathname.split('/')[2]);
  }, [])

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getData();
  }, [getData])

  return(
    <div className='w-full absolute bottom-32 rounded h-8'>
      <div className='w-96 h-full flex ml-10 bg-black-meet rounded shadow-lg'>
        <div className='w-1/4 h-full flex bg-black-light items-center justify-center rounded-l'>
          <p className='text-xs text-white'>{date}</p>
        </div>
        <div className='h-full flex items-center pl-4'>
          <p className='text-xs text-white'>{channel}</p>
        </div>
      </div>
    </div>
  );
}

export {Clock};