import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ handleFunction, user }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius='lg'
            m={1}
            mb={2}
            variant='solid'
            fontSize={12}
            bg='#4DB6AC'
            color='white'
            fontWeight='bold'
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon ml={4} fontSize={10} cursor='pointer' />
        </Box>
    )
}

export default UserBadgeItem
