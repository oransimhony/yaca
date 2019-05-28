import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default class CreateRoom extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Create Room'
    }
  }

  state = {
    roomName: ""
  }

  createRoom = () => {
    if(this.state.roomName.trim().length == 0) alert("Error", "Room name cannot be empty")
    const currentUser = this.props.navigation.getParam('currentUser')
    currentUser.createRoom({
      name: this.state.roomName,
      private: false,
    }).then(room => {
      console.log(`Created room called ${room.name}`)
      this.props.navigation.goBack();
    })
    .catch(err => {
      console.log(`Error creating room ${err}`)
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ padding: 20, fontSize: 26 }}>Create a new Room</Text>
        <TextInput placeholder="Room name" style={{ borderWidth: 2, borderColor: "#333", margin: 10, padding: 10 }} value={this.state.roomName} onChangeText={(text) => this.setState({ roomName: text })} />
        <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity style={{ }} onPress={this.createRoom}><Text>Create Room</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}