import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
} from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import UserListItem from '../userAvatar/UserListItem'
import axios from 'axios'
import UserBadgeItem from '../userAvatar/UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [loading, setLoading] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])

    const toast = useToast()

    const { user, chats, setChats } = ChatState()

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Failed to search',
                description: error.response.data.error,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom-left'
            })
        }
    }
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please select user',
                description: 'Please fill all the fields below',
                status: 'warning',
                isClosable: true,
                duration: 5000,
                position: 'bottom-left'
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(user => user._id))
            },
                config
            )
            setLoading(false)
            setChats([data, ...chats])
            onClose()
            toast({
                title: 'New Group created!',
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-center',
            })
        } catch (error) {
            toast({
                title: 'Failed to create new group',
                description: error.response.data.error,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom-left'
            })
        }
    }
    const handleDelete = (userToDel) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToDel._id))
    }
    const addUserToGroupArray = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added!',
                description: `${userToAdd.name} already belongs to group`,
                status: 'warning',
                isClosable: true,
                duration: 5000,
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work Sans'
                        display='flex'
                        justifyContent='center'
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                    >
                        <FormControl >
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Input
                                placeholder='Add Users eg: John, Jane'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box
                            w='100%'
                            display='flex'
                            flexWrap='wrap'
                        >
                            {selectedUsers.map((user) => (

                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>

                        {loading ? <div>Loading...</div> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => addUserToGroupArray(user)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                    >
                        <Button
                            colorScheme='green'
                            mr={3}
                            px={8}
                            onClick={handleSubmit}
                        >
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
