import React, { Component } from 'react'
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import firebase from "../../../firebase";
import { connect } from "react-redux";
import { setUserPosts } from '../../../redux/actions/chatRoom_action';
import Skeleton from './Skeleton';
import { Div } from "atomize"
export class MainPanel extends Component {

    messagesEnd = React.createRef();

    state = {
        messages: [],
        messageLoading: true,
        messagesRef: firebase.database().ref("messages"),
        searchTerm: "",
        searchResults: [],
        searchLoading: false,
        typingRef: firebase.database().ref("typing"),
        typingUsers: [],
        listenerLists: [],
        connectedRef: firebase.database().ref(".info/connected")
    }

    componentDidMount() {
        const { chatRoom } = this.props;
        if (chatRoom) {
            this.addMessagesListeners(chatRoom.id);
            this.addTypingListeners(chatRoom.id);
        }
        window.scrollTo(0, 0)     
        
    }

    componentDidUpdate() {
        if (this.messagesEnd) {
            console.log('jjsjsjs')
            this.messagesEnd.scrollIntoView(false);
        }
    }

    componentWillUnmount() {
        this.state.messagesRef.off();
        this.state.connectedRef.off();
        this.removeListeners(this.state.listenerLists);
    }

    removeListeners = listeners => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        });
    };

    addTypingListeners = (chatRoomId) => {
        let typingUsers = [];
        this.state.typingRef.child(chatRoomId).on("child_added",
            DataSnapshot => {
                if (DataSnapshot.key !== this.props.user.uid) {
                    typingUsers = typingUsers.concat({
                        id: DataSnapshot.key,
                        name: DataSnapshot.val()
                    });
                    this.setState({ typingUsers });
                }
            });
        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_added");

        this.state.typingRef.child(chatRoomId).on("child_removed",
            DataSnapshot => {
                const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);
                if (index !== -1) {
                    typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key);
                    this.setState({ typingUsers });
                }
            });
        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_removed");

        this.state.connectedRef.on("value", DataSnapshot => {
            //뒤에 this.props.user가 없으면 로그인 했을 때  이 부분이 trigger 될 때 user 값이 undefined 떠서 에러 발생.
            if (DataSnapshot.val() === true && this.props.user) {
                this.state.typingRef
                    .child(chatRoomId)
                    .child(this.props.user.uid)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null) {
                            console.error(err);
                        }
                    });
            }
        });

    }

    addToListenerLists = (id, ref, event) => {
        const index = this.state.listenerLists.findIndex(listener => {
            return (
                listener.id === id &&
                listener.ref === ref &&
                listener.event === event
            );
        });

        if (index === -1) {
            const newListener = { id, ref, event };
            this.setState({
                listenerLists: this.state.listenerLists.concat(newListener)
            });
        }
    };

    addMessagesListeners = (chatRoomId) => {
        let messagesArray = [];
        this.setState({ messages: [] });
        this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
            messagesArray.push(DataSnapshot.val());
            this.setState({
                messages: messagesArray,
                messageLoading: false
            })
            this.userPostsCount(messagesArray);
        });
    }

    userPostsCount = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    image: message.user.image,
                    count: 1
                };
            }
            return acc;
        }, {});
        // console.log('userPosts :', userPosts)
        this.props.dispatch(setUserPosts(userPosts));
    };

    handleSearchChange = event => {
        this.setState(
            {
                searchTerm: event.target.value,
                searchLoading: true
            },
            () => this.handleSearchMessages()
        );
    };

    handleSearchMessages = () => {
        const chatRoomMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi");
        const searchResults = chatRoomMessages.reduce((acc, message) => {
            if (
                (message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ) {
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
    };

    renderMessages = messages =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />
        ));

    renderTypingUsers = (typingUsers) =>
        typingUsers.length > 0 &&
        typingUsers.map(user => (
            <span>{user.name}님이 채팅을 입력하고 있습니다...</span>
        ))

    renderMessageSkeleton = (loading) =>
        loading && (
            <>
                {[...Array(10)].map((undefine, i) => (
                    <Skeleton key={i} />
                ))
                }
            </>
        )
    

    render() {
        const { messages, searchTerm, searchResults, typingUsers, messageLoading } = this.state;
        return (
                       
            <Div
            m={{ x: { xs: '0', md: '0', lg: '0' }, y: { xs: '0', md: '0', lg: '5rem' }}}
            minW={{ xs: "100%", md: "70%", lg: "70%" }}
            d="flex"
            align="center"
            flexDir="column"
            h={{ xs: "auto", md: "auto", lg: "auto" }}
            pos="relative"
          >
                <MessageHeader
                    messages={messages}
                    handleSearchChange={this.handleSearchChange}
                />
                
                <div style={{
                    width: '100%',
                    height: '450px',
                    border: '.2rem solid #ececec',
                    borderRadius: '4px',
                    background: '#f5f5f5',
                    marginBottom: '1rem',
                    overflowY: 'auto'
                }}>
                    {this.renderMessageSkeleton(messageLoading)}
                    {searchTerm
                        ? this.renderMessages(searchResults)
                        : this.renderMessages(messages)}
                    {this.renderTypingUsers(typingUsers)}
                    <div ref={node => (this.messagesEnd = node)} />
                </div>

                <MessageForm />
            </Div>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    };
};

export default connect(mapStateToProps)(MainPanel);

