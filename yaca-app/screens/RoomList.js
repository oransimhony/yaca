import React, { Component } from 'react';
import { Text, View, FlatList, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import axios from 'axios';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { FontAwesome } from '@expo/vector-icons';
import * as config from './config.json'
import { NavigationEvents } from 'react-navigation';

const ip = config.ip;
const CHATKIT_INSTANCE_LOCATOR = config.CHATKIT_INSTANCE_LOCATOR

function Room(props) {
  const { item, joinRoom } = props;
  return (
    <View style={{ flex: 1, borderColor: '#333333', borderWidth: 2, borderRadius: 25, paddingLeft: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 5, paddingVertical: 10 }}>
      <Text style={{ fontSize: 22, paddingVertical: 10 }}>{item.name}:{item.id}</Text>
      <TouchableOpacity style={{ paddingRight: 25 }} onPress={() => joinRoom(item.id, item.name)}><Text style={{ fontSize: 20 }}>Join</Text></TouchableOpacity>
    </View>
  );
}

export default class RoomList extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: 'Chats',
      headerRight: (
        <Text style={{ marginRight: 10 }} onPress={async () => {
          AsyncStorage.removeItem('username');
          AsyncStorage.removeItem('userID');
          navigation.navigate('Auth');
        }}>Logout</Text>
      ),
    }
  };


  state = {
    rooms: [],
    userID: ''
  }

  joinRoom = (roomID, roomName) => {
    this.props.navigation.navigate('Chat', { userID: this.state.userID, roomID: roomID, screenTitle: roomName })
  }

  componentDidMount() {
    this.onMount();
  }

  onMount = async () => {
    await AsyncStorage.getItem('userID').then(val => this.setState({ userID: val }))
    AsyncStorage.getItem('username').then(val => this.setState({ screenTitle: val }, () => this.props.navigation.setParams({ screenTitle: val })));

    const chatManager = new ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: this.state.userID,
      tokenProvider: new TokenProvider({
          url: `http://${ip}:5000/authenticate`,
      }),
  });

  chatManager
      .connect()
      .then(currentUser => {
          this.setState({ currentUser });
          // currentUser.getJoinableRooms()
          //   .then(rooms => {
          //     console.log(JSON.stringify(rooms))
          //   })
          //   .catch(err => {
          //     console.log(`Error getting joinable rooms: ${err}`)
          //   })
      })
      .catch(err => {
          console.log(err);
      });

    this.getRooms();
  }

  getRooms = () => {
    axios.get(`http://${ip}:5000/rooms`)
      .then(res => {
        this.setState({ rooms: res.data })
      })
      .catch(err => {
        Alert.alert(err);
      })
  }

  createRoom = () => {
    this.props.navigation.navigate('CreateRoom', { currentUser: this.state.currentUser })
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <NavigationEvents
          onDidFocus={payload => this.getRooms()}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 28, paddingVertical: 10, marginLeft: 20}}>Hello, {this.state.userID}</Text>
          <TouchableOpacity onPress={this.createRoom} style={{ marginRight: 20, paddingVertical: 10, paddingHorizontal: 12, borderColor: '#333333', borderWidth: 2, borderRadius: '50%', backgroundColor: '#000' }}><FontAwesome name="plus" size={16} color="#fff" style={{  }} /></TouchableOpacity>
        </View>
        <FlatList
          data={this.state.rooms}
          renderItem={({ item }) => <Room item={item} joinRoom={this.joinRoom} />}
          keyExtractor={(item, index) => `${item.id}-${item.index}`}
        />
      </View>
    )
  }
}
