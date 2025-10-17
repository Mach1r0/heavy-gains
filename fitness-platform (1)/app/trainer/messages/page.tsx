"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Send, Paperclip, ImageIcon } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  senderId: string
  text: string
  timestamp: string
  isTrainer: boolean
}

interface Conversation {
  id: number
  studentId: number
  studentName: string
  studentAvatar: string
  lastMessage: string
  lastMessageTime: string
  unread: number
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "João Silva",
    studentAvatar: "/male-athlete.png",
    lastMessage: "Obrigado pelas dicas do treino!",
    lastMessageTime: "10:30",
    unread: 2,
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Maria Santos",
    studentAvatar: "/female-athlete.png",
    lastMessage: "Posso substituir o frango por peixe?",
    lastMessageTime: "Ontem",
    unread: 0,
  },
  {
    id: 3,
    studentId: 3,
    studentName: "Pedro Costa",
    studentAvatar: "/male-fitness.jpg",
    lastMessage: "Vou fazer o treino agora!",
    lastMessageTime: "Ontem",
    unread: 0,
  },
  {
    id: 4,
    studentId: 4,
    studentName: "Ana Oliveira",
    studentAvatar: "/female-fitness.jpg",
    lastMessage: "Consegui bater meu recorde no supino!",
    lastMessageTime: "Seg",
    unread: 1,
  },
]

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: "student",
    text: "Oi! Tenho uma dúvida sobre o treino de hoje",
    timestamp: "10:15",
    isTrainer: false,
  },
  {
    id: 2,
    senderId: "trainer",
    text: "Oi João! Claro, pode perguntar",
    timestamp: "10:16",
    isTrainer: true,
  },
  {
    id: 3,
    senderId: "student",
    text: "No supino inclinado, qual deve ser a inclinação do banco?",
    timestamp: "10:17",
    isTrainer: false,
  },
  {
    id: 4,
    senderId: "trainer",
    text: "Ótima pergunta! O ideal é entre 30-45 graus. Isso vai focar mais na parte superior do peitoral.",
    timestamp: "10:18",
    isTrainer: true,
  },
  {
    id: 5,
    senderId: "trainer",
    text: "Se colocar muito inclinado (acima de 45°), vai começar a recrutar mais o ombro.",
    timestamp: "10:18",
    isTrainer: true,
  },
  {
    id: 6,
    senderId: "student",
    text: "Entendi! Obrigado pelas dicas do treino!",
    timestamp: "10:30",
    isTrainer: false,
  },
]

export default function TrainerMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const filteredConversations = mockConversations.filter((conv) =>
    conv.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        senderId: "trainer",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isTrainer: true,
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/trainer/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mensagens</h1>
              <p className="text-sm text-muted-foreground">Converse com seus alunos</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="p-4 bg-card border-border overflow-hidden flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-muted/30 hover:bg-muted/50 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.studentAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {conversation.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground truncate">{conversation.studentName}</p>
                        <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <Badge
                            variant="default"
                            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 bg-card border-border overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.studentAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedConversation.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{selectedConversation.studentName}</p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isTrainer ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isTrainer ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isTrainer ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Selecione uma conversa para começar</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
