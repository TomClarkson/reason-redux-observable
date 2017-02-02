// import './tutorial';
// import './understandSubscriptions';

import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Autocomplete from './Autocomplete';
import MovesUntilReleaseDrag from './MovesUntilReleaseDrag';
import MultipleClick from './MultipleClick';
import DragDrop from './DragDrop';
import PrototypeVerticalCalendar from './verticalCalendar/Root';


const RouterContainer = () => (
  <Router>
    <div>
      <ul style={{display: 'flex', listStyle: 'none', width: window.innerWidth, justifyContent: 'space-around'}}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dragdrop">Drag Drop</Link></li>
        <li><Link to="/autocomplete">Autocomplete</Link></li>
        <li><Link to="/movesuntilreleasedrag">Moves until release drag</Link></li>
        <li><Link to="/multipleclick">Multiple click</Link></li>
        <li><Link to="/verticalcalendar">Prototype Vertical Calendar</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/dragdrop" component={DragDrop}/>
      <Route path="/autocomplete" component={Autocomplete}/>
      <Route path="/movesuntilreleasedrag" component={MovesUntilReleaseDrag}/>
      <Route path="/multipleclick" component={MultipleClick}/>
      <Route path="/verticalcalendar" component={PrototypeVerticalCalendar}/>
    </div>
  </Router>
)

const Home = () => (
  <div>
    <h2>Welcome to the RXJS demos.</h2>
    <p>whatIsEpic.js Shows subjects and epics as just a function</p>
    <p>tutorial.js Shows the Ping example</p>

  </div>
)

render(<RouterContainer />, document.querySelector('#root'));