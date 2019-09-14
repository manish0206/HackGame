import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Alert,
  Dimensions,
  Button,
  AsyncStorage,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Modal,
  ImageBackground,
} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';
import Circle from './circle';
import PotHole from './pothole';
import Box from './box';
import {Finger} from './finger';
import line from './line';

import {getAngle} from './utility';
import Dialog from 'react-native-popup-dialog';
import {
  ballSettings,
  wallSettings,
  pivotSettings,
  rockSettings,
  potHoleSettings,
} from './settings';



const {Bodies} = Matter;

const BALL_RADIUS = 20;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT / 10;

const BALL_START_POINT_X = GAME_WIDTH / 2;
const BALL_START_POINT_Y = GAME_HEIGHT / 2;

const PIVOT_X = GAME_WIDTH / 3;
const PIVOT_Y = GAME_HEIGHT / 2;

const potHoleX = GAME_WIDTH - 100;
const potHoleY = GAME_HEIGHT / 2;

const BORDER = 15;

const ball = Bodies.circle(
  BALL_START_POINT_X,
  BALL_START_POINT_Y,
  BALL_RADIUS,
  ballSettings,
);
const rock = Bodies.circle(PIVOT_X, PIVOT_Y, BALL_RADIUS, rockSettings);
const pivot = Bodies.circle(PIVOT_X, PIVOT_Y, BALL_RADIUS / 2, pivotSettings);
const ceiling = Bodies.rectangle(
  0,
  -6 * BORDER,
  4 * GAME_WIDTH,
  10 * BORDER,
  wallSettings,
);
const floor = Bodies.rectangle(
  0,
  GAME_HEIGHT + 6 * BORDER,
  4 * GAME_WIDTH,
  10 * BORDER,
  wallSettings,
);
const leftWall = Bodies.rectangle(
  -6 * BORDER,
  0,
  10 * BORDER,
  4 * GAME_HEIGHT,
  wallSettings,
);

const potHole = Bodies.circle(
  potHoleX,
  potHoleY,
  BALL_RADIUS * 2.5,
  potHoleSettings,
);

const falseLine = Bodies.circle(PIVOT_X, PIVOT_Y, BALL_RADIUS, pivotSettings);
const falseShow = Bodies.circle(PIVOT_X, PIVOT_Y, BALL_RADIUS, pivotSettings);

const engine = Matter.Engine.create({enableSleeping: false});
const {world} = engine;

Matter.World.add(world,[ rock, potHole]);

function checkIfBallPotted() {
  const {
    position: {x: px, y: py},
  } = potHole;
  const {
    position: {x: bx, y: by},
  } = rock;
  console.log(potHole.position);
  console.log(rock.position);
  const holePos = {
    left: px - 3.5 * BALL_RADIUS,
    right: px + 1.5 * BALL_RADIUS,
    bottom: py - 1.5 * BALL_RADIUS,
    top: py + 3.5 * BALL_RADIUS,
  };

  const ballPos = {
    left: bx - BALL_RADIUS / 2,
    right: bx + BALL_RADIUS / 2,
    bottom: by - BALL_RADIUS / 2,
    top: by + BALL_RADIUS / 2,
  };

  const overlap =
    ballPos.left > holePos.left &&
    ballPos.right < holePos.right &&
    ballPos.bottom > holePos.bottom &&
    ballPos.top < holePos.top;

  if (overlap) {
    console.log({ballPos, holePos});
  }
  return overlap;
}

_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('bestScore');
    if (value !== null) {
      // We have data!!
    }
  } catch (error) {
    // Error retrieving data
  }
};

