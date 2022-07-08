import React, { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import { ConfigModal } from '../Modals/Config';

interface IConfigProps {}

function Config({}: IConfigProps) {
  const [isOpen, setIsOpen] = useState(false);

  return(
    <>
      <button className='bg-white w-12 h-12 p-4 shadow-lg rounded'>
        <FiSettings/>
      </button>

      <ConfigModal isOpen={isOpen} onClose={() => setIsOpen(false)}/>
    </>
  );
}

export {Config};