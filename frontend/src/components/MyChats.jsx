import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSender } from '../config/chatLogics';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ relaodChats }) => {

    const [loggedUser, setLoggedUser] = useState()
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState()

    const toast = useToast()

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get('/api/chat', config)
            setChats(data)
        } catch (error) {
            toast({
                title: 'Failed to load chats',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom-left'
            })
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
        fetchChats()
    }, [relaodChats])


    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: 'flex' }}
            flexDir='column'
            alignItems='center'
            p={3}
            bg='white'
            w={{ base: '100%', md: '31%' }}
            borderRadius='lg'
            borderWidth='1px'
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '28px', md: '30px' }}
                fontFamily='Work Sans'
                display='flex'
                w='100%'
                justifyContent='space-between'
                alignItems='center'
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display='flex'
                        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                        bg='#E0F2F1'
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display='flex'
                flexDir='column'
                w='100%'
                h='100%'
                p={3}
                bg='white'
                borderRadius='lg'
                overflow='hidden'
            >
                {chats ? (
                    <Stack overflowY='scroll'>
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor='pointer'
                                w='100%'
                                bg={selectedChat === chat ? '#38B2AC' : '#E0F2F1'}
                                color={selectedChat === chat ? 'white' : 'black'}
                                px={3}
                                py={2}
                                borderRadius='lg'
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat ? (
                                        getSender(loggedUser, chat.users)
                                    ) : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
}

export default MyChats;