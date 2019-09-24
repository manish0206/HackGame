import React, {Component,useEffect,useState} from 'react';
import {View,Image, Dimensions} from 'react-native';

const BALL_SIZE = 20;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
let shx = 0;
let shy = 0;
  let flag =false;
const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT / 10;

const BORDER_WIDTH = Math.trunc(BALL_SIZE * 0.1);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const PotHole = ({body, color, size: radius, isPivot,images,falseShow}) => {
  const {position} = body;
//data:image/jpeg;base64,'+/storage/emulated/0.stressbuster/1568404404785.jpg
  const {x, y} = position;
  if (!x) {
    return null;
  }
  const {position:positionx}=falseShow;
  if(positionx.x===0&&flag===false){
    shx=getRandomInt(radius);
    shy=getRandomInt(radius);
  }

  if(positionx.x===0&&flag===false){
    flag=true;
  } 
  if(positionx.x!==0&&flag===true){
    flag=false;
  }  

if(images){
  return (<View style={[styles.head,{left: isPivot ? x + radius : x - radius,
          top: isPivot ? y + radius : y - radius}]}>
    <Image  source={{ uri: 'file://'+images}} style={[
        {
          width: 2 * radius || 2 * BALL_SIZE,
          height: 2 * radius || 2 * BALL_SIZE,
          borderRadius: BALL_SIZE * 2,
          // borderWidth: 2 * radius * 0.1 || BORDER_WIDTH,
        },
      ]}/>
      {flag?  <Image  source={require('./smash.png')} style={[
        {
          position:'absolute',
          left: shx,
          top: shy,
          width: BALL_SIZE*3,
          height: BALL_SIZE*3,
          zIndex:10,
          // borderWidth: 2 * radius * 0.1 || BORDER_WIDTH,
        },
      ]}/>: null}
  </View>)
}


  return (
      <Image  source={require('./student.png')} style={[
        styles.head,
        {
          left: isPivot ? x + radius : x - radius,
          top: isPivot ? y + radius : y - radius,
          width: 2 * radius || 2 * BALL_SIZE,
          height: 2 * radius || 2 * BALL_SIZE,
          // borderWidth: 2 * radius * 0.1 || BORDER_WIDTH,
        },
      ]}/>
   );
};

export default PotHole;

const styles = {
  head: {
    backgroundColor: '#ddeeff',
    // borderColor: '#FFC1C1',
    position: 'absolute',
    borderRadius: BALL_SIZE * 2,
  },
};
