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
          onchange={this.onSearchChange}
        />
        <Table
          list={ list }
          patter={ searchTerm }
          onDismiss={ this.onDismiss }
        />
        {/*<form>*/}
          {/*<input type="text"*/}
                 {/*onChange={this.onSearchChange} />*/}
        {/*</form>*/}
        {/*{*/}
          {/*list.filter(isSearched(searchTerm)).map(item =>*/}
              {/*<div key={ item.objectID }>*/}
                {/*<span>*/}
                  {/*<a href={ item.url }>{ item.title }</a>*/}
                {/*</span>*/}
                {/*<span>{ item.author }</span>*/}
                {/*<span>{ item.num_comments }</span>*/}
                {/*<span>{ item.points }</span>*/}
                {/*<span>*/}
                  {/*<button*/}
                    {/*onClick={() => this.onDismiss(item.objectID)}*/}
                    {/*type="button"*/}
                  {/*>*/}
                    {/*Dismiss*/}
                  {/*</button>*/}
                {/*</span>*/}
              {/*</div>*/}
          {/*)}*/}
      </div>
    );
  }
}

class Search extends  Component {
  render() {
    const { value, onChange } = this.props;
    return (
      <form>
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>
      );
  }
}

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;
    return (
      <div>
        { list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID}>
            <span>
              <a href={ item.url }>{ item.title }</a>
            </span>
            <span>{ item.author }</span>
            <span>{ item.num_comments }</span>
            <span>{ item.points }</span>
            <span>
              <button
                onClick={() => onDismiss(item.objectID)}
                type="button"
              >
                Dismiss
              </button>
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default App;
