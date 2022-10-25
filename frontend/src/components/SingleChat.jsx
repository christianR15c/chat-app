import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/chatLogics'
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css'
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ relaodChats, setRelaodChats }) => {

    const { user, selectedChat, setSelectedChat } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()

    const toast = useToast()

    const fetchMessages = async (req, res) => {
        if (!selectedChat) return
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data)
            setLoading(false)


        } catch (error) {
            toast({
                title: 'Error occured!',
                description: 'Failed to send message',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
        }
    }

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                setNewMessage('')
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: 'Error occured!',
                    description: 'Failed to send message',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                })
            }
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value)
    }

    console.log(messages);

    useEffect(() => {
        fetchMessages()
    }, [selectedChat])


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        py={3}
                        px={2}
                        w='97%'
                        fontFamily='Work Sans'
                        display='fles'
                        justifyContent={{ base: 'space-between' }}
                        alignItems='center'
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            mt={2}
                        />

                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName}
                                <UpdateGroupChatModal relaodChats={relaodChats} setRelaodChats={setRelaodChats}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}

                    </Text>
                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        mx={3}
                        bg='#E0F2F1'
                        w='96%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading ? (
                            <Spinner
                                size='xl'
                                w={20}
                                h={20}
                                alignSelf='center'
                                margin='auto'
                                speed='0.8s'
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat
                                    messages={messages}
                                />

                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            mt={3}
                        >
                            <Input
                                variant='filled'
                                bg='#E0E0E0'
                                placeholder='Enter a Message'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>

                    </Box>
                </>
            ) : (
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    h='100%'
                >
                    <Text
                        fontSize='3xl'
                        pb={3}
                        fonFamily='Work Sans'
                        color='#90A4AE'
                    >
                        Click on a User or group to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat