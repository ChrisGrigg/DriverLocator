import React from 'react';
import ReactDOM from 'react-dom';
import ContainerComponent from './Container';
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	// cleanup on exiting
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});

it('renders without crashing', () => {
	ReactDOM.render(<ContainerComponent />, container);
});
