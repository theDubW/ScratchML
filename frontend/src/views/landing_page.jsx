import React from 'react';
import TaskList from '../components/TaskList';
import Map from '../components/map';

const LandingPage = () => {
    return (
        <div className='flex flex-row p-2'>
            <TaskList className='h-full'/>
            <Map className=''/>
        </div>
    )
};

export default LandingPage
