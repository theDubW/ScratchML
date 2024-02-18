import React from 'react';
import PirateShip from '../pirate ship.png'
import Island from '../island.png'
import Waves from '../waves.webp'
import {Link} from 'react-router-dom';
import TaskList from '../components/TaskList';
import Wave from '../wave.png';

const map = () => {
    return (
        <div className='border-2 border-black rounded h-screen  mr-10 bg-sky-500 w-full flex'>
            <TaskList className=""/>
            <img src={Wave} alt="wave" className="absolute size-20 left-40 top-40" />
            <img src={Wave} alt="wave" className="absolute size-20 left-44 top-44" />

            {/* <img src={Waves} alt={"waves"} className="absolute left-0 top-0 size-full z-0" /> */}
            <Link to="/lessonOne">
                <img src={Island} alt={"island"} className="absolute size-32 bottom-44 left-40 bg-transparent"/>
                <img src={Wave} alt="wave" className="absolute size-20 left-80 bottom-60" />

            </Link>
            <Link>
            <img src={Island} alt={"island"} className="absolute size-32 bottom-36 right-40 bg-transparent"/>
            <img src={Wave} alt="wave" className="absolute size-20 right-96 bottom-32" />

            </Link>
            <Link>
            <img src={Island} alt={"island"} className="absolute size-32 top-36 right-96 bg-transparent"/>
            </Link>
            <img src={PirateShip} alt={"pirateship"} className="absolute size-24 bottom-40 left-56 bg-transparent"/>
        </div>
    )
};

export default map