import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/react.js/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
];
const searchTerm = '';

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { list, searchTerm };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }
  
  onDismiss(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList }); 
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
    const { list, searchTerm } = this.state;
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
        <Table
          list={ list }
          pattern={ searchTerm }
          onDismiss={ this.onDismiss }
        />
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
        <span style={{ width: '40%' }}>
          <a href={ item.url }>{ item.title }</a>
        </span>
        <span style={{ width: '30%' }}>
          { item.author }
          </span>
        <span style={{ width: '10%' }}>
          { item.num_comments }
          </span>
        <span style={{ width: '10%' }}>
          { item.points }
          </span>
        <span style={{ width: '10%' }}>
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

export default App;
