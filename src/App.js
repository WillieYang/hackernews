import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import fetch from 'isomorphic-fetch';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel, faSpinner, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

library.add(faStroopwafel, faSpinner);

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const UpdateSearchTopStoreisState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

  const updateHits = [
    ...oldHits,
    ...hits
  ];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updateHits, page}
    },
    isLoading: false
  };
};

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
      isLoading: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page} = result;

    this.setState(UpdateSearchTopStoreisState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({ error: e }));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm)
  }

  onDismiss(id) {
    this.setState(prevState => {
      const {searchKey, results} = prevState;
      const {hits, page} = results[searchKey];
      const isNotId = item => item.objectID !== id;
      const updatedList = hits.filter(isNotId);
      return {
        results: {
        ...results,
            [searchKey]: {hits: updatedList, page}
        }
      };
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm)
    }
    event.preventDefault();
  }
  
  render() {
    const helloWorld = "Welcome to the World of React";
    const username = {
        firstName: 'Sheng',
        lastName: 'Yang',
    };
    const { results, searchTerm, searchKey, error, isLoading } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

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
        </div>
        { error
          ? <div className="interactions">
            <p>Something went wrong.</p>
          </div>
          : <Table
            list={ list }
            onDismiss={ this.onDismiss }
          />
        }
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
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

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

class Table extends Component{
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: null,
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;
    return(
      <div className="table">
        <div className="table-header">
      <span style={{ width: '40%' }}>
        <Sort
          sortKey={'TITLE'}
          onSort={this.onSort}
          activeSortKey={sortKey}
          isSortReverse={isSortReverse}
        >
          Title
        </Sort>
      </span>
          <span style={{ width: '30%' }}>
        <Sort
          sortKey={'AUTHOR'}
          onSort={this.onSort}
          activeSortKey={sortKey}
          isSortReverse={isSortReverse}
        >
          Author
        </Sort>
      </span>
          <span style={{ width: '10%' }}>
        <Sort
          sortKey={'COMMENTS'}
          onSort={this.onSort}
          activeSortKey={sortKey}
          isSortReverse={isSortReverse}
        >
          Comments
        </Sort>
      </span>
          <span style={{ width: '10%' }}>
        <Sort
          sortKey={'POINTS'}
          onSort={this.onSort}
          activeSortKey={sortKey}
          isSortReverse={isSortReverse}
        >
          Points
        </Sort>
      </span>
          <span style={{ width: '10%' }}>
        Archive
      </span>
        </div>
        { reverseSortedList.map(item =>
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
    );
  }
}

// const Table = ({ list, sortKey, isSortReverse, onSort, onDismiss }) => {
//   const sortedList = SORTS[sortKey](list);
//   const reverseSortedList = isSortReverse
//     ? sortedList.reverse()
//     : sortedList;
//   return (
//     <div className="table">
//       <div className="table-header">
//       <span style={{ width: '40%' }}>
//         <Sort
//           sortKey={'TITLE'}
//           onSort={onSort}
//           activeSortKey={sortKey}
//           isSortReverse={isSortReverse}
//         >
//           Title
//         </Sort>
//       </span>
//         <span style={{ width: '30%' }}>
//         <Sort
//           sortKey={'AUTHOR'}
//           onSort={onSort}
//           activeSortKey={sortKey}
//           isSortReverse={isSortReverse}
//         >
//           Author
//         </Sort>
//       </span>
//         <span style={{ width: '10%' }}>
//         <Sort
//           sortKey={'COMMENTS'}
//           onSort={onSort}
//           activeSortKey={sortKey}
//           isSortReverse={isSortReverse}
//         >
//           Comments
//         </Sort>
//       </span>
//         <span style={{ width: '10%' }}>
//         <Sort
//           sortKey={'POINTS'}
//           onSort={onSort}
//           activeSortKey={sortKey}
//           isSortReverse={isSortReverse}
//         >
//           Points
//         </Sort>
//       </span>
//         <span style={{ width: '10%' }}>
//         Archive
//       </span>
//       </div>
//       { reverseSortedList.map(item =>
//         <div key={item.objectID} className="table-row">
//         <span style={largeColumn}>
//           <a href={ item.url }>{ item.title }</a>
//         </span>
//           <span style={middleColumn}>
//           { item.author }
//           </span>
//           <span style={smallColumn}>
//           { item.num_comments }
//           </span>
//           <span style={smallColumn}>
//           { item.points }
//           </span>
//           <span style={smallColumn}>
//           <Button
//             onClick={() => onDismiss(item.objectID)}
//             className="button-inline"
//           >
//             Dismiss
//           </Button>
//         </span>
//         </div>
//       )}
//     </div>
//   );
// };

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const Button = ({ onClick, className, children }) =>
  <button
    onClick = {onClick}
    className={className}
  >
    {children}
  </button>

Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Loading = () =>
  <div>
    Loading ... <FontAwesomeIcon icon="spinner"/>
  </div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component {...rest} />

const ButtonWithLoading = withLoading(Button);

const Sort = ({ sortKey, onSort, children, activeSortKey, isSortReverse }) => {
  // console.log(`Value of isSortReverse: ${isSortReverse}`);
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  if(isSortReverse == null) {
    return (
      <Button
        onClick={() => onSort(sortKey)}
        className={sortClass}>
        {children}
      </Button>
    );
  } else {
    return (
      <Button
        onClick={() => onSort(sortKey)}
        className={sortClass}>
        {children} <span> </span>
        {
          isSortReverse
            ? <FontAwesomeIcon icon={faArrowUp}/>
            : <FontAwesomeIcon icon={faArrowDown}/>
        }
      </Button>
    );
  }
};

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

export {
  Button,
  Search,
  Table,
};
