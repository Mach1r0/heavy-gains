"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Mic, Sparkles } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { NavHeader } from "@/components/nav-header"

export default function AIAssistantPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any

  return (
    <div>
      <NavHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-semibold">Assistente IA</h1>
              </div>

              <h2 className="text-2xl md:text-3xl font-medium text-center mb-4">Como posso ajudar?</h2>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="relative">
                  <Input
                    value={input ?? ""}
                    onChange={handleInputChange}
                    placeholder="Pergunte alguma coisa"
                    disabled={isLoading}
                    className="w-full h-14 pl-12 pr-24 text-base rounded-full bg-secondary/50 border-secondary focus-visible:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10"
                    disabled
                  >
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-10 w-10" disabled>
                      <Mic className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      disabled={isLoading || !(input ?? "").trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-6">
                <Button
                  variant="outline"
                  className="h-auto py-4 px-6 text-left justify-start bg-transparent"
                  onClick={() => {
                    const event = {
                      target: { value: "Como criar uma dieta balanceada?" },
                    } as React.ChangeEvent<HTMLInputElement>
                    handleInputChange(event)
                  }}
                >
                  <div>
                    <p className="font-medium">Dieta Balanceada</p>
                    <p className="text-sm text-muted-foreground">Como criar uma dieta equilibrada?</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-6 text-left justify-start bg-transparent"
                  onClick={() => {
                    const event = {
                      target: { value: "Qual o melhor treino para hipertrofia?" },
                    } as React.ChangeEvent<HTMLInputElement>
                    handleInputChange(event)
                  }}
                >
                  <div>
                    <p className="font-medium">Treino de Hipertrofia</p>
                    <p className="text-sm text-muted-foreground">Melhor treino para ganhar massa?</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-6 text-left justify-start bg-transparent"
                  onClick={() => {
                    const event = {
                      target: { value: "Como calcular meu gasto calórico diário?" },
                    } as React.ChangeEvent<HTMLInputElement>
                    handleInputChange(event)
                  }}
                >
                  <div>
                    <p className="font-medium">Gasto Calórico</p>
                    <p className="text-sm text-muted-foreground">Como calcular minhas calorias?</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-6 text-left justify-start bg-transparent"
                  onClick={() => {
                    const event = {
                      target: { value: "Dicas para melhorar minha performance no treino" },
                    } as React.ChangeEvent<HTMLInputElement>
                    handleInputChange(event)
                  }}
                >
                  <div>
                    <p className="font-medium">Performance</p>
                    <p className="text-sm text-muted-foreground">Dicas para melhorar no treino</p>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-8rem)]">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-6 py-8">
                  {messages.map((message: any) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                        }`}
                      >
                        <p className="text-base whitespace-pre-wrap leading-relaxed">{message.content ?? message.text ?? (message as any).body}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-2xl px-6 py-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="py-4">
                <div className="relative">
                  <Input
                    value={input ?? ""}
                    onChange={handleInputChange}
                    placeholder="Pergunte alguma coisa"
                    disabled={isLoading}
                    className="w-full h-14 pl-12 pr-24 text-base rounded-full bg-secondary/50 border-secondary focus-visible:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10"
                    disabled
                  >
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-10 w-10" disabled>
                      <Mic className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      disabled={isLoading || !(input ?? "").trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
