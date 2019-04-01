import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Button from '../Button';

const Sort = ({ sortKey, onSort, children, activeSortKey, isSortReverse }) => {
	// console.log(`Value of isSortReverse: ${isSortReverse}`);
	const sortClass = classNames('button-inline', {
		'button-active': sortKey === activeSortKey
	});

	if (isSortReverse == null) {
		return (
			<Button onClick={() => onSort(sortKey)} className={sortClass}>
				{children}
			</Button>
		);
	}
	return (
		<Button onClick={() => onSort(sortKey)} className={sortClass}>
			{children} <span> </span>
			{isSortReverse ? (
				<FontAwesomeIcon icon={faArrowUp} />
			) : (
				<FontAwesomeIcon icon={faArrowDown} />
			)}
		</Button>
	);
};

export default Sort;
