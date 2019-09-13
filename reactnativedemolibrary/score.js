import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT / 10;

const scoreBoard = ({score}) => {
	return (
		<View>
			<Text>score: {score}</Text>
		</View>
	);
};

export default {scoreBoard};

const styles = {
	head: {
		backgroundColor: '#FF5877',
		borderColor: '#FFC1C1',
		position: 'absolute'
	}
};
