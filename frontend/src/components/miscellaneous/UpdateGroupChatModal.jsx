import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react'
import { EditIcon, ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModal = ({ relaodChats, setRelaodChats }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState('')
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

    const { selectedChat, setSelectedChat, user } = ChatState()

    const handleRemoveUser = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admin can remove users from the group',
                status: 'warning',
                isClosable: true,
                duration: 5000,
                position: 'top-center'
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
            const { data } = await axios.put('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config)

            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setRelaodChats(!relaodChats)
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
            toast({
                title: 'Failed to remove a user to group',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-center'
            })
        }
    }
    const handleRename = async (groupChatName) => {
        if (!groupChatName) return

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)
            setSelectedChat(data)
            setRelaodChats(!relaodChats)
            setRenameLoading(false)
            toast({
                title: 'Group Updated!',
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-center',
            })
        } catch (error) {
            setRenameLoading(false)
            toast({
                title: 'Failed to rename chat',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom-left'
            })
            setGroupChatName('')
        }

    }
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

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find(usr => usr._id === userToAdd._id)) {
            toast({
                title: 'User already added!',
                description: `${user.name} already belongs to group`,
                status: 'warning',
                isClosable: true,
                duration: 5000,
            })
            return
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admin can add someone to group',
                status: 'warning',
                isClosable: true,
                duration: 5000,
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
            const { data } = await axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config)
            setSelectedChat(data)
            setRelaodChats(!relaodChats)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast({
                title: 'Failed to add user to group',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom-left'
            })
        }
    }

    const handleLeaveGroup = async (userToRemove) => {
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config)

            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setRelaodChats(!relaodChats)
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
            toast({
                title: 'Failed to remove a user to group',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-center'
            })
        }
    }

    return (
        <>
            <IconButton
                onClick={onOpen}
                display='flex'
                icon={<EditIcon />}
            />

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>

                    <ModalBody>
                        <Box
                            w='100%'
                            display='flex'
                            flexWrap='wrap'
                        >
                            {selectedChat.users.map(user => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleRemoveUser(user)}
                                />
                            ))}
                        </Box>
                        <FormControl
                            display='flex'
                        >
                            <Input
                                placeContent='Chat Name'
                                mb={3}
                                value={groupChatName}
                                placeholder={selectedChat.chatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant='solid'
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add User to Group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>



                        {loading ? <Spinner /> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalCloseButton />


                    <ModalFooter
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Button colorScheme='red' mr={3} onClick={() => handleLeaveGroup(user)}>
                            Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal