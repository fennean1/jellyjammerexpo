/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// TODO Write the condenseColumns function so that it takes the indexes instead of the color.
// Pass "data" around instead of constantly referring to "state" this makes it so that we don't have to
// set state as ofter

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  TouchableHighlight,
  ImageBackground
} from "react-native";

import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

// import Number from './Number';
import Draggable from "./Draggable";
import Tile from "./Tile";
// import Viewport from './app/Viewport';

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

import imageType from "../components/ImageTypes";

import { getJamJarFromBean, isJam } from "../components/JamFunctions";

let firstLoad = true;

let boardWidth = 5;
let boardHeight = 5;

let speed = 300;

class TileData {
  constructor(img, index, key) {
    // The number of matches that a tile exits within.
    this.matchMemberships = 0;
    this.index = index;
    this.fadeAnimation = new Animated.Value(1);
    this.key = key;
    this.location = new Animated.ValueXY();
    this.imageType = img;
    this.rotation = new Animated.Value(0);
    this.scale = new Animated.Value(1);
    this.view = <Image source={img} style={styles.tile} />;
  }

  setView(imageType) {
    this.imageType = imageType;
    this.view = <Image source={imageType} style={styles.tile} />;
  }
}

const animationType = {
  SWAP: 0,
  FALL: 1
};

const rowOrCol = {
  ROW: 0,
  COLUMN: 1
};

const beans = [
  imageType.BLUEJELLYBEAN,
  imageType.PINKJELLYBEAN,
  imageType.PURPLEJELLYBEAN,
  imageType.YELLOWJELLYBEAN,
  imageType.ORANGEJELLYBEAN,
  imageType.GREENJELLYBEAN,
  imageType.REDJELLYBEAN,
  imageType.REDJAM,
  imageType.BLUEJAM,
  imageType.ORANGEJAM,
  imageType.PURPLEJAM,
  imageType.GREENJAM,
  imageType.PINKJAM,
  imageType.PURPLEJAM,
  imageType.YELLOWJAM
];

var cancelTouches = false;

export default class Swappables extends Component<{}> {
  constructor(props) {
    super(props);

    // Inititalize to swipe up, will change later.
    this.swipeDirection = swipeDirections.SWIPE_UP;

    // Speed of the animations
    this.speed = 100;
    this.animationState = animationType.SWAP;
    this.currentDirection = rowOrCol.ROW;
    this.otherDirection = rowOrCol.COLUMN;

    this.state = {
      origin: [0, 0],
      width: 0,
      height: 0,
      tileComponents: [],
      tileDataSource: [[new TileData()]],
      topMargin: this.props.topMargin,
      JamJarLocation: new Animated.ValueXY(),
      JamJarComponent: <View />,
      JamJarScaleX: new Animated.Value(1),
      JamJarScaleY: new Animated.Value(1),
      JamJar: imageType.REDJAM
    };
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  onSwipe(gestureName, gestureState) {
    let initialGestureX = gestureState.x0;
    let initialGestureY = gestureState.y0;

    this.props.incrementTurns(-1);

    // Need to get convert location of swipe to an index.

    let i = Math.round(
      (initialGestureX - this.state.origin[0] - 0.5 * TILE_WIDTH) / TILE_WIDTH
    );
    let j = Math.round(
      (initialGestureY -
        this.state.topMargin -
        this.state.origin[1] -
        0.5 * TILE_WIDTH) /
        TILE_WIDTH
    );

    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName: gestureName });

