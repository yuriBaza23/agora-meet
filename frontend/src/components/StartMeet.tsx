import { Column, Link } from 'angel_ui';
import React, { FormHTMLAttributes, ReactNode } from 'react';

interface IStartMeetProps extends FormHTMLAttributes<HTMLFormElement> {
  children?: ReactNode;
}

function StartMeet({
  children,
  ...rest
}: IStartMeetProps) {
  return(
    <Column>
      <form className='bg-white w-96 p-4 rounded drop-shadow-2xl text-sm' {...rest}>
        <Column horizontalAlign='start'>
          {children}
        </Column>
      </form>
      <div className='w-96 p-4 flex items-center justify-center !bg-[#FAFAFA]'>
        <span className='text-xs text-slate-400 bg-[#FAFAFA]'>Created by <Link href='https://github.com/yuriBaza23'>Yuri Baza</Link></span>
      </div>
    </Column>
  );
}

export {StartMeet};