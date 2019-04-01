import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';

// import { startAction } from "../../actions/startAction";
// import { stopAction } from "../../actions/stopAction";
import fetch from 'isomorphic-fetch';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStroopwafel, faSpinner } from '@fortawesome/free-solid-svg-icons';
import rotateAction from '../../actions/rotateAction';
import logo from '../../logo.svg';
import './index.css';
import Search from '../Search';
import Button from '../Button';
import Table from '../Table';
import Loading from '../Loading';
import {
	PARAM_HPP,
	DEFAULT_HPP,
	DEFAULT_QUERY,
	PARAM_PAGE,
	PARAM_SEARCH,
	PATH_BASE,
	PATH_SEARCH
} from '../../constants';

library.add(faStroopwafel, faSpinner);

const UpdateSearchTopStoriesState = (hits, page) => prevState => {
	const { searchKey, results } = prevState;

	const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

	const updateHits = [...oldHits, ...hits];

	return {
		results: {
			...results,
			[searchKey]: { hits: updateHits, page }
		},
		isLoading: false
	};
};

const Home = () => (
	<div>
		<h2>Home</h2>
	</div>
);

const Category = () => (
	<div>
		<h2>Category</h2>
	</div>
);

const Products = () => (
	<div>
		<h2>Products</h2>
	</div>
);

// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			results: null,
			searchKey: '',
			searchTerm: DEFAULT_QUERY,
			error: null,
			isLoading: false
		};

		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
	}

	setSearchTopStories(result) {
		const { hits, page } = result;

		this.setState(UpdateSearchTopStoriesState(hits, page));
	}
  
  needsToSearchTopStories(searchTerm) {
	  const { results } = this.state
    return !results[searchTerm];
  }
	
	fetchSearchTopStories(searchTerm, page = 0) {
		this.setState({ isLoading: true });

		fetch(
			`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
		)
			.then(response => response.json())
			.then(result => this.setSearchTopStories(result))
			.catch(e => this.setState({ error: e }));
	}

	componentDidMount() {
		const { searchTerm } = this.state;
		this.setState({ searchKey: searchTerm });
		this.fetchSearchTopStories(searchTerm);
	}

	onDismiss(id) {
		this.setState(prevState => {
			const { searchKey, results } = prevState;
			const { hits, page } = results[searchKey];
			const isNotId = item => item.objectID !== id;
			const updatedList = hits.filter(isNotId);
			return {
				results: {
					...results,
					[searchKey]: { hits: updatedList, page }
				}
			};
		});
	}

	onSearchChange(event) {
		this.setState({ searchTerm: event.target.value });
	}

	onSearchSubmit(event) {
		const { searchTerm } = this.state;
		this.setState({ searchKey: searchTerm });

		if (this.needsToSearchTopStories(searchTerm)) {
			this.fetchSearchTopStories(searchTerm);
		}
		event.preventDefault();
	}

	render() {
		const helloWorld = 'Welcome to the World of React';
		const username = {
			firstName: 'Sheng',
			lastName: 'Yang'
		};
		const { results, searchTerm, searchKey, error, isLoading } = this.state;
		const page =
			(results && results[searchKey] && results[searchKey].page) || 0;
		const list =
			(results && results[searchKey] && results[searchKey].hits) || [];

		return (
			<div className="App">
				<header className="App-header">
					<img
						src={logo}
						className={`App-logo${
							this.props.rotating ? '' : ' App-logo-paused '
						}`}
						alt="logo"
						onClick={() => this.props.rotateAction(!this.props.rotating)}
					/>
				</header>
				<h2>{helloWorld}</h2>
				<p>
					{username.firstName} {username.lastName}
				</p>
				<div>
					<nav className="navbar navbar-light">
						<ul className="nav navbar-nav">
							<li>
								<Link to="/home">Home</Link>
							</li>
							<li>
								<Link to="/category">Category</Link>
							</li>
							<li>
								<Link to="/products">Products</Link>
							</li>
						</ul>
					</nav>
					<Route path="/home" component={Home} />
					<Route path="/category" component={Category} />
					<Route path="/products" component={Products} />
				</div>
				<br />
				<div className="interactions">
					<Search
						value={searchTerm}
						onChange={this.onSearchChange}
						onSubmit={this.onSearchSubmit}
					>
						Search
					</Search>
				</div>
				{error ? (
					<div className="interactions">
						<p>Something went wrong.</p>
					</div>
				) : (
					<Table list={list} onDismiss={this.onDismiss} />
				)}
				<div className="interactions">
					<ButtonWithLoading
						isLoading={isLoading}
						onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
					>
						More
					</ButtonWithLoading>
				</div>
			</div>
		);
	}
}

const withLoading = Component => ({ isLoading, ...rest }) =>
	isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

const mapStateToProps = state => ({
	...state
});

const mapDispatchToProps = dispatch => ({
	rotateAction: payload => dispatch(rotateAction(payload))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
