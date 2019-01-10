import React, {Component} from 'react';
import Button from '../Button'
import PropTypes from "prop-types";
import classNames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons/index";
import {sortBy} from "lodash";

const largeColumn = {
    width: '40%',
};

const middleColumn = {
    width: '30%',
};

const smallColumn = {
    width: '10%',
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

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
};

export default Table;