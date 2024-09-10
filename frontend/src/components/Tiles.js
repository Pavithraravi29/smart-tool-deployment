import React from 'react';
import BatteryIcon from './BatteryIcon';
import PacketError from './PacketError';
import SignalIcon from './Signal';
import Temp from './Temp';

const tiles = () => {

return (
<div className="grid grid-cols-2 md:grid-cols-2 gap-2 rounded-lg">

    <div>
        <BatteryIcon />
    </div>
    <div>
        <SignalIcon />
    </div>
    <div>
        <Temp/>
    </div>
    <div>
        <PacketError />
    </div>
    
</div>
);
}
export default tiles;