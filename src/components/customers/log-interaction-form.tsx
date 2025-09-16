
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
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

const interactionChannels = [
    { value: 'Note', label: 'Internal Note', icon: StickyNote },
    { value: 'Phone', label: 'Phone Call', icon: Phone },
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
  const [callDetails, setCallDetails] = useState({
      startTime: '',
      endTime: '',
      purpose: '',
      discussion: '',
      output: '',
      nextAction: '',
      transcript: ''
  });
  
  const handleAddReply = () => {
    let interactionData: Omit<Interaction, 'id' | 'date' | 'agent'>;

    if (interactionChannel === 'Call') {
        if (!callDetails.purpose || !callDetails.discussion) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Please fill out all call details."});
            return;
        }
        interactionData = {
            type: 'Call',
            channel: 'Phone',
            content: callDetails.purpose,
            ...callDetails,
            duration: callDetails.startTime && callDetails.endTime ? `${Math.round((new Date(callDetails.endTime).getTime() - new Date(callDetails.startTime).getTime()) / 1000 / 60)}m` : undefined,
            ticketId,
        };
    } else {
        if (interactionContent.trim() === "") {
            toast({ variant: "destructive", title: "Cannot add empty interaction", description: "Please enter some content."});
            return;
        }
        interactionData = {
            type: interactionChannel === 'Note' ? 'Note' : 'Chat',
            channel: interactionChannel,
            content: interactionContent,
            ticketId,
        };
    }
    
    onAddInteraction(interactionData);
    
    // Reset form
    setInteractionContent("");
    setCallDetails({ startTime: '', endTime: '', purpose: '', discussion: '', output: '', nextAction: '', transcript: '' });
  };

  const renderInteractionForm = () => {
      if (interactionChannel === 'Call') {
          return (
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="call-start">Start Time</Label>
                          <Input id="call-start" type="datetime-local" value={callDetails.startTime} onChange={e => setCallDetails({...callDetails, startTime: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="call-end">End Time</Label>
                          <Input id="call-end" type="datetime-local" value={callDetails.endTime} onChange={e => setCallDetails({...callDetails, endTime: e.target.value})} />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="call-purpose">Purpose</Label>
                      <Input id="call-purpose" placeholder="e.g., Follow up on recent order" value={callDetails.purpose} onChange={e => setCallDetails({...callDetails, purpose: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="call-discussion">Discussion Summary</Label>
                      <Textarea id="call-discussion" placeholder="Summarize the key points of the conversation..." value={callDetails.discussion} onChange={e => setCallDetails({...callDetails, discussion: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="call-output">Output / Resolution</Label>
                      <Input id="call-output" placeholder="e.g., Customer agreed to exchange, sent return label" value={callDetails.output} onChange={e => setCallDetails({...callDetails, output: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="call-next-action">Next Action</Label>
                      <Input id="call-next-action" placeholder="e.g., Follow up in 3 days to check shipping status" value={callDetails.nextAction} onChange={e => setCallDetails({...callDetails, nextAction: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="call-transcript">Transcript</Label>
                      <Textarea id="call-transcript" placeholder="Paste or type the call transcript here..." className="min-h-32" value={callDetails.transcript} onChange={e => setCallDetails({...callDetails, transcript: e.target.value})} />
                  </div>
              </div>
          )
      }

      // Default for Note, Email, Chat, etc.
      return (
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
      );
  }

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
            {renderInteractionForm()}
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