_storeData = async score => {
  try {
    await AsyncStorage.setItem('bestScore', score);
  } catch (error) {
    console.log({error});
  }
};

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      myScore: 0,
      ballsLeft: 300,
      gameOver: false,
      shoot: false,
      hold: false,
      ballPotted: false,
      timer: 60,
    };

    this.setModalVisible = visible => {
      this.setState({modalVisible: visible});
    };

    this.physics = (entities, {time}) => {
      const {engine} = entities.physics;
      engine.world.gravity.x = 0;
      // engine.world.gravity.y = 0;
      Matter.Engine.update(engine, time.delta);
      return entities;
    };

    this.resetBall = ({x, y} = {}) => {
      Matter.Body.setPosition(ball, {
        x: x || BALL_START_POINT_X,
        y: y || BALL_START_POINT_Y,
      });
    };

    this.resetRock = ({x, y} = {}) => {
      Matter.Body.setPosition(rock, {
        x: x || PIVOT_X,
        y: y || PIVOT_Y,
      });
    };

    this.stopBall = () => {
      Matter.Body.setVelocity(ball, {
        x: 0,
        y: 0,
      });
      Matter.Body.setAngularVelocity(ball, 0);
    };

    this.stopRock = () => {
      Matter.Body.setVelocity(rock, {
        x: 0,
        y: 0,
      });
      Matter.Body.setAngularVelocity(rock, 0);
    };

    this.handleRestart = () => {
      this.setState(() => ({
        myScore: 0,
        ballsLeft: 300,
        shoot: false,
        hold: false,
        collision: false,
        timer: 60,
        gameOver: false,
      }));
      this.stopBall();
      this.stopRock();
      this.resetBall();
      this.resetRock();

      Matter.Body.setPosition(falseLine, {
        y: 0,
        x: 0,
      });
    };

    this.moveBall = (entities, {touches}) => {
      const move = touches.find(x => x.type === 'press');
      if (move) {
        this.stopRock();
        this.stopBall();
        Matter.Body.setPosition(falseLine, {
          y: 1,
          x: 1,
        });

        this.setState({
          hold: true,
          shoot: false,
          ballPotted: false,
          collision: false,
        });
      }

      return entities;
    };

    this.moveRock = (entities, {touches}) => {
      const move = touches.find(x => x.type === 'move');
      if (move) {
        const moveX = move.event.locationX;
        const moveY = move.event.locationY;

        this.setState({
          hold: true,
          shoot: false,
          ballPotted: false,
          collision: false,
        });

        this.stopRock();
        this.stopBall();
        this.resetBall();

        this.resetRock({
          x: moveX < PIVOT_X ? Math.max(moveX, 50) : Math.min(moveX, 300),
          y:
            moveY < PIVOT_Y
              ? Math.max(moveY, 20)
              : Math.min(moveY, GAME_HEIGHT - 50),
        });

        this.stopRock();
        this.stopBall();
        this.resetBall();

        Matter.Body.setPosition(falseLine, {
          y: 1,
          x: 1,
        });
      }

      return entities;
    };

    this.endHold = (entities, {touches}) => {
      const end = touches.find(x => x.type === 'end');
      if (end) {
        const endX = end.event.locationX;
        const endY = end.event.locationY;
        this.stopRock();
        if (
          endX > 20 &&
          endX < BALL_START_POINT_X - 30 &&
          (endY > 10 && endY < GAME_HEIGHT - 20)
        ) {
          const balls =
            this.state.ballsLeft - 1 < 0 ? 0 : this.state.ballsLeft - 1;
          if (this.state.hold) {
            this.setState({
              hold: false,
              shoot: true,
              gameOver: balls === 0,
              ballsLeft: balls,
              collision: false,
            });
          }

          Matter.Body.setPosition(falseLine, {
            y: 0,
            x: 0,
          });
        } else {
          this.resetRock();
        }
      }

      return entities;
    };
    this.isGameOver = () => {
      // const rockOutside = rock.position.x > GAME_WIDTH;
      // const ballOutside = ball.position.x > GAME_WIDTH;
      // const {collision, ballsLeft} = this.state;
      // const case1 = ballOutside && collision && ballsLeft === 0;
      // const case2 = rockOutside && !collision && ballsLeft === 0;
      // console.log({
      //  case1,
      //  case2,
      //  collision,
      //  ballsLeft,
      //  ballOutside,
      //  rockOutside,
      // });
      if (this.state.timer < 1) {
        this.setState({
          gameOver: true,
        });
      }

      return this.state.timer < 1;
    };
    this.checkIfResetTimer = () => {
      const {timer, ballsLeft} = this.state;
      // console.log({
      //  timer,
      //  ballPos: ball.position,
      //  rockPos: rock.position,
      //  ballvelo: ball.velocity,
      //  ballsLeft,
      // });
      if (timer < 0 || timer === 0) {
        return true;
      }

      //      if (ball.position.x > GAME_WIDTH + 20) {
      //        return true;
      //      }
      //
      //      if (
      //        rock.position.x > GAME_WIDTH &&
      //        (ball.velocity.x > 0 || ball.velocity.y > 0)
      //      ) {
      //        return true;
      //      }
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount(): Promise<void> {
    this.interval = setInterval(
      () =>
        this.setState(prevState => ({
          timer: this.state.gameOver ? prevState.timer : prevState.timer - 1,
        })),
      1000,
    );
    // Matter.Events.on(engine, 'collisionStart', event => {
//      var pairs = event.pairs;
//      // console.log({pairs});
//      const x1 = rock.position.x;
//      const x2 = ball.position.x;
//      const y1 = rock.position.y;
//      const y2 = ball.position.y;
//      const angle = (getAngle(x1, x2, y1, y2) * Math.PI) / 180;
//      const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
//      const vx = Math.cos(angle) * 0.002 * distance;
//      const vy = Math.sin(angle) * 0.002 * distance;
// 
//      // console.log({distance});
//      if (distance <= 2 * BALL_RADIUS) {
//        this.setState({
//          collision: true,
//        });
//        // console.log({collision: true});
//      }
//    });
    AsyncStorage.getItem('bestScore')
      .then(value => {
        this.setState({bestScore: Number(value)});
      })
      .catch(console.log)
      .done();



    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (ball.velocity.x > 10) ball.velocity.x = 10;
      if (ball.velocity.x < -10) ball.velocity.x = -10;
      if (ball.velocity.y > 10) ball.velocity.y = 10;
      if (ball.velocity.y < -10) ball.velocity.y = -10;

      if (rock.velocity.x > 10) rock.velocity.x = 10;
      if (rock.velocity.x < -10) rock.velocity.x = -10;
      if (rock.velocity.y > 10) rock.velocity.y = 10;
      if (rock.velocity.y < -10) rock.velocity.y = -10;
      const py =
        SCREEN_HEIGHT / 2 -
        30 -
        100 * Math.sin(engine.timing.timestamp * 0.001);
      Matter.Body.setPosition(potHole, {
        x: SCREEN_WIDTH - BALL_RADIUS * 2,
        y: py,
      });
      if (
        checkIfBallPotted() &&
        rock.position.x !== PIVOT_X &&
        !this.state.ballPotted
      ) {
        Matter.Body.setPosition(falseShow, {
        y: 0,
        x: 0,
      });
    Matter.Body.setPosition(rock, {
        y: 10000,
        x: PIVOT_X,
      });
        this.stopRock();
        this.stopBall();
        let score = this.state.myScore;
        setTimeout(() => {
          
          score = this.state.myScore + 1;
          // console.log({state2: this.state});
          this.setState({
            myScore: this.state.myScore + 1,
            ballPotted: true,
            ballsLeft: Math.min(this.state.ballsLeft, 300),
          });
        }, 30);
setTimeout(() => {
  Matter.Body.setPosition(falseShow, {
        y: PIVOT_Y,
        x: PIVOT_X,
      });
},1000);
        if (score >= this.state.bestScore) {
          this.setState({bestScore: score});
          _storeData(score.toString());
        }
      }

      // if (
      //  ball.position.x > GAME_WIDTH ||
      //  ball.position.x < -50 ||
      //  ball.position.y > GAME_HEIGHT ||
      //  ball.position.y < 0
      // ) {
      //  this.stopRock();
      //  this.resetRock();
      //  if (this.state.ballsLeft > 0) {
      //    this.stopBall();
      //    this.resetBall({
      //      x: BALL_START_POINT_X,
      //      y: BALL_START_POINT_Y,
      //    });
      //  }
      // }
    });
  }

  componentDidUpdate() {
    this.isGameOver();
    // if (this.checkIfResetTimer()) {
    //  this.setState({
    //    timer: this.state.ballsLeft === 0 ? 0 : 10,
    //    ballsLeft: this.state.ballsLeft - 1 < 0 ? 0 : this.state.ballsLeft - 1,
    //  });
    // }
    if (this.state.shoot) {
      const x1 = rock.position.x;
      const x2 = pivot.position.x;
      const y1 = rock.position.y;
      const y2 = pivot.position.y;

      // const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      // const angle = getAngle(x1, y1, x2, y2);
      this.setState({
        shoot: false,
      });

      const xforce = (pivot.position.x - rock.position.x) * 0.00015;
      const yforce = (pivot.position.y - rock.position.y) * 0.00015;

      // this.resetRock();
      this.stopRock();

      Matter.Body.applyForce(
        rock,
        {x: x2, y: y1},
        {
          x: xforce < 0.04 ? xforce : 0.04,
          y: yforce < 0.04 ? yforce : 0.04,
        },
      );
    }
  }

  render() {
    const {images}=this.props;
    return (
      <ImageBackground source={require('./stress_7.jpg')} style={{width: '100%', height: '100%'}}>
      <GameEngine
        style={styles.container}
        systems={[this.physics, this.moveBall, this.moveRock, this.endHold]}
        entities={{
          physics: {
            engine,
            world,
          },
          myPivot: {
            body: pivot,
            renderer: Circle,
            color: '#000',
            size: BALL_RADIUS / 2,
            isPivot: true,
            isImage:false,
          },
          myPotHole: {
            body: potHole,
            renderer: PotHole,
            color: '#000',
            images,
            size: BALL_RADIUS * 2.5,
            falseShow,
          },
          myFinger: {
            body: rock,
            state: this.state,
            renderer: Circle,
            color: 'green',
            isImage:true,
          },
          myline: {
            rock,
            pivot,
            falseLine,
            renderer: line,
          },
        }}>
        <View style={styles.timer}>
          <Text style={styles.scoreValue}>
            time left: {this.state.ballsLeft === 0 ? 0 : this.state.timer}
          </Text>
        </View>
        <View style={styles.scoresContainer}>
          <View style={styles.score}>
            <Text style={styles.scoreValue}> score: {this.state.myScore}</Text>
          </View>
        </View>
        <View style={styles.bestScoreContainer}>
          <View style={styles.score}>
            <Text style={styles.scoreValue}>
              {' '}
              best score: {this.state.bestScore}
            </Text>
          </View>
        </View>

        <View style={styles.ballsLeft}>
          <View style={styles.score}>
            <Text style={styles.scoreValue}>
              balls left: {Math.max(this.state.ballsLeft, 0)}
            </Text>
          </View>
        </View>
        {/* <Dialog */}
        {/*   onDismiss={() => { */}
        {/*     this.setState({gameOver: false}); */}
        {/*   }} */}
        {/*   onTouchOutside={() => { */}
        {/*     this.setState({gameOver: false}); */}
        {/*   }} */}
        {/*   zIndex={1000} */}
        {/*   visible={this.state.gameOver} */}
        {/*   onTouchOutside={() => {}} */}
        {/*   backgroundStyle={styles.customBackgroundDialog} */}
        {/*   dialogStyle={{ */}
        {/*     backgroundColor: '#968d83', */}
        {/*     margin: 15, */}
        {/*   }} */}
        {/*   visible={this.state.ballsLeft === -1}> */}
        {/*   <TouchableWithoutFeedback */}
        {/*     onPress={() => this.handleRestart(false)} */}
        {/*     style={[styles.gameOver]}> */}
        {/*     <View style={styles.gameOver}> */}
        {/*       <Text style={styles.score}>GAME OVER</Text> */}
        {/*       <Text style={styles.score}>Try Again</Text> */}
        {/*     </View> */}
        {/*   </TouchableWithoutFeedback> */}
        {/* </Dialog> */}

        <View style={{marginTop: 22}}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.gameOver}
            presentationStyle="overFullScreen">
            <View style={styles.gameOver}>
              <View>
                <Text style={styles.text}>GAME OVER!</Text>

                <TouchableHighlight
                  onPress={() => {
                    this.setState({
                      gameOver: false,
                    });
                    this.handleRestart();
                  }}>
                  <Text style={styles.text1}>Try again?</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
      </GameEngine>
      </ImageBackground>
    );
  }
}

