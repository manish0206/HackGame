const defaultCategory = 0x0001;
const rightWallCategory = 0x0002;
const potHoleCategory = 0x0003;

const wallSettings = {
	isStatic: true,
	inertia: 0,
	friction: 0,
	frictionStatic: 0,
	frictionAir: 0,
	restitution: 1,
	collisionFilter: {
		mask: defaultCategory
	}
};

const ballSettings = {
	inertia: 0,
	friction: 0.1,
	frictionStatic: 0,
	frictionAir: 0,
	restitution: 1,
	collisionFilter: {
		mask: defaultCategory
	}
};

const rockSettings = {
	inertia: 0,
	friction: 0.1,
	frictionStatic: 0,
	frictionAir: 0,
	restitution: 1,
	collisionFilter: {
		mask: defaultCategory
	}
};

const potHoleSettings = {
	collisionFilter: {
		mask: rightWallCategory
	},
	label: 'pothole4'
};

const rightWallSettings = {
	...wallSettings,
	collisionFilter: {
		mask: rightWallCategory
	},
	label: 'wall4'
};

const pivotSettings = {density: 0.004};

module.exports = {
	ballSettings,
	wallSettings,
	pivotSettings,
	rockSettings,
	potHoleSettings,
	rightWallSettings
};
