import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Header from './Header';
import { MediaGallery } from './Media';
import { BackButton } from './Misc';
import Dispatcher from './Dispatcher';

class Books extends Component {
	render() {
	    return (
	    	<Switch>
	    		<Route path="/books/scanbook" component={ScanBook}/>
	    		<Route path="/books/addbook" render={(props) => <AddBook {...props}/>}/>
	    		<Route path="/books/:id/request" render={(props) => <BookRequest {...props} books={this.props.data.books} users={this.props.data.users}/>}/>
	    		<Route path="/books/:id" render={(props) => <BookDetails {...props} exchanges={this.props.data.exchanges} books={this.props.data.books} users={this.props.data.users} user={this.props.user}/>}/>
	    		<Route path="/books" render={(props) => <AllBooks books={this.props.data.books} />}/>
		  	</Switch>
	    );
  	}
}

class AllBooks extends Component {
	render(){		
		let hLeft = <Link className="btn" to={{ pathname: "/notifications", state: { modal: true } }} ><i className="fa fa-lg fa-bell"></i></Link>;
		let hRight = <Link className="btn" to="/books/scanbook"><i className="fa fa-lg fa-plus"></i></Link>;

		return(
			<div>
				<Header leftBtn={hLeft} title="Books" rightBtn={hRight}/>
			    <main className="scroll">
			    	<MediaGallery media={this.props.books} />
			  	</main>
			</div>
		);
	}
}


class BookDetails extends Component {
	constructor(props){
		super(props);
		this.bookId = parseInt(this.props.match.params.id);
	}
	

	addToWaitlist(){
		Dispatcher.dispatch({
            actionType: 'add-to-waitlist',
            payload: {"bookId":this.bookId}
        });
	}

	removeFromWaitlist(){
		Dispatcher.dispatch({
            actionType: 'remove-from-waitlist',
            payload: {"bookId":this.bookId}
        });
	}

