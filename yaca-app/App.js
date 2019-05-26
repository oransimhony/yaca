import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import Login from './screens/Login';
import axios from 'axios';
import Chat from './screens/Chat';
import VideoPlayer from './screens/VideoPlayer';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import RoomList from './screens/RoomList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      id: '',
    };
  }

  onLoginCallBack = username => {
    if (username.length === 0) {
      Alert.alert('Login', 'Please provide your username');
      return;
    }

    axios
      .post('http://localhost:5000/users', { username })
      .then(res => {
        this.setState({
          isAuthenticated: true,
          id: res.data.id,
        });
      })
      .catch(err => {
        Alert.alert('Login', 'Could not log you in');
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {!this.state.isAuthenticated || this.state.currentUser === null ? (
          <View style={styles.container}>
            <Login cb={this.onLoginCallBack} />
          </View>
        ) : (
            <View
              style={[
                { flex: 1, flexDirection: 'column' },
                { backgroundColor: '#ffff' },
              ]}
            >
              {/* <View style={{ flex: 0.4 }}>
                <VideoPlayer style={{ backgroundColor: 'red' }} />
              </View> */}
              <View style={{ flex: 1 }}>
                <Chat userID={this.state.id} />
              </View>
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const AppNavigator = createStackNavigator({
  Login,
  RoomList,
  Chat
});

export default createAppContainer(AppNavigator);