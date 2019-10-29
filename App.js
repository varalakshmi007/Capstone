import React, { Component } from 'react';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Books from './Books';
import Communities from './Communities';
import Profile from './Profile';
import Notifications from './Notifications';
import Dispatcher from './Dispatcher';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {appData: {}, loggedUser:{}};
  }

  //Load data for the first time
  componentDidMount() {
    fetch('/data.json').then(response => response.json()).then(data => {
      this.setState({appData: data, loggedUser:data.users[this.props.userId]});
    });

    Dispatcher.register(e => {
      switch(e.actionType) {
        case 'request-book':
          this.setState((state, props) => {
            e.payload.borrowerId = props.userId;
            let newData = JSON.parse(JSON.stringify(state.appData)); //Deep Clone the Object
            newData.exchanges.push(e.payload);
            return { appData: newData };
          });
          break;
        case 'join-community':
          this.setState((state, props) => {
            let cId = parseInt(e.payload.communityId);
            let newData = JSON.parse(JSON.stringify(state.appData)); //Deep Clone the Object
            let newUser = JSON.parse(JSON.stringify(state.loggedUser)); //Deep Clone the Object
            if(newUser.communities.indexOf(cId) === -1) {
              newUser.communities.push(cId);
              newData.users[newUser.id] = newUser;
            }
            return { appData: newData, loggedUser:newUser };
          });
          break;
        case 'leave-community':
          this.setState((state, props) => {
            let cId = parseInt(e.payload.communityId);
            let newData = JSON.parse(JSON.stringify(state.appData)); //Deep Clone the Object
            let newUser = JSON.parse(JSON.stringify(state.loggedUser)); //Deep Clone the Object
            let idx = newUser.communities.indexOf(cId);
            if(idx > -1) {
              newUser.communities.splice(idx, 1);
              newData.users[newUser.id] = newUser;
            }
            return { appData: newData, loggedUser:newUser };
          });
          break;
        case 'add-book':
          this.setState((state, props) => {

            let newData = JSON.parse(JSON.stringify(state.appData)); //Deep Clone the Object
            let newUser = JSON.parse(JSON.stringify(state.loggedUser)); //Deep Clone the Object
            let id = newData.books.length;

            e.payload.book.id = id;
            
            newData.books.push(e.payload.book);
            newUser.books.push({id:id, condition:e.payload.condition});
            newData.users[newUser.id] = newUser;

            return { appData: newData, loggedUser:newUser };
          });
          break;

        case 'add-to-waitlist':
          this.setState((state, props) => {
            let newData = JSON.parse(JSON.stringify(state.appData)); //Deep Clone the Object
            let newUser = JSON.parse(JSON.stringify(state.loggedUser)); //Deep Clone the Object
            let id = e.payload.bookId;
            
            newUser.waitlist.push(id);
            newData.users[newUser.id] = newUser;
            return { appData: newData, loggedUser:newUser };
          });
          break;

        case 'remove-from-waitlist':
          this.setState((state, props) => {
            let newData = JSON.parse(JSON.stringify(state.appData)); //Deep Clone the Object
            let newUser = JSON.parse(JSON.stringify(state.loggedUser)); //Deep Clone the Object
            let id = e.payload.bookId;
            let idx = newUser.waitlist.indexOf(id);
            if(idx > -1) {
              newUser.waitlist.splice(idx, 1);
              newData.users[newUser.id] = newUser;
            }
            newData.users[newUser.id] = newUser;
            return { appData: newData, loggedUser:newUser };
          });
          break;
      }
    });
  }

  render() {
    return (
      <div className="App" onClick={this.props.appClick}>
        <Route render={(props) => <Main {...props} data={this.state.appData} user={this.state.loggedUser}/>}/>
        <Nav />
      </div>
    );
  }
}

class Main extends Component {
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render(){
    const { location } = this.props;
    console.log(location);
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    return(
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route path="/home" render={(props) => <Home data={this.props.data} user={this.props.user} />} />
          <Route path="/books" render={(props) => <Books data={this.props.data} user={this.props.user} />}/>
          <Route path="/communities" render={(props) => <Communities data={this.props.data} user={this.props.user} />}/>
          <Route path="/profile" render={(props) => <Profile data={this.props.data} user={this.props.user} />}/>
          <Route path="/" render={() => <Redirect to="/home"/>} />
        </Switch>
        {isModal ? <Route path="/notifications" render={(props) => <Notifications {...props} user={this.props.user} />} /> : null}
      </div>
    );
  }
}

class Nav extends Component {
  render(){
    return (
      <nav>
        <ul>
          <li><NavLink activeClassName="active" to="/home"><i className="fa fa-lg fa-home"></i>Home</NavLink></li>
          <li><NavLink activeClassName="active" to="/books"><i className="fa fa-lg fa-book"></i>Books</NavLink></li>
          <li><NavLink activeClassName="active" to="/communities"><i className="fa fa-lg fa-users"></i>Communities</NavLink></li>
          <li><NavLink activeClassName="active" to="/profile"><i className="fa fa-lg fa-user"></i>Profile</NavLink></li>
        </ul>
      </nav>
    );
  }
}


export default App;
