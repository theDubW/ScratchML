import React from 'react';
import TaskList from '../components/TaskList';
import Map from '../components/map';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <Route exact path="/">
        <div className='flex flex-row p-5'>
            <TaskList className='h-full'/>
            <Map className=''/>
        </div>
        </Route>
    )
};

export default LandingPage