	render(){
		let users = [], book, count, bookContent, bookStatus;

		if(this.props.books){
			book = this.props.books[this.bookId]; //this is cheating, but who cares :)

			if(this.props.users){
				users = this.props.users.filter(u => u.books.filter(b => b.id === book.id ).length);
				count = users.length === 1 ? users[0].username : users.length + ' users';
			}
			//Set book status
			if(this.props.exchanges && this.props.user) {
				let activeExchange = this.props.exchanges.filter(e => e.bookId === book.id && (e.borrowerId == this.props.user.id || e.lenderId == this.props.user.id) && (e.status === "requested" || e.status === "borrowed"))[0];
				console.log();
				if(activeExchange) {
					let userRole = activeExchange.lenderId == this.props.user.id ? 'lender' : 'borrower';
					bookStatus = userRole + '-';

					if(activeExchange.status === "requested") {
						if(Object.keys(activeExchange.pickup).length === 0 && activeExchange.pickup.constructor === Object) { // Empty pickup object
							bookStatus += "requested-pickup-notset";
						} else {
							bookStatus += "requested-pickup-" + activeExchange.pickup.status;
						}
					} else if(activeExchange.status === "borrowed") {
						if(Object.keys(activeExchange.return).length === 0 && activeExchange.pickup.constructor === Object) { // Empty pickup object
							bookStatus += "borrowed-return-notset";
						} else {
							bookStatus += "borrowed-return-" + activeExchange.pickup.status;
						}
					}
				} else if(this.props.user.waitlist.indexOf(this.bookId) > -1) {
					bookStatus = "waitlisted";
				} else if(!users.length) {
					bookStatus = "unavailable";
				}
			}

		}
		
		let hLeft = <BackButton></BackButton>;

		if(book) {
			let actionButton, hRight, alert, queueSize;
			switch(bookStatus){
				case 'waitlisted':
					queueSize = this.props.users && this.props.users.reduce((n,u) => u.waitlist.indexOf(book.id) > -1 ? ++n : n, 0) || 0; //Count the queue size
					//TODO Implement onClick - removing from waitlist
					actionButton = <button className="whiteframe-shadow-4dp btn-outline btn-r" onClick={this.removeFromWaitlist.bind(this)}>Remove From Waitlist ({queueSize})</button>;
					hRight = <a className="btn" onClick={this.removeFromWaitlist.bind(this)}>Remove</a>;
					break;
				case 'lender-requested-pickup-notset':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Setup Pickup</button>;
					alert = <Alert bsStyle="danger"><strong>Book requested.</strong> Setup Pickup</Alert>;
					hRight = <a className="btn">Setup</a>;
					break;
				case 'lender-requested-pickup-pending':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Pending</button>;
					alert = <Alert bsStyle="warning"><strong>Pickup Set.</strong> Awaiting Confirmation</Alert>;
					break;
				case 'lender-requested-pickup-confirmed':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Pending</button>;
					alert = <Alert bsStyle="success"><strong>Pickup Confirmed.</strong> Awaiting Exchange</Alert>;
					break;
				case 'lender-borrowed-return-notset':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Book Lent</button>;
					break;
				case 'lender-borrowed-return-pending':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Confirm Return</button>;
					alert = <Alert bsStyle="danger"><strong>Return Requested.</strong> Confirm Exchange</Alert>;
					hRight = <a className="btn">Confirm</a>;
					break;
				case 'lender-return-confirmed':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Pending</button>;
					alert = <Alert bsStyle="success"><strong>Return Confirmed.</strong> Awaiting Exchange</Alert>;
					break;
				case 'borrower-requested-pickup-notset':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Pending</button>;
					alert = <Alert bsStyle="warning"><strong>Book Requested.</strong> Awaiting Confimation</Alert>;
					break;
				case 'borrower-requested-pickup-pending':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Confirm Pickup</button>;
					alert = <Alert bsStyle="danger"><strong>Book requested.</strong> Confirm Pickup</Alert>;
					hRight = <a className="btn">Confirm</a>;
					break;
				case 'borrower-requested-pickup-confirmed':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Pending</button>;
					alert = <Alert bsStyle="success"><strong>Pickup Confirmed.</strong> Awaiting Exchange</Alert>;
					break;
				case 'borrower-borrowed-return-notset':
					//TODO Implement onClick - requesting to return a book
					actionButton = <button className="whiteframe-shadow-4dp btn-outline btn-r">Return</button>;
					hRight = <a className="btn">Return</a>;
					break;
				case 'borrower-borrowed-return-pending':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Pending</button>;
					alert = <Alert bsStyle="danger"><strong>Book requested.</strong> Confirm Pickup</Alert>;
					hRight = <a className="btn">Confirm</a>;
					break;
				case 'borrower-return-confirmed':
					actionButton = <button disabled className="whiteframe-shadow-4dp btn-outline btn-r">Pending</button>;
					alert = <Alert bsStyle="success"><strong>Return Confirmed.</strong> Awaiting Exchange</Alert>;
					break;
				case 'unavailable':
					queueSize = this.props.users && this.props.users.reduce((n,u) => u.waitlist.indexOf(book.id) > -1 ? ++n : n, 0) || 0; //Count the queue size
					actionButton = <button className="whiteframe-shadow-8dp btn-outline btn-r" onClick={this.addToWaitlist.bind(this)}>Add to Waitlist ({queueSize})</button>;
					hRight = <a className="btn" onClick={this.addToWaitlist.bind(this)}>Add</a>;
					break;
				default:
					actionButton = <Link className="whiteframe-shadow-8dp btn-outline btn-r" to={this.props.match.url + "/request"}>Request Book</Link>;
					hRight = <Link className="btn" to={this.props.match.url + "/request"}>Request</Link>;
			}

			bookContent = (
				<div>
					<Header leftBtn={hLeft} title={book.title} rightBtn={hRight}/>
					<main className="scroll book-details">
						{alert}
						<img className="whiteframe-shadow-4dp" src={book.img} />
					    <p className="title">{book.title}</p>
					    { users.length ? <p className="availability">Available from <span>{count}</span></p> : <p className="availability">Unavailable</p> }
					    <p className="description">{book.description}</p>
					    {actionButton}
					</main>
				</div>
			); 
		} else {
			bookContent = <h3 className="empty-msg">No Book Info</h3>;
		}

		return bookContent;
	}
}

