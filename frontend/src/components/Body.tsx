import React, { ReactNode, useEffect, useState } from 'react';

interface IBodyProps {
  children?: ReactNode | ReactNode[] | any;
}

function Body({
  children,
}: IBodyProps) {
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
      <main className='bg-[#FAFAFA] flex items-center justify-center' style={{ height: height }}>
        {children}
      </main>
    );
  }
}

export {Body};