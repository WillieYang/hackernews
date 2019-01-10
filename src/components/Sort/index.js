import classNames from "classnames";
import Button from "../Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import React from "react";

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

export default Sort;