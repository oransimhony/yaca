import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { GiftedChat } from 'react-native-gifted-chat';
import * as config from './config.json'

const ip = config.ip;
const CHATKIT_INSTANCE_LOCATOR = config.CHATKIT_INSTANCE_LOCATOR
const CHATKIT_ROOM_ID = config.CHATKIT_ROOM_ID

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
                    },
                });
            })
            .catch(err => {
                console.log(err);
            });
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
