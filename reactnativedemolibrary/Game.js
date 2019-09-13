// Src/screens/Game.js
import React, {PureComponent} from 'react';
import {View, Text, Alert} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';

import Circle from '../components/Circle'; // For rendering the ball
import Box from '../components/Box'; // For rendering the planks and walls

const BALL_SIZE = 50;
const PLANK_HEIGHT = 70;
const PLANK_WIDTH = 20;

const GAME_WIDTH = 650;
const GAME_HEIGHT = 340;

const BALL_START_POINT_X = GAME_WIDTH / 2 - BALL_SIZE;
const BALL_START_POINT_Y = GAME_HEIGHT / 2;
const BORDER = 15;

const WINNING_SCORE = 5;

const plankSettings = {
	isStatic: true
};

const wallSettings = {
	isStatic: true
};

const ballSettings = {
	inertia: 0,
	friction: 0,
	frictionStatic: 0,
	frictionAir: 0,
	restitution: 1
};

const ball = Matter.Bodies.circle(
	BALL_START_POINT_X,
	BALL_START_POINT_Y,
	BALL_SIZE,
	{
		...ballSettings,
		label: 'ball'
	},
);
