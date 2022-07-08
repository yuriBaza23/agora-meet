import React from 'react';

interface ILogoProps {}

function Logo({}: ILogoProps) {
  return(
    <div className='w-full text-2xl flex items-center justify-center mb-4 mt-4 font-bold'>
      <h1 className='text-[#124780]'>Agora - Meet</h1>
    </div>
  );
}

export {Logo};