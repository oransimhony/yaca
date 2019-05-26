import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';

export default class VideoPlayer extends Component {
  render() {
    return (
      <Video
        source={{
          uri:
            'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        }}
        ref={ref => {
          this.player = ref;
        }}
        style={styles.backgroundVideo}
      />
    );
  }
}

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
})