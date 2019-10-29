import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Grid, Row, Col} from 'react-bootstrap';

function pushItem(list, item, idx, pos){
	if(idx%3 === pos){
		list.push(<MediaItem key={item.id} media={item} />);
	}

	return list;
}

export class MediaGallery extends Component {
	constructor(props){
		super(props);
		this.state = {searchStr:""};
		this.filterMedia = this.filterMedia.bind(this);
	}

	filterMedia(e){
		this.setState({ searchStr: e.target.value });
	}

	render(){
		let list1, list2, list3, filteredMedia;

		if(this.props.media) {
			filteredMedia = this.props.media.filter(m => m.title.toLowerCase().includes(this.state.searchStr.toLowerCase()));
			list1 = filteredMedia.reduce((l, m, i) => pushItem(l, m, i, 0), []);
			list2 = filteredMedia.reduce((l, m, i) => pushItem(l, m, i, 1), []);
			list3 = filteredMedia.reduce((l, m, i) => pushItem(l, m, i, 2), []);
		}

		return(
			<div className="media-gallery">
				<input autoFocus className="search-bar" type="text" placeholder="&#xF002; Search" value={this.state.searchStr} onChange={this.filterMedia}/>
				<Grid>
					<Row>
						<Col xs={4}>
							{list1}
						</Col>
						<Col xs={4}>
							{list2}
						</Col>
						<Col xs={4}>
							{list3}
						</Col>
					</Row>
	  			</Grid>
  			</div>
  		);
	}
}

export class MediaRow extends Component {
	constructor(props){
		super(props);
		this.state = {searchStr:""};
		this.filterMedia = this.filterMedia.bind(this);
	}

	filterMedia(newStr){
		console.log(newStr);
		this.setState({ searchStr: newStr });
	}

	render() {
		let filteredMedia = this.props.media && this.props.media.filter(m => m.title.toLowerCase().includes(this.state.searchStr.toLowerCase()));

		return (
			<div className={this.props.className} >
				<MediaRowHeader 
					title={this.props.title}
					searchStr={this.state.searchStr} 
					onUpdateSearch={this.filterMedia}
					addLink={this.props.addLink}/>
				<MediaRowBody media={filteredMedia}/>
			</div>
		);
	}
}

export class MediaRowHeader extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {search:false};
    	this.toggleSearch = this.toggleSearch.bind(this);
    	this.updateSearch = this.updateSearch.bind(this);
  	}

  	toggleSearch(e) {
  		//If the search is currently active, clear searchStr
  		if(this.state.search) {
    		this.props.onUpdateSearch("");
    	}
    	this.setState({search:!this.state.search});
  	}

  	updateSearch(e){
  		this.props.onUpdateSearch(e.target.value);
  	}

	render() {
		let search = (
			<h3 className="media-row-title">
				<input autoFocus className="search-bar" type="text" placeholder="&#xF002; Search" value={this.props.searchStr} onBlur={this.toggleSearch} onChange={this.updateSearch}/>
				<button onClick={this.toggleSearch}><i className="fa fa-close"></i></button>
			</h3>);

		let header = (
			<h3 className="media-row-title">
				<span className="search-toggle" onClick={this.toggleSearch}><i className="fa fa-search"></i> {this.props.title}</span>
				{this.props.addLink && (<Link to={this.props.addLink}><i className="fa fa-plus"></i></Link>)}
			</h3>
		);

		return this.state.search ? search : header;
	}
}

export class MediaRowBody extends Component {
	render() {
		if (this.props.media) {
		  var mediaList = this.props.media.map(m => <MediaItem key={m.id} media={m} />);
		}

		return (
			<div className={"media-row" + (this.props.small ? ' small' : '')}>
				{mediaList}
			</div>
		);
	}
}

class MediaItem extends Component {
	render() {
		let media = this.props.media;
		let lineTwo = this.props.lineTwo && media[this.props.lineTwo];
		let statusClass = media.status ? media.status : "";

		return (
			<figure className={"media whiteframe-shadow-8dp " + statusClass}>
				<Link to={"/" + media.category + "/" + media.id} >
					<img src={media.img} />
					<div className="figcaption-bg" style={{backgroundImage:'url(' + media.img + ')'}}>
						{media.title}
						<br/>
						{lineTwo}
					</div>
					<figcaption>
						{media.title}
						<br/>
						{lineTwo}
					</figcaption>
				</Link>
			</figure>
		);
	}
}