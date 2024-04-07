import React from 'react';
import "./PortalGamesDashboard.css"
import AssideGamer from './GAMER-components/AssideGamer';

function PortalGamerDashboard() {

  return (
    <div id='portal-gamer-dashboard' className="bg-zinc-500 w-full h-[100vh] flex justify-center items-center border-[10px] border-[#7300F4]">
      <AssideGamer />
    </div>
  );
}

export default PortalGamerDashboard;