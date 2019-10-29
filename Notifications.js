import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class Notifications extends Component {
	back(e) {
	    e.stopPropagation();
	    this.props.history.goBack();
	};

	render() {
	    return (
			  <Modal.Dialog>
			    <Modal.Header>
			      <Modal.Title>Notifications <i className="fa fa-close" onClick={this.back.bind(this)}></i></Modal.Title>
			    </Modal.Header>

			    <Modal.Body>
			    	<ul className="fa-ul notifications-list">
			    		<li></li>
			    		<li></li>
			    		<li></li>
			    		  <li><i className="fa-li fa fa-book"></i><a>New Book Request</a></li>
					  	<li><i className="fa-li fa fa-users"></i><a>Community Join Request Accepted</a></li>
					  	<li><i className="fa-li fa fa-flash"></i><a>Waitlisted Book Now Available!</a></li>
			    	</ul>
			    </Modal.Body>
			  </Modal.Dialog>
	    );
  	}
}

export default Notifications;