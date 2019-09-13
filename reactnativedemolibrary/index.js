'use strict';

import React from 'react';
import {
  AppRegistry,
  NativeModules,
  StyleSheet,
  Text,
  View
} from 'react-native';

class HelloWorld extends React.Component {

  constructor(props) {
    super(props);
    this.state = {libraryName: ""};
  }

  async componentDidMount() {
    const libraryName = await NativeModules.DemoLibrary.getName();
    this.setState({libraryName});
  }

  render() {
  alert(this.props);
  console.warn(this.props)
  console.log(this.props)
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>Welcome to react native! from{"\n" + this.state.libraryName}</Text>


      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('HelloWorld', () => HelloWorld);
