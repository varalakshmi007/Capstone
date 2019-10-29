import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { MediaRow } from './Media';

function shuffleArray(a) {
	var array = a.slice();
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

class Home extends Component {
	render() {
		let suggestedBooks, suggestedCommunities;

		let user = this.props.user;
		let hLeft = <Link className="btn" to={{ pathname: "/notifications", state: { modal: true } }} ><i className="fa fa-lg fa-bell"></i></Link>;
		let hRight = <Link className="btn" to="/profile"><i className="fa fa-lg fa-star"></i> {user.rating}</Link>;
		
		if(this.props.data.books) suggestedBooks = shuffleArray(this.props.data.books).slice(0, 5);
		if(this.props.data.communities) suggestedCommunities = shuffleArray(this.props.data.communities).slice(0, 4);

	    return (
	    	<div>
		    	<Header leftBtn={hLeft} title={"Hello, " + user.firstName} rightBtn={hRight}/>
				<main className="scroll">
					<MediaRow title="Books" media={suggestedBooks} addLink="/books/scanbook"/>
					<MediaRow title="Communities" media={suggestedCommunities} addLink="/addcommunity"/>
				</main>
			</div>
	    );
  	}
}

export default Home;