import { Box, IconButton, Text } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/chatLogics'
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const SingleChat = ({ relaodChats, setRelaodChats }) => {

    const { user, selectedChat, setSelectedChat } = ChatState()


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
                                <UpdateGroupChatModal relaodChats={relaodChats} setRelaodChats={setRelaodChats} />
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