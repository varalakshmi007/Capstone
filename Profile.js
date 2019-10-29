import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { MediaRow } from './Media';
import Dispatcher from './Dispatcher';

class Profile extends Component {
	logout(){
		Dispatcher.dispatch({ actionType: 'logout' });
	}

	render() {
		let myBooks, myCommunities, borrowedBooks, waitlist;
		let user = this.props.user;
		let data = this.props.data;

		let hLeft = <Link className="btn" to={{ pathname: "/notifications", state: { modal: true } }} ><i className="fa fa-lg fa-bell"></i></Link>;
		let hRight = <a id="logout-btn" className="btn"><i onClick={this.logout} className="fa fa-lg fa-sign-out"></i></a>;

		function setStatus(book){
			let activeExchange = data.exchanges.filter(e => e.bookId === book.id && (e.borrowerId == user.id || e.lenderId == user.id) && (e.status === "requested" || e.status === "borrowed"))[0];
			if(activeExchange) {
				if(activeExchange.status === "requested") {
					if(Object.keys(activeExchange.pickup).length === 0 && activeExchange.pickup.constructor === Object) { // Empty pickup object
						book.status = "requested-pickup-notset";
					} else {
						book.status = "requested-pickup-" + activeExchange.pickup.status;
					}
				} else if(activeExchange.status === "borrowed") {
					if(Object.keys(activeExchange.return).length === 0 && activeExchange.pickup.constructor === Object) { // Empty pickup object
						book.status = "borrowed-return-notset";
					} else {
						book.status = "borrowed-return-" + activeExchange.pickup.status;
					}
				}
			}

			return book;
		}

		if(data && data.exchanges && data.books && data.communities){
			let borrowedIds = data.exchanges.reduce((l, e) => { if(e.borrowerId === user.id && (e.status === "borrowed" || e.status === "requested")) l.push(e.bookId); return l }, []);

			//Show only the books belonging to this user
			myBooks = user.books.map(b => data.books[b.id]); //BookId + Book Join
			myBooks = myBooks.map(setStatus);
			myCommunities = data.communities.filter(c => user.communities.indexOf(c.id) > -1); //CommunityId + Community Join
			borrowedBooks = data.books.filter(b => borrowedIds.indexOf(b.id) > -1); //BookId + Book Join
			borrowedBooks = borrowedBooks.map(setStatus);
			waitlist = data.books.filter(b => user.waitlist.indexOf(b.id) > -1); //BookId + Book Join				
		}

	    return (
	    	<div>
		    	<Header leftBtn={hLeft} title="Profile" rightBtn={hRight}/>
				<main className="scroll">
					<div className="profile-row whiteframe-shadow-1dp">
						{!user.img && <i className="fa fa-user-circle-o fa-5x" aria-hidden="true"></i>}
						{user.img && <img className="whiteframe-shadow-1dp" src={user.img}/>}
						<h4>{user.firstName} {user.lastName}</h4>
						<div className="stats">
							<i className="fa fa-users fa-lg" aria-hidden="true"></i> {myCommunities && myCommunities.length}&nbsp;&nbsp;&nbsp;
							<i className="fa fa-book fa-lg" aria-hidden="true"></i> {myBooks && myBooks.length}&nbsp;&nbsp;&nbsp;
							<i className="fa fa-lg fa-star"></i> {user.rating}
						</div>
					</div>

					<MediaRow title="My Books" media={myBooks} addLink="/books/addBook" className="my-books"/>
					<MediaRow title="My Communities" media={myCommunities} addLink="/addCommunity"/>
					<MediaRow title="Borrowed Books" media={borrowedBooks} className="borrowed-books"/>
					<MediaRow title="Waitlist" media={waitlist}/>
				</main>
			</div>
	    );
  	}
}

export default Profile;