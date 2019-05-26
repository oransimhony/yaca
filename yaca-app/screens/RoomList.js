import React, { Component } from 'react';
import { Text, View, FlatList, Alert, TouchableOpacity } from 'react-native';
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

  state = {
    rooms: []
  }

  joinRoom = (roomID) => {
    this.props.navigation.navigate('Chat', { userID: this.props.navigation.getParam('userID'), roomID: roomID })
  }

  componentDidMount() {
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
        <Text style={{ fontSize: 32, paddingBottom: 20, marginLeft: 25 }}>{this.props.navigation.getParam('userID')}</Text>
        <FlatList
          data={this.state.rooms}
          renderItem={({ item }) => <Room item={item} joinRoom={this.joinRoom} />}
          keyExtractor={(item, index) => `${item.id}-${item.index}`}
        />
      </View>
    )
  }
}
