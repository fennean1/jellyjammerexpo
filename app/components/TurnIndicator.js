/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
  ImageBackground
} from "react-native";

import ImageTypes from "../components/ImageTypes";

export default class TurnIndicator extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      //scale: new Animated.Value(1)
    };
  }
  componentDidMount() {
    console.log(
      "this is the window in componentDidMount",
      Dimensions.get("window")
    );

    //this.setState({gridXY: [this.props.gridiX,this.props.gridiY]})
  }

  render() {
    let scale = this.props.scale;

    return (
      <Animated.View style={[{ transform: [{ scale }] }]}>
        <Text style={styles.text}>{this.props.text}</Text>
      </Animated.View>
    );
  }
}

let Window = Dimensions.get("window");
let windowSpan = Math.min(Window.width, Window.height);
let TILE_WIDTH = windowSpan / 6;

let windowWidth = Window.width;
let windowHeight = Window.height;

let styles = StyleSheet.create({
  text: {
    flex: 1,
    fontSize: TILE_WIDTH / 1.5,
    alignItems: "center",
    textAlign: "center"
    //backgroundColor: "blue"
  }
});

module.exports = TurnIndicator;
