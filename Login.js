import React, { Component } from 'react';
import {Alert} from 'react-bootstrap';
import App from './App';
import Dispatcher from './Dispatcher';

class Login extends Component {
	constructor(props){
		super(props);
		this.login = this.login.bind(this);
		this.state = {loggedUser:2, errorMsg:""};
	}

	login(e){
		e.preventDefault();

		let username = document.getElementById("username").value;
		let password = document.getElementById("password").value;

		fetch('/data.json').then(response => response.json()).then(data => {
      		let matchedUser = data.users.filter(u => u.username === username);

      		if(matchedUser.length && matchedUser[0].password && matchedUser[0].password === password) {
      			this.setState({ loggedUser: matchedUser[0].id });
      		} else {
      			this.setState({errorMsg: "invalid credentials"});
      		}
    	});
	}

	componentDidMount() {
	    Dispatcher.register(e => {
	      switch(e.actionType) {
	        case 'logout':
	          this.setState({ loggedUser: -1 });
	          break;
	      }
	    });
	}

	render(){
		let login = (
			<div className="login-page">
				<h2>Community<br/><span className="accent">Books</span></h2>
				<form className="login-form">
					{this.state.errorMsg && (<Alert bsStyle="danger">{this.state.errorMsg}</Alert>)}
					<label>Username</label>
					<input id="username" className="form-control" placeholder="&#xf007; Username" type="text"/>
					<label>Password</label>
					<input id="password" className="form-control" placeholder="&#xf023; Password" type="password"/>
					<input className="whiteframe-shadow-8dp" type="submit" onClick={this.login} value="Login" />
				</form>
			</div>
		);

		let app = <App userId={this.state.loggedUser}/>;

		return this.state.loggedUser > -1 ? app : login;
	}
}

export default Login;


//<Switch>
//     		<Route path="/login" render={(props) => <Login loginSuccess={authenticate} />} />
//     		<Route path="/" render={props => loggedIn > -1 ? (<App {...props} />) : (<Redirect to="/login" />)} />
//</Switch>