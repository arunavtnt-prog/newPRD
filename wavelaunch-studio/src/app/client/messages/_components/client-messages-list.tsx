"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  message: string;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  project: {
    id: string;
    projectName: string;
  };
  isFromClient: boolean;
}

interface ClientMessagesListProps {
  userId: string;
}

export function ClientMessagesList({ userId }: ClientMessagesListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages/list");
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12 text-center text-red-600">
          <p>Error loading messages: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground">
              Send your first message to start a conversation with your team
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle>Conversation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => {
            const senderInitials = message.sender.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.isFromClient ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={message.sender.avatarUrl || undefined} />
                  <AvatarFallback
                    className={
                      message.isFromClient
                        ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                        : ""
                    }
                  >
                    {senderInitials}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`flex-1 space-y-2 ${
                    message.isFromClient ? "items-end" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {message.sender.fullName}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {message.project.projectName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(message.createdAt))} ago
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-lg max-w-2xl ${
                      message.isFromClient
                        ? "bg-gradient-to-br from-purple-100 to-blue-100 ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
