import { Box, Container, Text, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';

const Homepage = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setUser(userInfo)

        if (userInfo) navigate('/chats')
    }, [])

    return (
        <Container maxW='xl' centerContent>
            <Box
                d='flex'
                p={3}
                bg={'white'}
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
                shadow='lg'
            >
                <Text fontSize='4xl' fontFamily='work sans' textAlign='center'>Chat-App</Text>
            </Box>
            <Box
                bg='white'
                w='100%'
                borderRadius='lg'
                borderWidth='1px'
                shadow='xl'
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb='1em'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Container>
    );
}

export default Homepage;