const styles = {
  container: {
    width: GAME_WIDTH + 50,
    height: GAME_HEIGHT + 50,
    //backgroundColor: '#000',
    alignSelf: 'center',
    flex: 1,
    resizeMode: 'stretch', // 'cover', //
  },
  scoresContainer: {
    position: 'absolute',
    left: 30,
    top: 30,
    flex: 1,
    alignItems: 'center',
  },
  bestScoreContainer: {
    position: 'absolute',
    left: GAME_WIDTH / 2,
    top: 30,
    flex: 1,
    alignItems: 'center',
  },
  timer: {
    position: 'absolute',
    left: GAME_WIDTH / 5,
    top: 30,
    flex: 1,
    alignItems: 'center',
  },
  gameOver: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    opacity: 1,
    backgroundColor: '#420b07',
    color: 'white',
    padding: 30,
    
    marginTop: 40,
    justifyContent: 'center',
    top: '22%',
    left: '43%',
    borderRadius: 10,
  },
  text: {
    
    color: 'white',
    fontSize: 40,
    fontWeight: '400',
  },
  text1:{
    
    color: 'white',
    fontSize: 20,
    fontWeight: '200',
  },
  ballsLeft: {
    position: 'absolute',
    left: GAME_WIDTH - 150,
    top: 30,
    flex: 1,
    alignItems: 'center',
  },
  score: {
    flexDirection: 'row',
  },
  scoreLabel: {
    fontSize: 20,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
};
