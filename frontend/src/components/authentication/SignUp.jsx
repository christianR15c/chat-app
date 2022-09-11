import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { useState } from "react";

const SignUp = () => {

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()
    const [show, setShow] = useState(false)

    const handleClick = () => {
        setShow(!show)
    }

    const postDetails = (pic) => { }

    const submitHandler = () => { }

    return (<VStack spacing={'5px'}>

        <FormControl id="first-name" isRequired >
            <FormLabel>Name</FormLabel>
            <Input
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
            />
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
                placeholder="Enter your name"
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    placeholder="Password"
                    type={show ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width='4.5rem'>
                    <Button
                        h='1.75rem' size='sm'
                        onClick={handleClick}
                    >{show ? 'hide' : 'show'}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
            <FormLabel>Conform Password</FormLabel>
            <InputGroup>
                <Input
                    placeholder="Repeat your password"
                    type={show ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width='4.5rem'>
                    <Button
                        h='1.75rem' size='sm'
                        onClick={handleClick}
                    >{show ? 'hide' : 'show'}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input
                type={'file'}
                p={1.5}
                accept='image/'
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>

        <Button
            colorScheme='blue'
            width='100%'
            style={{ marginTop: 15 }}
            onClick={submitHandler}
        >
            Sign Up
        </Button>

    </VStack>);
}

export default SignUp;