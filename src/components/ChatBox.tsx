/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input } from "antd";
import Compact from "antd/es/space/Compact";
import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { getUserDataFromStorage } from "../utils/storage";
import { useForm } from "antd/es/form/Form";

interface IChat {
    id?: number;
    name: string;
    message: string;
}

interface ChatBoxProps {
    closeChat: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ closeChat }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<FormInstance | null>(null);
    const user_data = getUserDataFromStorage()

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [socket, setSocket] = useState<W3CWebSocket | null>(null);
    const [chats, setChats] = useState<IChat[]>([])

    const [form] = useForm();
    formRef.current = form;

    useEffect(() => {
        const ws = new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/${user_data?.user.club?.id}/`);

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        setSocket(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data as string);
                console.log(data)
                setChats((prevChats) => [...prevChats, data]);
                console.log(chats)
            };
        }
    }, [socket]);

    const handleDrag = (e: DraggableEvent, ui: DraggableData) => {
        const { x, y } = ui;
        setPosition({ x, y });
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []);

    const onFinish = (values: any) => {
        if (values.message) {
            if (socket && socket.readyState === socket.OPEN) {
                socket.send(JSON.stringify({
                    user: user_data?.user.id,
                    name: user_data?.user?.username,
                    message: values.message
                }));

                formRef.current?.resetFields();
            }
        }
    };

    return (
        <Draggable
            axis="x"
            position={position}
            onDrag={handleDrag}
        >
            <div className='bg-zinc-500 w-[350px] h-[500px] rounded shadow-lg'>
                <div className='relative p-1'>
                    <div className='absolute right-1'>
                        <Button size='small' type='primary' onClick={closeChat} icon={<CloseOutlined />} />
                    </div>
                    <div className='flex justify-center w-full text-white'>
                        CHAT BOX
                    </div>
                </div>
                {/* <div className='bg-green-100'>
                    <div className='flex'>
                        <Button type='primary' className='w-full font-semibold text-xs'>CHATS</Button>
                        <Button className='w-full font-semibold text-xs text-zinc-500'>MEMBERS</Button>
                    </div>
                </div> */}
                <div ref={containerRef} className='bg-[#F5F5F5] p-2 w-full h-full overflow-auto scrollbar-custom-style'>
                    {chats.map((chat: IChat) => (
                        chat.name === user_data?.user.username ?
                            <div className='flex justify-end'>
                                <div className='m-1 p-2 bg-white rounded '>
                                    <div className='max-w-[225px]'>
                                        {chat.message}
                                    </div>
                                </div>
                            </div>
                            :
                            <div className='flex'>
                                <div className='m-1 p-2 bg-white rounded '>
                                    <div className='text-xs font-bold text-zinc-500'>
                                        {chat.name}
                                    </div>
                                    <div className='max-w-[225px]'>
                                        {chat.message}
                                    </div>
                                </div>
                            </div>

                    ))}
                </div>
                <Form form={form} onFinish={onFinish}>
                    <Form.Item name="message">
                        <Compact className='flex'>
                            <div className='bg-white rounded flex-grow'>
                                <Input placeholder='Type your message here' />
                            </div>
                            <div className='bg-white rounded'>
                                <Button type='primary' htmlType='submit'>
                                    SEND
                                </Button>
                            </div>
                        </Compact>
                    </Form.Item>
                </Form>
            </div>
        </Draggable >
    );
};