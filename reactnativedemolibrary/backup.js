import React, {PureComponent} from 'react';
import {View, Text, Alert, Dimensions} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';
import Circle from './circle';
import Box from './box';

const BALL_SIZE = 50;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT / 10;

const BALL_START_POINT_X = GAME_WIDTH / 2;
const BALL_START_POINT_Y = GAME_HEIGHT / 2;
const BORDER = 15;

const defaultCategory = 0x0001;

function getAngle(cx, cy, ex, ey) {
	var dy = ey - cy;
	var dx = ex - cx;
	var theta = Math.atan2(dy, dx); // range (-PI, PI]
	theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	//if (theta < 0) theta = 360 + theta; // range [0, 360)
	return theta;
}

const wallSettings = {
	isStatic: true,
	render: {
		fillStyle: 'transparent',
		lineWidth: 1,
	},
	collisionFilter: {
		mask: defaultCategory,
	},
};

const ballSettings = {
	inertia: 0,
	friction: 0,
	frictionStatic: 0,
	frictionAir: 0.5,
	restitution: 1,
	collisionFilter: {
		mask: defaultCategory,
	},
};

const ball = Matter.Bodies.circle(
	BALL_START_POINT_X,
	BALL_START_POINT_Y,
	BALL_SIZE,
	{
		...ballSettings,
		label: 'ball',
	},
);

const ceiling = Matter.Bodies.rectangle(0, 0, 2 * GAME_WIDTH, BORDER, {
	...wallSettings,
	label: 'wall',
});
const floor = Matter.Bodies.rectangle(0, GAME_HEIGHT, 2 * GAME_WIDTH, BORDER, {
	...wallSettings,
	label: 'wall',
});

const leftWall = Matter.Bodies.rectangle(0, 0, BORDER, 2 * GAME_HEIGHT, {
	...wallSettings,
	label: 'wall',
});
const rightWall = Matter.Bodies.rectangle(
	GAME_WIDTH - BORDER,
	0,
	BORDER,
	2 * GAME_HEIGHT,
	{
		...wallSettings,
		label: 'wall',
	},
);

const engine = Matter.Engine.create({enableSleeping: false});
const {world} = engine;

Matter.World.add(world, [ball, ceiling, floor, leftWall, rightWall]);

export default class App extends PureComponent {
	static navigationOptions = {
		header: null,
	};

	state = {
		myScore: 0,
	};

	constructor(props) {
		super(props);

		const {navigation} = this.props;
		this.state.direction = 1;

		this.physics = (entities, {time}) => {
			const {engine} = entities.physics;
			engine.world.gravity.y = 0;
			Matter.Engine.update(engine, time.delta);
			return entities;
		};

		this.moveBall = (entities, {touches}) => {
			// console.log({touches});
			const move = touches.find(x => x.type === 'press');
			if (move) {
				// console.log({
				// 	y: move.event.locationY,
				// 	x: move.event.locationX,
				// });
				const my = move.event.locationY;
				const mx = move.event.locationX;
				const bx = ball.position.x;
				const by = ball.position.y;
				// Matter.Body.setVelocity(ball, {
				// 	y: 0,
				// 	x: -1 * this.state.direction * 3,
				// });
				const angle = (getAngle(mx, my, bx, by) * Math.PI) / 180;
				const vx = Math.cos(angle) * 10;
				const vy = Math.sin(angle) * 10;
				Matter.Body.setVelocity(ball, {
					x: -1 * vx,
					y: -1 * vy,
				});
				this.setState({
					direction: -1 * this.state.direction,
				});
			}

			return entities;
		};
	}

	componentDidMount() {
		Matter.Body.setVelocity(ball, {x: 3, y: 0});
		Matter.Events.on(engine, 'collisionStart', event => {
			var pairs = event.pairs;
			// console.log({pairs});
		});
	}

	render() {
		return (
			<GameEngine
				style={styles.container}
				systems={[this.physics, this.moveBall]}
				entities={{
					physics: {
						engine,
						world,
					},
					pongBall: {
						body: ball,
						size: [BALL_SIZE, BALL_SIZE],
						position: {
							x: GAME_WIDTH / 2,
							y: GAME_HEIGHT,
						},
						renderer: Circle,
					},
					theCeiling: {
						body: ceiling,
						size: [GAME_WIDTH, BORDER],
						color: '#f9941d',
						renderer: Box,
					},
					theFloor: {
						body: floor,
						size: [GAME_WIDTH, BORDER],
						color: '#f9941d',
						renderer: Box,
					},
					theLeftWall: {
						body: leftWall,
						size: [BORDER, GAME_HEIGHT],
						color: '#f9941d',
						renderer: Box,
					},
					theRightWall: {
						body: rightWall,
						size: [BORDER, GAME_HEIGHT],
						color: '#f9941d',
						renderer: Box,
					},
				}}
			/>
		);
	}
}

const styles = {
	container: {
		width: GAME_WIDTH,
		height: GAME_HEIGHT,
		backgroundColor: '#FFF',
		alignSelf: 'center',
	},
};




////////
import React, {PureComponent} from 'react';
import {View, Text, Alert, Dimensions} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';
import Circle from './circle';
import Box from './box';

const BALL_SIZE = 50;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT / 10;

const BALL_START_POINT_X = GAME_WIDTH / 2;
const BALL_START_POINT_Y = GAME_HEIGHT / 2;
const BORDER = 15;

const defaultCategory = 0x0001;

function getAngle(cx, cy, ex, ey) {
	const dy = ey - cy;
	const dx = ex - cx;
	let theta = Math.atan2(dy, dx); // range (-PI, PI]
	theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	// if (theta < 0) theta = 360 + theta; // range [0, 360)
	return theta;
}

