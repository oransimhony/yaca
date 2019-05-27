import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, AsyncStorage } from 'react-native';
import axios from 'axios';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      id: ''
    };
  }

  onLoginPressed = () => {
    const { username } = this.state;
    if (username.length === 0) {
      Alert.alert('Login', 'Please provide your username');
      return;
    }

    axios
      .post('http://localhost:5000/users', { username })
      .then(res => {
        this.setState({
          id: res.data.id,
        });
        AsyncStorage.setItem('userID', this.state.id);
        AsyncStorage.setItem('username', this.state.username);
        this.props.navigation.navigate('RoomList', { userID: this.state.id });
      })
      .catch(err => {
        Alert.alert('Login', 'Could not log you in');
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.username}
          onChangeText={username =>
            this.setState({ username: username.trim() })
          }
          placeholder={'Username'}
          style={styles.input}
        />

        <Button title={'Login'} style={styles.input} onPress={this.onLoginPressed} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});