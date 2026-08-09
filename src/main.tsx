import React from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import './style.css';
import './past-game.css';
import './pronouns-race.css';
import './zombie-art.css';
import './past-arena.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
