import React from 'react';
import PirateShip from '../pirate ship.jpg'
import Island from '../island.png'
import Waves from '../waves.jpg'
import {Route, Link, Routes} from 'react-router-dom';
import lessonOne from '../views/lesson_one';


const map = () => {
    return (
        <div className='basis-5/6 border-2 border-black rounded h-screen m-2 bg-sky-500 hover:bg-sky-700 relative'>
            {/* <img src={Waves} alt={"waves"} className="absolute size-full" /> */}
            <Link to="/lessonOne">
        <img src={Island} alt={"island"} className="absolute size-20 bottom-44 left-40"/>
        </Link>
        <img src={Island} alt={"island"} className="absolute size-20 bottom-20 right-20"/>
        <img src={Island} alt={"island"} className="absolute size-20 top-36 right-96"/>
        <img src={PirateShip} alt={"pirateship"} className="absolute size-20 bottom-40 left-44 hover:size-24"/>
        <Routes>
        <Route path='/lessonOne' Component={lessonOne}/>
        </Routes>
        </div>
    )
};

export default map