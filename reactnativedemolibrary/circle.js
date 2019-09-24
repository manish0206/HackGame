import React, {Component} from 'react';
import {View, Dimensions,Image} from 'react-native';

const BALL_SIZE = 20;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT / 10;

const BORDER_WIDTH = Math.trunc(BALL_SIZE * 0.1);

const Circle = ({body, color, size: radius, isPivot,isImage,emoType}) => {
	const {position} = body;
const obj=[require('./in-love.png'),require('./anger.png'),require('./tomato.png'),require('./egg1.png')];
	const {x, y} = position;
	if (!x) {
		return null;
	}
		if(isImage){
			return <Image source={obj[emoType-1]} style={[
						styles.head,
						{
							left: isPivot ? x + radius : x,
							top: isPivot ? y + radius : y,
							//backgroundColor: color || '#FF5877',
							width: 2 * radius || 2 * BALL_SIZE,
							height: 2 * radius || 2 * BALL_SIZE,
							borderWidth: 2 * radius * 0.1 || BORDER_WIDTH
						}
					]}/>
		}
	return (		
		<View
			style={[
				styles.head,
				{
					left: isPivot ? x + radius : x,
					top: isPivot ? y + radius : y,
					backgroundColor: color || '#FF5877',
					width: 2 * radius || 2 * BALL_SIZE,
					height: 2 * radius || 2 * BALL_SIZE,
					borderWidth: 2 * radius * 0.1 || BORDER_WIDTH
				}
			]}
		/>
	);
};

export default Circle;

const styles = {
	head: {
		backgroundColor: '#FF5877',
		borderColor: '#FFC1C1',
		position: 'absolute',
		borderRadius: BALL_SIZE * 2
	}
};
