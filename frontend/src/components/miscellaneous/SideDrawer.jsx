import { useState } from "react"
import {
    Avatar,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Tooltip,
    useDisclosure,
    Input,
    useToast,
    Spinner
} from "@chakra-ui/react"
import { Box, Text } from "@chakra-ui/layout"
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { BsSearch } from 'react-icons/bs'
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from "./ProfileModal"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ChatLoading from "../ChatLoading"
import UserListItem from "../userAvatar/UserListItem"

const SideDrawer = () => {

    const { user, setSelectedChat, chats, setChats } = ChatState()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post('/api/chat', { userId }, config)

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title: 'Failed to load chat',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom-left'
            })
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter a search term',
                status: 'warning',
                isClosable: true,
                duration: 5000,
                position: 'top-left'
            })
            return
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Failed to load the search results',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom-left'
            })
            setLoading(false)
        }
    }

    return (<>
        <Box
            display="flex"
            justifyContent='space-between'
            alignItems="center"
            m={3}
        >
            <Tooltip
                label='Search users to chat' hasArrow placement='bottom-end'
            >
                <Button variant='ghost' onClick={onOpen}>
                    <BsSearch />
                    <Text
                        display={{ base: "none", md: "flex" }}
                        pl={2}
                    >
                        Search User
                    </Text>
                </Button>
            </Tooltip>
            <Text
                fontSize='2xl'
                fontFamily='work-sans'
            >
                Chat-App
            </Text>
            <div>
                <Menu>
                    <MenuButton p='1'>
                        <BellIcon fontSize='2xl' mx={2} />
                    </MenuButton>
                </Menu>
                <Menu>
                    <MenuButton p='1'
                        as={Button}
                        rightIcon={<ChevronDownIcon />} >
                        <Avatar size='sm' cursor='pointer'
                            name={user.name}
                            src={user.pic} />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuItem onClick={logoutHandler}>
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>

        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
        // finalFocusRef={bt}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth='1px'>Search a User</DrawerHeader>

                <DrawerBody>
                    <Box display='flex' pb={2}>
                        <Input
                            type='text'
                            placeholder='Search by name or email'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Button onClick={handleSearch}>Go</Button>
                    </Box>
                    {loading ? (
                        <ChatLoading />
                    ) : (
                        searchResult?.map(user => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                            />
                        ))
                    )}
                    {loadingChat && <Spinner ml='auto' display='flex' />}
                </DrawerBody>

                <DrawerFooter>

                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>);
}

export default SideDrawer;