const wallSettings = {
	isStatic: true,
	render: {
		fillStyle: 'transparent',
		lineWidth: 1,
	},
	collisionFilter: {
		mask: defaultCategory,
	},
};

const ballSettings = {
	inertia: 0,
	friction: 0,
	frictionStatic: 0,
	frictionAir: 0.5,
	restitution: 1,
	collisionFilter: {
		mask: defaultCategory,
	},
};

const ball = Matter.Bodies.circle(
	BALL_START_POINT_X,
	BALL_START_POINT_Y,
	BALL_SIZE,
	{
		...ballSettings,
		label: 'ball',
	},
);

const ceiling = Matter.Bodies.rectangle(0, 0, 2 * GAME_WIDTH, BORDER, {
	...wallSettings,
	label: 'wall',
});
const floor = Matter.Bodies.rectangle(0, GAME_HEIGHT, 2 * GAME_WIDTH, BORDER, {
	...wallSettings,
	label: 'wall',
});

const leftWall = Matter.Bodies.rectangle(0, 0, BORDER, 2 * GAME_HEIGHT, {
	...wallSettings,
	label: 'wall',
});
const rightWall = Matter.Bodies.rectangle(
	GAME_WIDTH - BORDER,
	0,
	BORDER,
	2 * GAME_HEIGHT,
	{
		...wallSettings,
		label: 'wall',
	},
);
const {Mouse, Bodies, MouseConstraint, Constraint} = Matter;
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
	mouse,
	constraint: {
		stiffness: 0.2,
		render: {
			visible: false,
		},
	},
});

const engine = Matter.Engine.create({enableSleeping: false});
const {world} = engine;

const ground = rightWall;
const rockOptions = {density: 0.004};
let rock = Bodies.circle(170, 450, 8, 20, rockOptions);
const anchor = {x: 170, y: 450};
const elastic = Constraint.create({
	pointA: anchor,
	bodyB: rock,
	stiffness: 0.05,
});

Matter.World.add(world, [
	ball,
	ceiling,
	floor,
	leftWall,
	rightWall,
	// mouseConstraint,
	// rock,
	// elastic,
]);

export default class App extends PureComponent {
	static navigationOptions = {
		header: null,
	};

	state = {
		myScore: 0,
	};

	constructor(props) {
		super(props);

		const {navigation} = this.props;
		this.state.direction = 1;

		this.physics = (entities, {time}) => {
			const {engine} = entities.physics;
			engine.world.gravity.y = 0;
			Matter.Engine.update(engine, time.delta);
			return entities;
		};

		this.moveBall = (entities, {touches}) => {
			// console.log({touches});
			const move = touches.find(x => x.type === 'press');
			if (move) {
				// console.log({
				// 	y: move.event.locationY,
				// 	x: move.event.locationX,
				// });
				const my = move.event.locationY;
				const mx = move.event.locationX;
				const bx = ball.position.x;
				const by = ball.position.y;
				// Matter.Body.setVelocity(ball, {
				// 	y: 0,
				// 	x: -1 * this.state.direction * 3,
				// });
				const angle = (getAngle(mx, my, bx, by) * Math.PI) / 180;
				const vx = Math.cos(angle) * 10;
				const vy = Math.sin(angle) * 10;
				Matter.Body.setVelocity(ball, {
					x: -1 * vx,
					y: -1 * vy,
				});
				this.setState({
					direction: -1 * this.state.direction,
				});
			}

			return entities;
		};
	}

	componentDidMount() {
		Matter.Body.setVelocity(ball, {x: 3, y: 0});
		// Matter.Events.on(engine, 'afterUpdate', () => {
		// 	if (
		// 		mouseConstraint.mouse.button === -1 &&
		// 		(rock.position.x > 190 || rock.position.y < 430)
		// 	) {
		// 		rock = Bodies.polygon(170, 450, 7, 20, rockOptions);
		// 		World.add(engine.world, rock);
		// 		elastic.bodyB = rock;
		// 	}
		// });
	}

	render() {
		return (
			<GameEngine
				style={styles.container}
				systems={[this.physics, this.moveBall]}
				entities={{
					physics: {
						engine,
						world,
					},
					pongBall: {
						body: ball,
						size: [BALL_SIZE, BALL_SIZE],
						position: {
							x: GAME_WIDTH / 2,
							y: GAME_HEIGHT,
						},
						renderer: Circle,
					},
					theCeiling: {
						body: ceiling,
						size: [GAME_WIDTH, BORDER],
						color: '#f9941d',
						renderer: Box,
					},
					theFloor: {
						body: floor,
						size: [GAME_WIDTH, BORDER],
						color: '#f9941d',
						renderer: Box,
					},
					theLeftWall: {
						body: leftWall,
						size: [BORDER, GAME_HEIGHT],
						color: '#f9941d',
						renderer: Box,
					},
					theRightWall: {
						body: rightWall,
						size: [BORDER, GAME_HEIGHT],
						color: '#f9941d',
						renderer: Box,
					},
					// myRock: {
					// 	body: rock,
					// 	size: [BALL_SIZE, BALL_SIZE],
					// 	position: {
					// 		x: GAME_WIDTH / 2,
					// 		y: GAME_HEIGHT,
					// 	},
					// 	renderer: Circle,
					// },
					// myElastic: {
					// 	body: elastic,
					// 	size: [30, 30],
					// 	color: '#f9941d',
					// 	renderer: Box,
					// },
					// mouseConstraint: {
					// 	body: mouseConstraint,
					// 	renderer: {},
					// },
				}}
			/>
		);
	}
}

const styles = {
	container: {
		width: GAME_WIDTH,
		height: GAME_HEIGHT,
		backgroundColor: '#FFF',
		alignSelf: 'center',
	},
};
