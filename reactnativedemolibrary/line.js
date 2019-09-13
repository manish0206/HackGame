import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {Line} from 'react-native-svg';

const BALL_SIZE = 20;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT / 10;

const BORDER_WIDTH = Math.trunc(BALL_SIZE * 0.1);

const line = ({rock, pivot, shoot, falseLine}) => {
	const {
		position: {x: l1}
	} = falseLine;
	if (l1 === 0) {
		return null;
	}

	const {
		position: {x: x1, y: y1}
	} = rock;
	const {
		position: {x: x2, y: y2}
	} = pivot;

	// Console.log({shoot});
	// if (shoot) {
	//   return null;
	// }
	return (
		<Svg height={GAME_HEIGHT} width={GAME_WIDTH} color="white">
			<Line
				x1={x1 + BALL_SIZE}
				y1={y1 + BALL_SIZE}
				x2={x2 + BALL_SIZE}
				y2={y2 + BALL_SIZE}
				stroke="#5184AF"
				strokeWidth="4"
				strokeLinecap="round"
				strokeDasharray="4 8"
			/>
		</Svg>
	);
};

export default line;

const styles = {
	head: {
		// BackgroundColor: '#FF5877',
		// borderColor: '#FFC1C1',
		// borderWidth: BORDER_WIDTH,
		// position: 'absolute',
	}
};
