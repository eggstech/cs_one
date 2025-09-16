
'use client';

import { useState, useEffect } from "react";
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
  PhoneOff
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Interaction } from "@/lib/types";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

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
    isCallActive?: boolean;
}

const mockTranscript = `Agent: Thank you for calling CS-One, this is Alex speaking. How can I help you today?
Customer: Hi Alex, this is John Doe. I'm calling about my recent order, ORD-001. I received it yesterday but the frames aren't quite what I expected. I'd like to start a return.
Agent: I see. I'm sorry to hear that the frames weren't to your liking, Mr. Doe. I can certainly help you with a return. Can you confirm the order ID for me?
Customer: Yes, it's ORD-001.
Agent: Great, thank you. I've pulled up your order. I am initiating the return process now. You will receive an email shortly with a return shipping label and instructions on how to send the item back. Once we receive it, we will process a full refund.
Customer: That sounds perfect. Thank you for your help, Alex.
Agent: You're very welcome. Is there anything else I can assist you with today?
Customer: No, that's all.
Agent: Alright. Have a great day, Mr. Doe.
`;

export function LogInteractionForm({ onAddInteraction, ticketId, isCallActive = false }: LogInteractionFormProps) {
  const { toast } = useToast();
  
  const [interactionChannel, setInteractionChannel] = useState<InteractionChannel>('Note');
  const [interactionContent, setInteractionContent] = useState("");
  const [callDuration, setCallDuration] = useState(0);
   const [callDetails, setCallDetails] = useState({
      purpose: '',
      discussion: '',
      output: '',
      nextAction: '',
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      setCallDuration(0); // Reset timer on new call
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
      const date = new Date(0);
      date.setSeconds(seconds);
      const time = date.toISOString().substr(14, 5);
      return time === '00:00' && seconds > 0 ? '0m 0s' : time;
  };
  
  const handleLogSimpleInteraction = () => {
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
    
    setInteractionContent("");
    setInteractionChannel('Note');
  };
  
  const handleEndCall = () => {
    const durationStr = formatDuration(callDuration);
    
    const finalContent = callDetails.purpose || `Call ended after ${durationStr}`;
    
    const interactionData: Omit<Interaction, 'id' | 'date' | 'agent'> = {
        type: 'Call',
        channel: 'Phone',
        content: finalContent,
        duration: durationStr,
        transcript: mockTranscript,
        purpose: callDetails.purpose,
        discussion: callDetails.discussion,
        output: callDetails.output,
        nextAction: callDetails.nextAction,
        ticketId,
    };
    
    onAddInteraction(interactionData);

    // Reset state
    setCallDuration(0);
    setCallDetails({ purpose: '', discussion: '', output: '', nextAction: '' });
  }

  if (isCallActive) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                     <CardTitle className="flex items-center gap-2">
                        <Badge variant={'default'}>
                            <Phone className="mr-2 h-4 w-4 animate-pulse"/>
                            Live Call
                        </Badge>
                         <span className="text-sm text-muted-foreground font-mono">{formatDuration(callDuration)}</span>
                     </CardTitle>
                     <Button variant="destructive" size="sm" onClick={handleEndCall}>
                        <PhoneOff className="mr-2 h-4 w-4"/>
                        End Call
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
             <CardFooter className="justify-end">
                <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Log Notes
                </Button>
            </CardFooter>
        </Card>
    )
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
            <Button onClick={handleLogSimpleInteraction}>
                <Send className="mr-2 h-4 w-4" />
                Add Interaction
            </Button>
        </CardFooter>
    </Card>
  );
}
