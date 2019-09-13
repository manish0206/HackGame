import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';

const RADIUS = 20;

class Finger extends PureComponent {
	render() {
		if (!this.props.position.x) {
			return null;
		}

		const x = this.props.position.x - RADIUS / 2;
		const y = this.props.position.y - RADIUS / 2;
		console.log({tip: x, top: y, state: this.props.state});
		return <View style={[styles.finger, {left: x, top: y}]} />;
	}
}

const styles = StyleSheet.create({
	finger: {
		borderColor: '#CCC',
		borderWidth: 4,
		borderRadius: RADIUS * 2,
		width: RADIUS * 2,
		height: RADIUS * 2,
		backgroundColor: 'black',
		position: 'absolute'
	}
});

export {Finger};