class BookRequest extends Component {
	requestBook(lenderId){
        Dispatcher.dispatch({
            actionType: 'request-book',
            payload: {"bookId":parseInt(this.props.match.params.id), "lenderId":lenderId, "status":"requested", "pickup":{}, "return":{}}
        });
        this.props.history.go(-1);
	}


	render(){
		let usersList = [], book, bookContent;

		if(this.props.books){
			book = this.props.books[this.props.match.params.id]; //this is cheating, but who cares :)
		}
		
		let hLeft = <BackButton></BackButton>;

		if(book) {

			if(this.props.users){
				usersList = this.props.users.reduce((l, u) => {
					let userBook = u.books.filter(b => b.id === book.id );
					if(userBook.length) {
						l.push(
							<li key={u.id}>
								<span>{u.username}</span>
					          	<span><i className="fa fa-star"></i> {u.rating}</span>
					          	<span className="condition">{userBook[0].condition}</span>
					          	<a className="btn" onClick={() => this.requestBook(u.id)}>Request&nbsp;&nbsp;<i className="fa fa-chevron-right"></i></a>
					        </li>
						);	
					}

					return l;
				}, []);
			}

			bookContent = (
				<div>
					<Header leftBtn={hLeft} title={book.title} />
					<main className="scroll book-request">
					    <ul className="users">
					    	{usersList}
					    </ul>		
					</main>
				</div>
			);
		} else {
			bookContent = <h3 className="empty-msg">No Book Info</h3>;
		}

		return bookContent;
	}
}

class ScanBook extends Component {
	render(){

		let hLeft = <BackButton></BackButton>;
		let hRight = <Link className="btn" to="/books/addbook">Skip</Link>

		return(
			<div>
				<Header leftBtn={hLeft} title="Scan Book" rightBtn={hRight}/>
			    <main className="scan-book">
			  	</main>
			</div>
		);
	}
}

class AddBook extends Component {
	constructor(props) {
	    super(props);
	    this.state = {title: 'Harry Potter and the Order of Phoenix', img:'/img/harry-potter.png', condition:'Good', description:"There is a Door at the end of a silent corridor. And it's haunting Harry Potter's dreams. Why else would he be waking in the middle of the night, screaming in terror? Here are just a few things on Harry's mind: A Defense Against the Dark Arts teacher with a personality like poisoned honey. A venomous, disgruntled house-elf. Ron as keeper of the Gryffindor Quidditch team. The looming terror of the end-of-term Ordinary Wizarding Level exams...and of course, the growing threat of He-Who-Must-Not-Be-Named."};
	}

	addBook(){
		Dispatcher.dispatch({
            actionType: 'add-book',
            payload: { "book":{title:this.state.title, img:this.state.img, description:this.state.description, category:"books" }, "condition":this.state.condition }
        });
        this.props.history.push('/home');
	}

	onChange(e){
		this.setState({ [e.target.name]: e.target.value });
	}

	render(){
		let hLeft = <BackButton></BackButton>;
		let hRight = <a className="btn" onClick={this.addBook.bind(this)}>Add</a>

		return(
			<div>
				<Header leftBtn={hLeft} title="Add Book" rightBtn={hRight}/>
					<main className="add-book scroll">
						<img className="whiteframe-shadow-4dp" src={this.state.img} />
					    <input name="title" type="text" className="title" value={this.state.title} onChange={this.onChange.bind(this)}/>
					    <label>Condition: </label>
					    <select name="condition" value={this.state.condition} onChange={this.onChange.bind(this)}>
					        <option value="Excellent">Excellent</option>
					        <option value="Good">Good</option>
					        <option value="Fair">Fair</option>
					        <option value="Poor">Poor</option>
					        <option value="Terrible">Terrible</option>
					    </select>
					    <label className="label-description">Description: </label>
					    <textarea name="description" className="description" value={this.state.description} onChange={this.onChange.bind(this)}></textarea>
					    <a className="whiteframe-shadow-8dp btn-outline btn-r" onClick={this.addBook.bind(this)}>Add Book</a>
					</main>
			</div>
		);
	}
}

export default Books;