    //  TODO: Make sure that the boundary conditions 0 and 4 aren't HARDCODED
    switch (gestureName) {
      case SWIPE_UP:
        console.log("An upward swipe has been registered");

        if (j > 0) {
          this.swipeDirection = SWIPE_UP;
          this.swap(i, j, 0, -1);
        }

        break;
      case SWIPE_DOWN:
        console.log("A downward swipe has been registered");

        if (j < 4) {
          this.swipeDirection = SWIPE_DOWN;
          this.swap(i, j, 0, 1);
        }

        break;
      case SWIPE_LEFT:
        console.log("A left swipe has been registered");

        if (i > 0) {
          this.swipeDirection = SWIPE_LEFT;
          this.swap(i, j, -1, 0);
        }

        break;
      case SWIPE_RIGHT:
        console.log("A right swipe has been registered");

        if (i < 4) {
          this.swipeDirection = SWIPE_RIGHT;
          this.swap(i, j, 1, 0);
        }
        break;
    }
  }

  // data - the array of
  pushTileDataToComponent() {
    console.log("Pushing Tile Data");

    var a = [];
    // This creates the array of Tile components that is stored as a state variable.
    this.state.tileDataSource.map((row, i) => {
      let rows = row.map((e, j) => {
        a.push(
          <Tile
            location={e.location}
            scale={e.scale}
            key={e.key}
            rotation={e.rotation}
            subview={e.view}
          />
        );
      });
      // This is where the error occurs where an element no longer receives touches.
      // Don't wrap this in a view.
      return;
      rows;
    });

    this.setState({
      tileComponents: a
    });
  }

  // takes the indexes that will be animated and
  animateBeanMatch(indexesToAnimate, location) {
    let locationToAnimateTo = [
      location[0] * TILE_WIDTH,
      location[1] * TILE_WIDTH
    ];

    let len = indexesToAnimate.length;

    for (var n = 0; n < len; n++) {
      let e = indexesToAnimate[n];

      let i = e[0];
      let j = e[1];

      Animated.sequence([
        Animated.delay(350),
        Animated.timing(this.state.tileDataSource[i][j].scale, {
          toValue: 1.05,
          duration: 150
        }),
        Animated.timing(this.state.tileDataSource[i][j].scale, {
          toValue: 1,
          duration: 150
        }),
        Animated.timing(this.state.tileDataSource[i][j].location, {
          toValue: { x: locationToAnimateTo[0], y: locationToAnimateTo[1] },
          duration: this.speed
        })
      ]).start(() => {});
    }
  }

  condenseColumns(beanIndexes) {
    console.log("condensing this data", beanIndexes);

    let spotsToFill = 0;
    // HARDCODED!
    for (let i = 0; i < 5; i++) {
      spotsToFill = 0;

      // Iterate through each column
      for (let j = 4; j >= 0; j--) {
        let n = beanIndexes.filter(e => {
          return i == e[0] && j == e[1];
        });

        // Check to see if the element is a spot that needs filling.
        if (n.length != 0) {
          // Increment the spots to fill...since we found a spot to fill.
          spotsToFill++;
          // Place the location above the top of the screen for when it "falls"
          this.state.tileDataSource[i][j].location.setValue({
            x: TILE_WIDTH * i,
            y: -3 * TILE_WIDTH
          });
        } else if (spotsToFill > 0) {
          // Swap
          const currentSpot = this.state.tileDataSource[i][j];
          const newSpot = this.state.tileDataSource[i][j + spotsToFill];

          this.state.tileDataSource[i][j] = newSpot;
          this.state.tileDataSource[i][j + spotsToFill] = currentSpot;
        }
      }
    }
  }

  sharedIndex(arrOne, arrTwo) {
    let match = [];
    arrOne.map((u, i) => {
      arrTwo.map((v, j) => {
        if (u[0] == v[0] && u[1] == v[1]) {
          match = u;
        }
      });
    });
    return match;
  }

  // Test console.log("What index do each of these two arrays share? [[2,3],[2,4],[2,5]]  [[1,3],[2,3],[2,3] ]",this.shareIndex([[2,3],[2,4],[2,5]], [[2,3],[2,4],[2,5]]))

  containsIndexPair(arr, pair) {
    let a = arr.filter(e => e[0] == pair[0] && e[1] == pair[1]);
    return a.length !== 0;
  }

  //Remove the spot where the jar needs to go
  removeIndexes(arr, indexes) {
    let filteredArray = [];

    if (indexes.length == 0) {
      return arr;
    } else {
      indexes.map(index => {
        filteredArray = arr.filter(e => {
          let firstAreEqual = e[0] == index[0];
          let secondAreEqual = e[1] == index[1];
          b = !(firstAreEqual && secondAreEqual);

          return b;
        });
        arr = filteredArray;
      });

      return filteredArray;
    }
  }

  swap(i, j, dx, dy) {
    let swipeBeganAt = [i, j];
    let swipeDirectedAt = [i + dx, j + dy];

    let indexesWithStarterColor = [[]];
    let indexesWithEnderColor = [[]];

    const newData = this.state.tileDataSource;

    const swapStarter = this.state.tileDataSource[i][j];
    const swapEnder = this.state.tileDataSource[i + dx][j + dy];

    const firstJamToJam = this.state.tileDataSource[i][j].imageType;
    const secondJamToJam = this.state.tileDataSource[i + dx][j + dy].imageType;

    // Perform the swap
    newData[i][j] = swapEnder;
    newData[i + dx][j + dy] = swapStarter;

    this.updateGrid();
  }

  // TODO: Have the

  // Handles swipe events
  updateGrid() {
    // The amount of jam and numbers of beans gathered in this swipe.
    let beansThisTurn = 0;
    let jamThisTurn = 0;

    //  BEGIN LOOP

    let allMatches = this.allMatchesOnBoard();

    if (allMatches.length != 0) {
      let duplicates = this.returnDuplicates(allMatches);

      let indexesToRemove = [];
      let jars = [];
      if (duplicates.length != 0) {
        // x is the array of matches that share an index
        let withSharedIndexes = duplicates.map(e => {
          let allWithIndex = this.allWithIndex(allMatches, e);
          if (allWithIndex.length > 0) {
            return allWithIndex;
          } else {
            return [];
          }
        });

        withSharedIndexes.map((row, i) => {
          // Animate to the index that they share
          let animateTo = this.sharedIndex(row[0], row[1]);
          let jar = null;
          row.map(match => {
            let i = match[0][0];
            let j = match[0][1];
            if (isJam(this.state.tileDataSource[i][j].imageType)) {
              this.animateBeanMatch(match, [1, 10]);
              jamThisTurn += match.length;
              this.props.animateTuffysHead();
            } else {
              jar = getJamJarFromBean(
                this.state.tileDataSource[i][j].imageType
              );
              this.state.tileDataSource[animateTo[0]][animateTo[1]].setView(
                jar
              );
              this.animateBeanMatch(match, animateTo);
              beansThisTurn += match.length;
              indexesToRemove.push(animateTo);
            }
          });
        });
      } else {
        allMatches.map(match => {
          if (
            isJam(this.state.tileDataSource[match[0][0]][match[0][1]].imageType)
          ) {
            this.animateBeanMatch(match, [1, 10]);
            this.props.animateTuffysHead();
            jamThisTurn += match.length;
          } else {
            jar = getJamJarFromBean(
              this.state.tileDataSource[match[0][0]][match[0][1]].imageType
            );
            this.state.tileDataSource[match[0][0]][match[0][1]].setView(jar);
            this.animateBeanMatch(match, match[0]);
            beansThisTurn += match.length;
            indexesToRemove.push(match[0]);
          }
        });
      }

      this.props.updateScore(beansThisTurn, jamThisTurn);

      // TODO: WRite a function that removes an array of indexes so I don't have to keep slicing away and I can control what gets "condensed"

      allMatches = allMatches.map(match => {
        return this.removeIndexes(match, indexesToRemove);
      });

      // Waits for "animate match" to complete.
      setTimeout(() => {
        // Prepare the animation state
        this.animationState = animationType.FALL;

        // Recolor the matches with new random colors.

        allMatches.map(match => {
          this.recolorMatches(match);
          this.condenseColumns(match);
        });

        this.pushTileDataToComponent();

        setTimeout(() => {
          if (this.allMatchesOnBoard().length != 0) {
            console.log("Hello! Calling update grid again");
            this.updateGrid();
          }
        }, 1200);

        this.animationState = animationType.SWAP;
      }, 1200);
    }
  }

  componentDidUpdate() {
    // !!! Make this take a "Type" and perform an animation based on the
    // type of update that's occured. ie swipe, condense, load.

    switch (this.animationState) {
      case animationType.SWAP:
        this.animateValuesToLocationsSwapStyle();
        break;
      case animationType.FALL:
        this.animateValuesToLocationsWaterfalStyle();
        break;
    }
  }

  componentWillMount() {
    // Grid that contains the keys that will be assigned to each tile via map
    let keys = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24]
    ];

    var tileData = keys.map((row, i) => {
      let dataRows = row.map((key, j) => {
        let beans = [
          imageType.BLUEJELLYBEAN,
          imageType.PINKJELLYBEAN,
          imageType.PURPLEJELLYBEAN,
          imageType.YELLOWJELLYBEAN,
          imageType.ORANGEJELLYBEAN,
          imageType.GREENJELLYBEAN,
          imageType.REDJELLYBEAN,
          imageType.REDJAM,
          imageType.BLUEJAM,
          imageType.ORANGEJAM,
          imageType.PURPLEJAM,
          imageType.GREENJAM,
          imageType.PINKJAM,
          imageType.PURPLEJAM,
          imageType.YELLOWJAM
        ];

        let randIndex = this.getRandomInt(7);

        let data = new TileData(beans[randIndex], [i, j], key);

        return data;
      });

      return dataRows;
    });

    this.setState({ tileDataSource: tileData });
  }

  onLayout(event) {
    console.log("onLayout event", event.nativeEvent);

    // This does not need to be a state variable
    this.setState({
      origin: [event.nativeEvent.layout.x, event.nativeEvent.layout.y]
    });
  }

  componentDidMount() {
    var a = [];
    // This creates the array of Tile components that is stored as a state variable
    this.state.tileDataSource.map((row, i) => {
      let rows = row.map((e, j) => {
        a.push(
          <Tile
            location={e.location}
            scale={e.scale}
            key={e.key}
            subview={e.view}
          />
        );
      });
      // This is where the error occurs where an element no longer receives touches.
      // Don't wrap this in a view.
      return;
      rows;
    });

    this.setState({ tileComponents: a });
  }

  isMatch(itemOne, itemTwo) {
    if (itemOne.imageType == itemTwo.imageType) {
      return true;
    } else if (isJam(itemOne.imageType) && isJam(itemTwo.imageType)) {
      return true;
    }
  }

  checkRowColForMatch(coordinate, direction) {
    let consecutives = [];

    for (i = 0; i < 4; i++) {
      // If its a column,check the next item in the column
      // Inistialize these to zero and then decide which one will be iterated and which will be held consant.
      let x = 0;
      let y = 0;

      // Used to whether the next itme should be on the left or on the right.
      let dx = 0;
      let dy = 0;

      if (direction == rowOrCol.COLUMN) {
        x = coordinate[0];
        y = i;
        dy = 1;
      } else if (direction == rowOrCol.ROW) {
        x = i;
        dx = 1;
        y = coordinate[1];
      }

      let firstItem = this.state.tileDataSource[x][y];
      let nextItem = this.state.tileDataSource[x + dx][y + dy];

      if (this.isMatch(firstItem, nextItem)) {
        consecutives.push([x, y]);

        // Check if I've reached the end of the loop.
        if (i == 3) {
          consecutives.push([x + dx, y + dy]);
        }
      } else {
        // Push the last item in the sequence of matches
        consecutives.push([x, y]);
        if (consecutives.length >= 3) {
          console.log("returning consecutives");
          return consecutives;
        } else {
          // Reset
          consecutives = [];
        }
      }
    }

    if (consecutives.length >= 3) {
      return consecutives;
    } else {
      return [];
    }
  }

  areIndexesEqual(pairOne, pairTwo) {
    return a[0] == e[0] && a[1] == e[1];
  }

  // Returns all arrays that have an index of "index" within them. For two dimensional array.
  allWithIndex(arr, index) {
    let withIndex = [];
    arr.map(row => {
      if (this.containsIndexPair(row, index)) {
        withIndex.push(row);
      }
    });
    return withIndex;
  }

  returnDuplicates(arr) {
    // Destructure the two dimensional array to a 1D
    let stream = [];
    arr.map(row => {
      row.map(e => {
        stream.push(e);
      });
    });

    let dups = [];
    let x = stream.map((e, i) => {
      if (stream.slice(i).length > 1) {
        let iterator = stream.slice(i + 1);

        if (this.containsIndexPair(iterator, e)) {
          dups.push(e);
        }
      }
    });
    return dups;
  }

  removeDuplicates(arr) {
    let x = arr.map((e, i) => {
      let iterator = x.slice(i);
      if (this.containsIndexPair(iterator, e)) {
        arr.splice(0, 1);
      }
    });

    return arr;
  }

  allMatchesOnBoard() {
    let matches = [];

    for (let i = 0; i < 5; i++) {
      // Check to find all the rows that have matches.
      let rowMatch = this.checkRowColForMatch([0, i], rowOrCol.ROW);
      if (rowMatch.length > 0) {
        matches.push(rowMatch);
      }
      // Check to find all the columns that have matches
      let colMatch = this.checkRowColForMatch([i, 0], rowOrCol.COLUMN);
      if (colMatch.length > 0) {
        matches.push(colMatch);
      }
    }

    return matches;
  }

  // Gets all indexes with a specific color.
  getIndexesWithColor(color) {
    let colorIndexes = new Array();

    let x = this.state.tileDataSource.map((row, i) => {
      let colorRow = row.map((e, j) => {
        if (e.imageType == color) {
          colorIndexes.push([i, j]);
        } else if (isJam(e.imageType) && isJam(color)) {
          colorIndexes.push([i, j]);
        }
      });
    });
    return colorIndexes;
  }

  // Animates the values in the tile data source based on their index in the array.
  animateValuesToLocationsSwapStyle() {
    this.state.tileDataSource.map((row, i) => {
      row.map((elem, j) => {
        Animated.timing(
          //Step 1
          elem.location, //Step 2
          {
            toValue: { x: TILE_WIDTH * i, y: TILE_WIDTH * j },
            duration: this.speed
          } //Step 3
        ).start();
        //Animated.timing(elem.scale,{toValue: 1,duration: 1000}).start()
      });
    });
  }

  // Animates the values in the tile data source based on their index in the array.
  animateValuesToLocationsWaterfalStyle() {
    this.state.tileDataSource.map((row, i) => {
      row.map((elem, j) => {
        Animated.spring(
          //Step 1
          elem.location, //Step 2
          { toValue: { x: TILE_WIDTH * i, y: TILE_WIDTH * j }, friction: 4 } //Step 3
        ).start();
        //Animated.timing(elem.scale,{toValue: 1,duration: 1000}).start()
      });
    });
  }

  recolorMatches(neighbors) {
    neighbors.map(e => {
      let i = e[0];
      let j = e[1];
      let randIndex = this.getRandomInt(7);

      this.state.tileDataSource[i][j].setView(beans[randIndex]);
    });
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    // Only swipe if cancelTouches is false.
    let swipeOrNot = cancelTouches
      ? (direction, state) => {
          return;
        }
      : (direction, state) => this.onSwipe(direction, state);

    return (
      <View style={styles.container} onLayout={this.onLayout.bind(this)}>
        <View>
          <GestureRecognizer
            config={config}
            style={styles.gestureContainer}
            onSwipe={(direction, state) => swipeOrNot(direction, state)}
          >
            {this.state.tileComponents}
          </GestureRecognizer>
        </View>
      </View>
    );
  }
}

let Window = Dimensions.get("window");
let windowSpan = Math.min(Window.width, Window.height);
let TILE_WIDTH = windowSpan / 6;

let windowWidth = Window.width;
let windowHeight = Window.height;

let blue = "#4286f4";
let red = "#f24646";
let yellow = "#faff7f";
let green = "#31a51a";
let orange = "#ff7644";
let pink = "#ff51f3";

let styles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    width: 300,
    height: 300
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  mainView: {
    flex: 1,
    alignItems: "center"
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: red
  },
  gestureContainer: {
    flex: 1
  },
  container: {
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 5
    //backgroundColor: red,
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_WIDTH
  }
});
