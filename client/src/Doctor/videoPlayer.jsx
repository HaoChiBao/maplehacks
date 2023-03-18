import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ user }) => {

  
    const ref = useRef();
    
  
    useEffect(() => {
      user.videoTrack.play(ref.current);
    });
    
    return (
      <div>
        <div className = 'username'>
          {user.uid}
        </div>
        <div
          ref={ref}
        style={{ 
            width: '45vw', 
            height: '30vw', 
            position:'absolute', 
            opacity:'1' }}
        >
        </div>
      </div>
    );
  };
  