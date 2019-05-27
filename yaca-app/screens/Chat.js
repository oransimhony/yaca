import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { GiftedChat } from 'react-native-gifted-chat';
import * as config from './config.json'

const ip = config.ip;
const CHATKIT_INSTANCE_LOCATOR = config.CHATKIT_INSTANCE_LOCATOR
const CHATKIT_ROOM_ID = config.CHATKIT_ROOM_ID

class TypingIndicator extends Component {
    render() {
      if (this.props.typingUsers.length > 0) {
        return (
          <Text style={{ fontSize: 16, marginLeft: 10, marginBottom: 5 }}>
            {this.props.typingUsers.length > 1 ? `${this.props.typingUsers
              .slice(0, 2)
              .join(' and ')} are typing...` : `${this.props.typingUsers[0]} is typing...`}
          </Text>
        )
      }
      return <Text />
    }
  }

class Chat extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
            title: params ? params.screenTitle : 'Title',
        }
    };

    state = {
        messages: [],
        currentUser: null,
        roomID: this.props.navigation.getParam('roomID'),
        usersWhoAreTyping: []
    }

    onSendMessage = e => {
        this.props.onSendMessage(e.nativeEvent.text);
        this.refs.input.clear();
    };

    componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator: CHATKIT_INSTANCE_LOCATOR,
            userId: this.props.navigation.getParam('userID'),
            tokenProvider: new TokenProvider({
                url: `http://${ip}:5000/authenticate`,
            }),
        });

        chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser });

                currentUser.subscribeToRoom({
                    roomId: this.state.roomID,
                    hooks: {
                        onMessage: this.onReceive,
                        onUserStartedTyping: this.onUserStartedTyping,
                        onUserStoppedTyping: this.onUserStoppedTyping
                    },
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    onUserStartedTyping = user => {
        this.setState(previousState => ({ usersWhoAreTyping: [...previousState.usersWhoAreTyping, user.name] }))
    }

    onUserStoppedTyping = user => {
        this.setState({ usersWhoAreTyping: this.state.usersWhoAreTyping.filter(username => username !== user.name) })
    }

    onReceive = data => {
        const { id, senderId, text, createdAt } = data;
        const incomingMessage = {
            _id: id,
            text: text,
            createdAt: new Date(createdAt),
            user: {
                _id: senderId,
                name: senderId,

            },
        };

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, incomingMessage),
        }));
    };

    onSend = (messages = []) => {
        messages.forEach(message => {
            this.state.currentUser
                .sendMessage({
                    text: message.text,
                    roomId: this.state.roomID,
                })
                .then(() => { })
                .catch(err => {
                    console.log(err);
                });
        });
    };

    renderChatFooter = props => {
        return <TypingIndicator typingUsers={this.state.usersWhoAreTyping} />
    }

    sendTypingEvent = () => {
        this.state.currentUser
            .isTypingIn({ roomId: this.state.roomID })
            .then(() => { })
            .catch(err => console.error(`Error: ${err}`));
    }

    render() {
        let toDisplay = null;

        if (this.state.currentUser === null) {
            toDisplay = (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            );
        } else {
            toDisplay = (
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.currentUser.id,
                    }}
                    renderChatFooter={this.renderChatFooter}
                    onInputTextChanged={this.sendTypingEvent}
                />
            );
        }

        return toDisplay;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    }
});
export default Chat;
