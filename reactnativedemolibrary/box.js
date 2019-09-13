import React, {Component} from 'react';
import {View} from 'react-native';

const Box = ({body, size, color, leftWall}) => {
	const width = size[0];
	const height = size[1];

	const {x} = body.position;
	const {y} = body.position;
	// Console.log({body});
	return (
		<View
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width,
				height,
				backgroundColor: '#fff'
			}}
		/>
	);
};

export default Box;
