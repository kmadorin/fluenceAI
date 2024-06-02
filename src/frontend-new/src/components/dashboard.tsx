
'use client';
import { unstable_noStore as noStore } from 'next/cache'
import { useState, useEffect, useRef } from 'react'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { LoadingSVG } from '@/components/svgs/LoadingSVG';
import {
    Bird,
    Book,
    Bot,
    Code2,
    CornerDownLeft,
    LifeBuoy,
    Mic,
    Paperclip,
    Rabbit,
    Settings,
    Settings2,
    Share,
    SquareTerminal,
    SquareUser,
    Triangle,
    Turtle,
    icons,
    MessageSquare, 
    XCircle,
} from "lucide-react"

import { cn } from '@/lib/utils';

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Text } from '@/components/ui/text';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import openai from '@/lib/openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { DEFAULT_SYSTEM_INSTRUCTIONS } from '@/lib/constants';

const models = [
    { 
      name: 'gpt-3.5-turbo', 
      title: 'Turbo 3.5', 
      description: 'A powerful model with a balance of speed and accuracy.',
      icon: <icons.Turtle className="size-5" />,
    },
    { 
        name: 'gpt-4-turbo', 
        title: 'Turbo 4', 
        description: 'The fastest and most efficient model for general use cases.',
        icon: <icons.Rabbit className="size-5" />,
    },
    { 
      name: 'gpt-4o', 
      title: 'GPT-4 Origin', 
      description: 'The original GPT-4 model, offering high-quality results.',
      icon: <icons.Bird className="size-5" />,
    },
  ];

