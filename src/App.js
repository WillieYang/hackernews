import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.github.io/react/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://github.com/react.js/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   }
// ];

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`

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
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    console.log(result)
    this.setState({ result });
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
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
  
  render() {
    const helloWorld = "Welcome to the World of React";
    const username = {
        firstName: 'Sheng',
        lastName: 'Yang',
    };
    const { result, searchTerm } = this.state;

    if(!result) { return null; }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <h2>{ helloWorld }</h2>
        <p>{ username.firstName } { username.lastName }</p>
        <Search
          value={ searchTerm }
          onChange={this.onSearchChange}
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
    );
  }
}

const Search = ({ value, onChange, children}) =>
  <form>
    { children } <input
    type="text"
    value={value}
    onChange={onChange}
  />
  </form>

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    { list.filter(isSearched(pattern)).map(item =>
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
