import React, { Component } from "react";
import ReactNative from "react-native";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { bindActionCreators } from "redux";
import SwappableGrid from "../components/SwappableGrid";
//import {App} from './App';
import Dimensions from "Dimensions";

import ImageTypes from "../components/ImageTypes";

import { getJamJarFromBean } from "../components/JamFunctions";

var HomeScreen = require("../components/HomeScreen");

const {
  View,
  Text,
  TouchableHighlight,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
  Animated
} = ReactNative;

let floatingClouds = require("../assets/FloatingClouds.png");
let justClouds = require("../assets/CloudsBackground.png");
let backButton = require("../assets/GreenBackButton.png");
let RedJam = require("../assets/RedJam.png");
let tuffysCartoonHead = require("../assets/TuffyTile.png");
let rowOfJam = require("../assets/JarsOfJam.png");

class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.tuffysHeadHeight = 50;
    this.topMargin = 125;
    this.numberOfMoves = 25;
    this.gameOver = false;

    this.state = {
      tuffysHeadScale: new Animated.Value(1),
      tuffysHeadLocation: new Animated.ValueXY(0, 0),
      numberOfMoves: 25,
      jamScore: 0,
      totalScore: 0,
      beanScore: 0
    };
  }

  animateTuffysHead() {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.tuffysHeadLocation.y, {
        toValue: 0.3 * TILE_WIDTH,
        friction: 5,
        duration: 1000
      }),
      Animated.timing(this.state.tuffysHeadLocation.y, {
        toValue: TILE_WIDTH * 3,
        friction: 10,
        duration: 500
      })
    ]).start();
  }

  incrementTurns(inc) {
    let { numberOfMoves } = this.state;
    numberOfMoves = numberOfMoves + inc;
    this.setState({ numberOfMoves: numberOfMoves });
    if (this.state.numberOfMoves == 0) {
      this.gameOver = true;
    }
  }

  updateScore(beans, jam) {
    let { beanScore } = this.state;
    let { jamScore } = this.state;

    jamScore = jamScore + jam;
    beanScore = beanScore + beans;
    totalScore = beanScore * (jamScore + 1);

    this.setState({ beanScore: beanScore });
    this.setState({ jamScore: jamScore });
    this.setState({ totalScore: totalScore });

    console.log(this.props.screenProps.incrementRedJellyBean());
    console.log(this.props.screenProps.redBeanCount);
  }

  componentWillMount() {
    this.state.tuffysHeadLocation.setValue({
      x: 0,
      y: 2 * TILE_WIDTH
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    let [translateX, translateY] = [
      this.state.tuffysHeadLocation.x,
      this.state.tuffysHeadLocation.y
    ];

    let scale = this.state.tuffysHeadScale;

    let topOfTuffyComponent = (
      <Animated.View
        style={[{ transform: [{ translateX }, { translateY }, { scale }] }]}
      >
        <Image style={styles.tuffysHead} source={ImageTypes.TOPOFTUFFYSHEAD} />
      </Animated.View>
    );

    const descriptor = gameOver => {
      if (!gameOver) {
        return (
          <View style={styles.topBar}>
            <Text style={styles.text}>Score: {this.state.totalScore}</Text>
            <Text style={styles.text}>Turns: {this.state.numberOfMoves}</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.topBar}>
            <Text style={styles.text}>
              Final Score: {this.state.totalScore}
            </Text>
          </View>
        );
      }
    };

    return (
      <ImageBackground source={justClouds} style={styles.backGroundImage}>
        <View style={styles.topBarAndGridContainer}>
          {descriptor(this.gameOver)}
          <View style={styles.gridContainer}>
            <SwappableGrid
              topMargin={this.topMargin}
              animateTuffysHead={this.animateTuffysHead.bind(this)}
              updateScore={this.updateScore.bind(this)}
              incrementTurns={this.incrementTurns.bind(this)}
            />
          </View>
        </View>
        {topOfTuffyComponent}
      </ImageBackground>
    );
  }
}

let Window = Dimensions.get("window");
let windowSpan = Math.min(Window.width, Window.height);
let colored = true;
let TILE_WIDTH = windowSpan / 6;

let windowWidth = Window.width;
let windowHeight = Window.height;

let blue = colored ? "#4286f4" : "#ffffff";
let red = colored ? "#f24646" : "#ffffff";
let yellow = colored ? "#faff7f" : "#ffffff";
let green = colored ? "#31a51a" : "#ffffff";
let orange = colored ? "#ff7644" : "#ffffff";
let pink = colored ? "#ff51f3" : "#ffffff";

let styles = StyleSheet.create({
  footer: {
    height: 2 * TILE_WIDTH
    //backgroundColor: orange
  },
  backGroundImage: {
    width: "100%",
    height: "100%",
    flexDirection: "column"
  },
  topBarAndGridContainer: {
    flex: 1,
    flexDirection: "column"
    //backgroundColor: pink
  },
  gridContainer: {
    flex: 1,
    alignItems: "center"
    //backgroundColor: blue
  },
  topBar: {
    marginTop: 50,
    height: 75,
    justifyContent: "center",
    flexDirection: "row"
    //backgroundColor: yellow
  },
  backButton: {
    marginTop: 30,
    marginLeft: 10,
    height: windowWidth / 10,
    width: windowWidth / 10
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    //backgroundColor: "#ff51f3",
    textAlign: "center",
    fontStyle: "ChalkBoard SE",
    fontSize: 30
    //color       : '#fff'
  },
  container: {
    height: 350,
    width: 350
    //backgroundColor:'#2c3e50'
  },
  tuffysHead: {
    height: 2 * TILE_WIDTH,
    width: 3 * TILE_WIDTH
    //backgroundColor: "#ffffff"
  }
});

module.exports = GameScreen;
