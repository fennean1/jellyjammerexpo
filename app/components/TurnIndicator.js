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
        <View>
          <View>
            <Image />
          </View>
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
      </Animated.View>
    );
  }
}

let Window = Dimensions.get("window");
let CIRCLE_RADIUS = 25;
let styles = StyleSheet.create({
  text: {
    flex: 1,
    fontSize: 35,
    alignItems: "center",
    textAlign: "center"
    //backgroundColor: "blue"
  }
});

module.exports = TurnIndicator;
