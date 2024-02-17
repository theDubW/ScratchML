import React from 'react';
import PirateShip from '../pirate ship.png'
import Island from '../island.png'
import Waves from '../waves.webp'
import {Link} from 'react-router-dom';
import TaskList from '../components/TaskList';

const map = () => {
    return (
        <div className='border-2 border-black rounded h-screen m-2 bg-sky-500 hover:bg-sky-700 relative w-screen'>
            <TaskList className=""/>
            <img src={Waves} alt={"waves"} className="absolute left-0 top-0 size-full z-0" />
            <Link to="/lessonOne">
                <img src={Island} alt={"island"} className="absolute size-60 bottom-44 left-40 bg-transparent"/>
            </Link>
            <Link>
        <img src={Island} alt={"island"} className="absolute size-60 bottom-20 right-20 bg-transparent"/>
        </Link>
        <Link>
        <img src={Island} alt={"island"} className="absolute size-60 top-36 right-96 bg-transparent"/>
        </Link>
        <img src={PirateShip} alt={"pirateship"} className="absolute size-20 bottom-40 left-44 bg-transparent"/>
        </div>
    )
};

export default map