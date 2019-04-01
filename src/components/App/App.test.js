/* eslint-disable no-unused-vars */

import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Search, Button, Table } from "..";

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<App />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(<App />);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('Search', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<search>Search</search>, div);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(<search>Search</search>);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('Button', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Button>Give me More</Button>, div);
	});

	it('render button with enzyme', () => {
		const element = shallow(<Button>More Options</Button>);
		expect(element);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(<Button>Give me More</Button>);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('Table', () => {
	const props = {
		list: [
			{ title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
			{ title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' }
		]
	};

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Table {...props} />, div);
	});

	it('shows two items in list', () => {
		const element = shallow(<Table {...props} />);

		expect(element.find('.table-row').length).toBe(2);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(<Table {...props} />);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
