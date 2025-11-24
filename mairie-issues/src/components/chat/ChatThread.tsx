import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatRelativeTime, cn } from '@/lib/utils';

interface ChatThreadProps {
  reportId: string;
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
}

export function ChatThread({
  reportId,
  messages,
  onSendMessage,
}: ChatThreadProps) {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, optimisticMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending) return;

    const text = messageText.trim();
    setMessageText('');
    setIsSending(true);

    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      reportId,
      sender: 'user',
      text,
      createdAt: new Date().toISOString(),
    };

    setOptimisticMessages((prev) => [...prev, optimisticMessage]);

    try {
      await onSendMessage(text);
      // Remove optimistic message after successful send
      setOptimisticMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    } catch (error) {
      // On error, keep the optimistic message but could add error state
      console.error('Failed to send message:', error);
      // Optionally remove the optimistic message on error
      setOptimisticMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Combine real and optimistic messages
  const allMessages = [...messages, ...optimisticMessages];

  return (
    <div className="flex h-full flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Sin mensajes aún. ¡Inicia una conversación!
            </p>
          </div>
        ) : (
          allMessages.map((message) => {
            const isUser = message.sender === 'user';
            const isSystem = message.system;

            if (isSystem) {
              // System messages (centered)
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground max-w-md text-center">
                    {message.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  isUser ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'flex flex-col max-w-[75%] sm:max-w-[60%]',
                    isUser ? 'items-end' : 'items-start'
                  )}
                >
                  {/* Sender label */}
                  <div className="mb-1 px-1 text-xs text-muted-foreground">
                    {isUser ? 'Tú' : 'Ayuntamiento - Carlos Mendoza'}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2.5 break-words',
                      isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>

                  {/* Timestamp */}
                  <div className="mt-1 px-1 text-xs text-muted-foreground">
                    {formatRelativeTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose Box */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || isSending}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
