import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';
import './styles/bootstrap.css';
import './styles/font-awesome.css';
import './styles/index.css';
import Login from './scripts/Login';

ReactDOM.render((
	<BrowserRouter>
		<Login />
  	</BrowserRouter>
), document.getElementById('root'));
