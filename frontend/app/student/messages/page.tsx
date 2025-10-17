"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Paperclip, ImageIcon } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  senderId: string
  text: string
  timestamp: string
  isStudent: boolean
}

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: "student",
    text: "Oi! Tenho uma dúvida sobre o treino de hoje",
    timestamp: "10:15",
    isStudent: true,
  },
  {
    id: 2,
    senderId: "trainer",
    text: "Oi João! Claro, pode perguntar",
    timestamp: "10:16",
    isStudent: false,
  },
  {
    id: 3,
    senderId: "student",
    text: "No supino inclinado, qual deve ser a inclinação do banco?",
    timestamp: "10:17",
    isStudent: true,
  },
  {
    id: 4,
    senderId: "trainer",
    text: "Ótima pergunta! O ideal é entre 30-45 graus. Isso vai focar mais na parte superior do peitoral.",
    timestamp: "10:18",
    isStudent: false,
  },
  {
    id: 5,
    senderId: "trainer",
    text: "Se colocar muito inclinado (acima de 45°), vai começar a recrutar mais o ombro.",
    timestamp: "10:18",
    isStudent: false,
  },
  {
    id: 6,
    senderId: "student",
    text: "Entendi! Obrigado pelas dicas do treino!",
    timestamp: "10:30",
    isStudent: true,
  },
]

const mockTrainer = {
  name: "Carlos Mendes",
  avatar: "/athletic-trainer.png",
  status: "Online",
}

export default function StudentMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        senderId: "student",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isStudent: true,
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
              <Link href="/student/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockTrainer.avatar || "/placeholder.svg"} />
              <AvatarFallback>CM</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-foreground">{mockTrainer.name}</h1>
              <p className="text-sm text-muted-foreground">{mockTrainer.status}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="bg-card border-border overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isStudent ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isStudent ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isStudent ? "text-primary-foreground/70" : "text-muted-foreground"
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
        </Card>
      </div>
    </div>
  )
}
