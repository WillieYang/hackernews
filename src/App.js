import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page} = result;
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];
    const updateHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      result: {hits: updateHits, page}
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm)
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedList }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm)
    event.preventDefault();
  }
  
  render() {
    const helloWorld = "Welcome to the World of React";
    const username = {
        firstName: 'Sheng',
        lastName: 'Yang',
    };
    const { result, searchTerm } = this.state;
    const page = (result && result.page) || 0;

    if(!result) { return null; }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h2>{ helloWorld }</h2>
        <p>{ username.firstName } { username.lastName }</p>
        <div className="interactions">
          <Search
            value={ searchTerm }
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          > Search
          </Search>
          { result
            ? <Table
              list={ result.hits }
              pattern={ searchTerm }
              onDismiss={ this.onDismiss }
            />
            : null
          }
        </div>
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children, onSubmit}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Table = ({ list, onDismiss }) =>
  <div className="table">
    { list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={ item.url }>{ item.title }</a>
        </span>
        <span style={middleColumn}>
          { item.author }
          </span>
        <span style={smallColumn}>
          { item.num_comments }
          </span>
        <span style={smallColumn}>
          { item.points }
          </span>
        <span style={smallColumn}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className='', children }) =>
  <button
    onClick = {onClick}
    className={className}
  >
    {children}
  </button>

const largeColumn = {
  width: '40%',
};

const middleColumn = {
  width: '30%',
};

const smallColumn = {
  width: '10%',
};

export default App;
