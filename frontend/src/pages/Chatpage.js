
import { ChatState } from "../context/ChatProvider";
import { Box } from '@chakra-ui/layout'
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const Chatpage = () => {

    const { user } = ChatState()
    const [relaodChats, setRelaodChats] = useState(false)

    return (
        <div style={{ width: '100%' }}>
            {user && <SideDrawer />}
            <Box
                display='flex'
                justifyContent="space-between"
                w="100%"
                h="91.5vh"
                p="10px"
            >
                {user && <MyChats relaodChats={relaodChats} />}
                {user && <ChatBox relaodChats={relaodChats} setRelaodChats={setRelaodChats} />}
            </Box>
        </div>
    );
}

export default Chatpage;