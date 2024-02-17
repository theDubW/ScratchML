import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';


function lessonOne() {
    return (
        <Route path="/lessonOne">
        <div className='h-screen w-screen'>
            Hello world
        </div>
        </Route>
    )
}

export default lessonOne