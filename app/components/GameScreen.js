import React, { Component } from "react";
import ReactNative from "react-native";
import { connect } from "react-redux";
import { ActionCreators } from "../actions";
import { bindActionCreators } from "redux";
import SwappableGrid from "../components/SwappableGrid";
//import {App} from './App';
import Dimensions from "Dimensions";

import TurnIndicator from "../components/TurnIndicator";
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
    this.topMargin = 1.5 * TILE_WIDTH + windowHeight / 2 - 4 * TILE_WIDTH;

    this.gameOver = false;

    this.state = {
      tuffysHeadScale: new Animated.Value(1),
      gameModalScale: new Animated.Value(1),
      tuffysHeadLocation: new Animated.ValueXY(0, 0),
      gameModalLocation: new Animated.ValueXY(0, 0),
      numberOfMoves: 25,
      jamScore: 0,
      totalScore: 0,
      beanScore: 0,
      turnScale: new Animated.Value(1)
    };
  }

  animateTuffysHead() {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.tuffysHeadLocation.y, {
        toValue: windowHeight - 2 * TILE_WIDTH,
        friction: 5,
        duration: 1000
      }),
      Animated.timing(this.state.tuffysHeadLocation.y, {
        toValue: windowHeight,
        friction: 10,
        duration: 500
      })
    ]).start();
  }

  endGame() {
    this.gameOver = true;
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.gameModalLocation.y, {
        toValue: 3 * TILE_WIDTH,
        friction: 5,
        duration: 1000
      })
    ]).start();

    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.tuffysHeadLocation.y, {
        toValue: windowHeight - 2 * TILE_WIDTH,
        friction: 5,
        duration: 1000
      })
    ]).start();
  }

  incrementTurns(inc) {
    let scale = 1;
    let { numberOfMoves } = this.state;
    numberOfMoves = numberOfMoves + inc;
    this.setState({ numberOfMoves: numberOfMoves });
    if (this.state.numberOfMoves == 0) {
      this.endGame();
    }
    if (inc < 0) {
      scale = 0.8;
    } else if (inc > 0) {
      scale = 1.5;
    }

    Animated.sequence([
      Animated.timing(this.state.turnScale, {
        toValue: scale,
        duration: 200
      }),
      Animated.timing(this.state.turnScale, {
        toValue: 1.0,
        duration: 150
      })
    ]).start();
  }

  updateScore(beans, jam) {
    let { beanScore } = this.state;
    let { jamScore } = this.state;

    let inc = 0;

    if (beans != 0) {
      inc = 3 * (beans - 2);
    }

    jamScore = jamScore + 3 * jam;
    beanScore = beanScore + inc;
    totalScore = jamScore + beanScore;

    this.setState({ beanScore: beanScore });
    this.setState({ jamScore: jamScore });
    this.setState({ totalScore: totalScore });

    console.log(this.props.screenProps.incrementRedJellyBean());
    console.log(this.props.screenProps.redBeanCount);
  }

  componentWillMount() {
    this.state.tuffysHeadLocation.setValue({
      x: 0,
      y: windowHeight
    });
    this.state.gameModalLocation.setValue({
      x: 0,
      y: -5 * TILE_WIDTH
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    let [translateX, translateY] = [
      this.state.tuffysHeadLocation.x,
      this.state.tuffysHeadLocation.y
    ];

    let scale = this.state.tuffysHeadScale;

    let backButton = (
      <TouchableHighlight
        style={styles.backButton}
        onPress={() => navigate("Root")}
      >
        <Image style={styles.backButtonImage} source={ImageTypes.BACKARROW} />
      </TouchableHighlight>
    );

    let topOfTuffyComponent = (
      <Animated.View
        style={[
          styles.tuffysHeadContainer,
          { transform: [{ translateX }, { translateY }, { scale }] }
        ]}
      >
        <Image style={styles.tuffysHead} source={ImageTypes.TOPOFTUFFYSHEAD} />
      </Animated.View>
    );

    [translateX, translateY] = [
      this.state.gameModalLocation.x,
      this.state.gameModalLocation.y
    ];

    scale = this.state.gameModalScale;

    let gameOverModal = (
      <Animated.View
        style={[
          styles.gameOverModal,
          { transform: [{ translateX }, { translateY }, { scale }] }
        ]}
      >
        <View>
          <Text style={styles.scoreText}>Score: {this.state.totalScore}</Text>
          <Button title={"Play Again?"} onPress={() => navigate("Root")} />
        </View>
      </Animated.View>
    );

    // TODO: D.R.Y.
    const descriptor = gameOver => {
      if (!gameOver) {
        return (
          <View style={styles.topBar}>
            {backButton}
            <Text style={styles.text}>{this.state.totalScore} pts</Text>
            <TurnIndicator
              scale={this.state.turnScale}
              text={this.state.numberOfMoves}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.topBar}>
            {backButton}
            <Text style={styles.scoreText} />
            <View style={styles.turnIndicator}>
              <TurnIndicator scale={this.state.turnScale} text={""} />
            </View>
          </View>
        );
      }
    };

    return (
      <ImageBackground source={justClouds} style={styles.backGroundImage}>
        {descriptor(this.gameOver)}
        <View style={styles.gridContainer}>
          <SwappableGrid
            gameOver={this.gameOver}
            topMargin={this.topMargin}
            animateTuffysHead={this.animateTuffysHead.bind(this)}
            updateScore={this.updateScore.bind(this)}
            incrementTurns={this.incrementTurns.bind(this)}
          />
        </View>
        {topOfTuffyComponent}
        {gameOverModal}
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
  backButton: {
    flex: 1,
    height: TILE_WIDTH,
    justifyContent: "center"
  },
  backButtonImage: {
    height: 0.5 * TILE_WIDTH,
    width: 0.5 * TILE_WIDTH
  },
  turnIndicator: {
    flex: 1,
    //backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center"
  },
  backGroundImage: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center"
  },
  topBarAndGridContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
    //backgroundColor: pink
  },
  bottomBar: {
    alignItems: "center"
    //backgroundColor: "grey"
  },
  gridContainer: {
    height: 5 * TILE_WIDTH,
    width: 5 * TILE_WIDTH,
    alignItems: "center",
    marginTop: windowHeight / 2 - 4 * TILE_WIDTH
    //backgroundColor: blue
  },
  topBar: {
    marginTop: TILE_WIDTH / 2,
    height: TILE_WIDTH,
    flexDirection: "row",
    justifyContent: "center"
    //backgroundColor: yellow
  },
  text: {
    flex: 3,
    //backgroundColor: "#ff51f3",
    textAlign: "center",
    //fontStyle: "ChalkBoard SE",
    fontSize: TILE_WIDTH / 1.5,
    alignItems: "center"
    //color       : '#fff'
  },
  backArrow: {
    //fontSize: 50
    //fontSize: "ChalkBoard SE"
  },
  leaveGameButton: {
    width: TILE_WIDTH,
    height: TILE_WIDTH / 2
  },
  scoreText: {
    alignItems: "center",
    textAlign: "center",
    fontSize: TILE_WIDTH / 1.5
  },
  gameOverModal: {
    position: "absolute",
    height: 4 * TILE_WIDTH,
    width: 4 * TILE_WIDTH,
    backgroundColor: "white",
    borderRadius: TILE_WIDTH,
    flexDirection: "column",
    justifyContent: "center"
  },
  tuffysHeadContainer: {
    position: "absolute",
    height: 2 * TILE_WIDTH,
    width: 3 * TILE_WIDTH
    //backgroundColor: "#c00ffe"
  },
  tuffysHead: {
    position: "absolute",
    height: 2 * TILE_WIDTH,
    width: 3 * TILE_WIDTH
    //backgroundColor: "#c00ffe"
  }
});

module.exports = GameScreen;
