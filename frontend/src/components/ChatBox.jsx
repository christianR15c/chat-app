import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'

const ChatBox = ({ relaodChats, setRelaodChats }) => {

    const { selectedChat } = ChatState()

    return (
        <Box
            display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
            flexDirection="column"
            pb={3}
            alignItems="center"
            bg='white'
            width={{ base: '100%', md: '68%' }}
            borderRadius='lg'
            borderWidth='1px'
        >
            <SingleChat relaodChats={relaodChats} setRelaodChats={setRelaodChats} />
        </Box>
    )
}

export default ChatBox
