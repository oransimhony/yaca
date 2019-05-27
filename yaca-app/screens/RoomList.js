import React, { Component } from 'react';
import { Text, View, FlatList, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import axios from 'axios';

function Room(props) {
  const { item, joinRoom } = props;
  return (
    <View style={{ flex: 1, borderColor: '#333333', borderWidth: 2, borderRadius: 15, paddingLeft: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 5 }}>
      <Text style={{ fontSize: 22, paddingVertical: 10 }}>{item.name} {item.id}</Text>
      <TouchableOpacity style={{ paddingRight: 25 }} onPress={() => joinRoom(item.id)}><Text>Join</Text></TouchableOpacity>
    </View>
  );
}

export default class RoomList extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.screenTitle : 'Title',
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

  joinRoom = (roomID) => {
    this.props.navigation.navigate('Chat', { userID: this.state.userID, roomID: roomID })
  }

  componentDidMount() {
    AsyncStorage.getItem('userID').then(val => this.setState({ userID: val }))
    AsyncStorage.getItem('username').then(val => this.setState({ screenTitle: val }, () => this.props.navigation.setParams({ screenTitle: val })));

    axios.get('http://localhost:5000/rooms')
      .then(res => {
        console.log(res.data);
        this.setState({ rooms: res.data })
      })
      .catch(err => {
        Alert.alert(err);
      })
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <Text style={{ fontSize: 32, paddingBottom: 20, marginLeft: 25 }}>Room List</Text>
        <FlatList
          data={this.state.rooms}
          renderItem={({ item }) => <Room item={item} joinRoom={this.joinRoom} />}
          keyExtractor={(item, index) => `${item.id}-${item.index}`}
        />
      </View>
    )
  }
}