export function Dashboard() {
    noStore()

    // TODO: add form to input this
    openai.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    openai.baseURL = process.env.NEXT_PUBLIC_GATEWAY_URL;

    const [systemInstructions, setSystemInstructions] = useState<string>('');
    const [inputMessage, setInputMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
    const [pendingCompletion, setPendingCompletion] = useState<boolean>(false);
    const [options, setOptions] = useState<{
        model: string;
        temperature: number;
        max_tokens: number;
        top_p: number
    }>({
        model: models[0].name,
        temperature: 0,
        max_tokens: 10,
        top_p: 0.1,
    });
    const [errorMessage, setErrorMessage] = useState<string>('');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPendingCompletion(true);
        const newMessages = [...messages];
        newMessages.push({
            role: 'user',
            content: inputMessage,
        });

        setMessages(newMessages);
        setInputMessage('');

        const {model, temperature, max_tokens, top_p} = options;

        const createParams = {
            model,
            messages: [
            {
                role: 'system',
                content: systemInstructions ?? DEFAULT_SYSTEM_INSTRUCTIONS,
            },
            ...newMessages,
            ],
            temperature, //0,
            max_tokens, //10,
            top_p, //0.1,
        }

        openai.chat.completions
            .create({
                model,
                messages: [
                {
                    role: 'system',
                    content: systemInstructions ?? DEFAULT_SYSTEM_INSTRUCTIONS,
                },
                ...newMessages,
                ],
                temperature, //0,
                max_tokens, //10,
                top_p, //0.1,
            })
            .then((completionResponse) => {
                setMessages((prevMessages) => {
                    return [
                      ...prevMessages,
                      { ...completionResponse.choices[0].message },
                    ];
                });
            })
            .catch((err) => {
                console.log(err.message);
            }).finally(() => {
                setPendingCompletion(false);
            });
    }

    const handleModelChange = (value: string) => {
        setOptions({
            ...options,
            model: value,
        });
    }

    const handleUserMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMessage(e.target.value);
    }

    const handleSystemInstructionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSystemInstructions(e.target.value);
    }

    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    return (
        <div className="grid h-screen w-full pl-[56px]">
            <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
                <div className="border-b p-2">
                    <Button variant="outline" size="icon" aria-label="Home">
                        <Triangle className="size-5 fill-foreground" />
                    </Button>
                </div>
                <nav className="grid gap-1 p-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg bg-muted"
                                aria-label="Playground"
                            >
                                <SquareTerminal className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Playground
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="Models"
                            >
                                <Bot className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Models
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="API"
                            >
                                <Code2 className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            API
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="Documentation"
                            >
                                <Book className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Documentation
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-lg"
                                aria-label="Settings"
                            >
                                <Settings2 className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Settings
                        </TooltipContent>
                    </Tooltip>
                </nav>
                <nav className="mt-auto grid gap-1 p-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mt-auto rounded-lg"
                                aria-label="Help"
                            >
                                <LifeBuoy className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Help
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mt-auto rounded-lg"
                                aria-label="Account"
                            >
                                <SquareUser className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Account
                        </TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
            <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                    <h1 className="text-xl font-semibold">Playground</h1>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Settings className="size-4" />
                                <span className="sr-only">Settings</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="max-h-[80vh]">
                            <DrawerHeader>
                                <DrawerTitle>Configuration</DrawerTitle>
                                <DrawerDescription>
                                    Configure the settings for the model and messages.
                                </DrawerDescription>
                            </DrawerHeader>
                            <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                                <fieldset className="grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        Settings
                                    </legend>
                                    <div className="grid gap-3">
                                        <Label htmlFor="model">Model</Label>
                                        <Select onValueChange={handleModelChange}>
                                            <SelectTrigger
                                                id="model"
                                                className="items-start [&_[data-description]]:hidden"
                                            > 
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {models.map((model) => {
                                                    return (<SelectItem value={model.name} key={model.name}>
                                                        <div className="flex items-start gap-3 text-muted-foreground">
                                                            {model.icon}
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    <span className="font-medium text-foreground">
                                                                        {model.title}
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs" data-description>
                                                                    {model.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>)
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="temperature">Temperature</Label>
                                        <Input id="temperature" type="number" placeholder="0.4" defaultValue={0} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="max_tokens">Max tokens</Label>
                                        <Input id="max_tokens" type="number" placeholder="10" defaultValue={10} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="top-p">Top P</Label>
                                        <Input id="top-p" type="number" placeholder="0.7" defaultValue={0.1}/>
                                    </div>

                                    {/* <div className="grid gap-3">
                                        <Label htmlFor="top-k">Top K</Label>
                                        <Input id="top-k" type="number" placeholder="0.0" />
                                    </div> */}
                                </fieldset>
                                <fieldset className="grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        Messages
                                    </legend>
                                    <div className="grid gap-3">
                                        <Label htmlFor="role">Role</Label>
                                        <Select defaultValue="system">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="system">System</SelectItem>
                                                {/* <SelectItem value="user">User</SelectItem> */}
                                                {/* <SelectItem value="assistant">Assistant</SelectItem> */}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea id="content" placeholder="You are a..." onChange={handleSystemInstructionChange}/>
                                    </div>
                                </fieldset>
                            </form>
                        </DrawerContent>
                    </Drawer>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto gap-1.5 text-sm"
                    >
                        <Share className="size-3.5" />
                        Share
                    </Button>
                </header>
                <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
                    <div
                        className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
                    >
                        <form className="grid w-full items-start gap-6">
                            <fieldset className="grid gap-6 rounded-lg border p-4">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Settings
                                </legend>
                                <div className="grid gap-3">
                                    <Label htmlFor="model">Model</Label>
                                    <Select onValueChange={handleModelChange}>
                                        <SelectTrigger
                                            id="model"
                                            className="items-start [&_[data-description]]:hidden"
                                        >
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {models.map((model) => {
                                                return (<SelectItem value={model.name} key={model.name}>
                                                    <div className="flex items-start gap-3 text-muted-foreground">
                                                        {model.icon}
                                                        <div className="grid gap-0.5">
                                                            <p>
                                                                <span className="font-medium text-foreground">
                                                                    {model.title}
                                                                </span>
                                                            </p>
                                                            <p className="text-xs" data-description>
                                                                {model.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </SelectItem>)
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="temperature">Temperature</Label>
                                    <Input id="temperature" type="number" placeholder="0.4" defaultValue={0}/>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="top-p">Top P</Label>
                                    <Input id="top-p" type="number" placeholder="0.7" defaultValue={0.1} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="max_tokens">Max tokens</Label>
                                    <Input id="max_tokens" type="number" placeholder="10" defaultValue={10}/>
                                </div>
                                {/* <div className="grid grid-cols-2 gap-4"> */}
                                    
                                    {/* <div className="grid gap-3">
                                        <Label htmlFor="top-k">Top K</Label>
                                        <Input id="top-k" type="number" placeholder="0.0" />
                                    </div> */}
                                {/* </div> */}
                            </fieldset>
                            <fieldset className="grid gap-6 rounded-lg border p-4">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Messages
                                </legend>
                                <div className="grid gap-3">
                                    <Label htmlFor="role">Role</Label>
                                    <Select defaultValue="system">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="system">System</SelectItem>
                                            {/* <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="assistant">Assistant</SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="You are a..."
                                        className="min-h-[9.5rem]"
                                        onChange={handleSystemInstructionChange}
                                    />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
                        <Badge variant="outline" className="absolute right-3 top-3">
                            Output
                        </Badge>

                        <div className="flex-1" />
                        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {messages.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <MessageSquare />
              <Text variant="medium">Send a message to start your chat</Text>
            </div>
          )}
          {messages
            .filter((m) => m.role != 'system')
            .map((message, index) => (
              <Text
                key={index}
                className={cn(
                  'p-3 border rounded-md w-fit',
                  message.role === 'assistant' && 'bg-secondary',
                  message.role === 'user' && 'ml-auto'
                )}
              >
                <Markdown remarkPlugins={[remarkGfm]}>
                  {message.content as string}
                </Markdown>
              </Text>
            ))}
          {pendingCompletion && (
            <div className="p-3 border rounded w-fit bg-secondary">
              <LoadingSVG />
            </div>
          )}
          {errorMessage && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 text-red-500">
              <XCircle />
              <Text className="">{errorMessage}</Text>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
                        <form
                            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1"
                        >
                            <Label htmlFor="message" className="sr-only">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Type your message here..."
                                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                                onChange={handleUserMessageChange}
                            />
                            <div className="flex items-center p-3 pt-0">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Paperclip className="size-4" />
                                            <span className="sr-only">Attach file</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Attach File</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Mic className="size-4" />
                                            <span className="sr-only">Use Microphone</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Use Microphone</TooltipContent>
                                </Tooltip>
                                <Button type="submit" size="sm" className="ml-auto gap-1.5" onClick={handleSubmit}>
                                    Send Message
                                    <CornerDownLeft className="size-3.5" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}