import React, { useState } from 'react'
import Sidebar from '../components/home/Sidebar';
import MsgContainer from '../components/home/MsgContainer';

const Home = () => {
  const [chatUserId, setChatUserId] = useState(null);

  const handleSelectUser = (userId) => {
    setChatUserId(userId);
  }

  const handleBack = () => {
    setChatUserId(null);
  }

  return (
    <div className='h-screen w-screen flex flex-row overflow-hidden'>

      {/* Sidebar */}
      <div className={`
        h-full flex-shrink-0
        w-full md:w-[320px] lg:w-[280px]
        ${chatUserId ? 'hidden md:block' : 'block'}
    `}>
        <Sidebar setChatUserId={handleSelectUser} chatUserId={chatUserId} />
      </div>

      {/* MsgContainer */}
      <div className={`
        h-full flex-1 min-w-0
        ${chatUserId ? 'block' : 'hidden md:block'}
    `}>
        <MsgContainer chatUserId={chatUserId} onBack={handleBack} />
      </div>

    </div>
  )
}

export default Home