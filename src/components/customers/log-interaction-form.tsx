
'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  StickyNote,
  Mail,
  Phone,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Interaction } from "@/lib/types";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

const interactionChannels = [
    { value: 'Note', label: 'Internal Note', icon: StickyNote },
    { value: 'Email', label: 'Email', icon: Mail },
    { value: 'Facebook', label: 'Facebook Message', icon: Icons.facebook },
    { value: 'Zalo', label: 'Zalo Chat', icon: Icons.zalo },
] as const;

type InteractionChannel = typeof interactionChannels[number]['value'];

interface LogInteractionFormProps {
    onAddInteraction: (interactionData: Omit<Interaction, 'id' | 'date' | 'agent'>) => void;
    ticketId?: string;
}

export function LogInteractionForm({ onAddInteraction, ticketId }: LogInteractionFormProps) {
  const { toast } = useToast();
  
  const [interactionChannel, setInteractionChannel] = useState<InteractionChannel>('Note');
  const [interactionContent, setInteractionContent] = useState("");
  
  const handleAddReply = () => {
    if (interactionContent.trim() === "") {
        toast({ variant: "destructive", title: "Cannot add empty interaction", description: "Please enter some content."});
        return;
    }
    
    const interactionData: Omit<Interaction, 'id' | 'date' | 'agent'> = {
        type: interactionChannel === 'Note' ? 'Note' : 'Chat',
        channel: interactionChannel,
        content: interactionContent,
        ticketId,
    };
    
    onAddInteraction(interactionData);
    
    // Reset form
    setInteractionContent("");
    setInteractionChannel('Note');
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Log Interaction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="interaction-channel">Channel</Label>
                <Select value={interactionChannel} onValueChange={(value: InteractionChannel) => setInteractionChannel(value)}>
                    <SelectTrigger id="interaction-channel" className="w-[240px]">
                        <SelectValue placeholder="Select a channel" />
                    </SelectTrigger>
                    <SelectContent>
                        {interactionChannels.map(channel => (
                            <SelectItem key={channel.value} value={channel.value}>
                                <div className="flex items-center gap-2">
                                    <channel.icon className="h-4 w-4" />
                                    {channel.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-4">
              <Label htmlFor="new-interaction-content" className="text-sm font-medium">
                  {interactionChannel === 'Note' ? 'Internal Note' : `${interactionChannel} Message`}
              </Label>
              <Textarea
                id="new-interaction-content"
                placeholder={
                    interactionChannel === 'Note' ? "Add an internal note for your team..." :
                    `Type your ${interactionChannel} message here...`
                }
                value={interactionContent}
                onChange={(e) => setInteractionContent(e.target.value)}
                className="min-h-24"
              />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
            <Button onClick={handleAddReply}>
                <Send className="mr-2 h-4 w-4" />
                Add Interaction
            </Button>
        </CardFooter>
    </Card>
  );
}
