

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
  PhoneOff,
  Save
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

const initialInteractionDetails = {
    purpose: '',
    discussion: '',
    output: '',
    nextAction: '',
};

export function LogInteractionForm({ onAddInteraction, ticketId, isCallActive: initialIsCallActive = false }: LogInteractionFormProps) {
  const { toast } = useToast();
  
  const [interactionChannel, setInteractionChannel] = useState<InteractionChannel>('Note');
  const [interactionDetails, setInteractionDetails] = useState(initialInteractionDetails);
  
  const [isCallLive, setIsCallLive] = useState(initialIsCallActive);
  const [isCallCompleted, setIsCallCompleted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    setIsCallLive(initialIsCallActive);
    setIsCallCompleted(false); // Reset on prop change
    if(initialIsCallActive) {
      setCallDuration(0);
      setInteractionDetails(initialInteractionDetails); // Reset details for a new call
    }
  }, [initialIsCallActive]);
  

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallLive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallLive]);

  const formatDuration = (seconds: number) => {
      const date = new Date(0);
      date.setSeconds(seconds);
      const time = date.toISOString().substr(14, 5);
      return time;
  };
  
  const handleLogInteraction = () => {
    const { purpose } = interactionDetails;
    if (purpose.trim() === "") {
        toast({ variant: "destructive", title: "Cannot add interaction", description: "Please provide a purpose or subject."});
        return;
    }
    
    const interactionData: Omit<Interaction, 'id' | 'date' | 'agent'> = {
        type: interactionChannel === 'Note' ? 'Note' : 'Chat',
        channel: interactionChannel,
        content: purpose,
        ...interactionDetails,
        ticketId,
    };
    
    onAddInteraction(interactionData);
    
    setInteractionDetails(initialInteractionDetails);
    setInteractionChannel('Note');
  };
  
  const handleEndCall = () => {
    setIsCallLive(false);
  }
  
  const handleLogCallInteraction = () => {
    const durationStr = formatDuration(callDuration);
    
    const finalContent = interactionDetails.purpose || `Call ended after ${durationStr}`;
    
    const interactionData: Omit<Interaction, 'id' | 'date' | 'agent'> = {
        type: 'Call',
        channel: 'Phone',
        content: finalContent,
        duration: durationStr,
        transcript: mockTranscript,
        ...interactionDetails,
        ticketId,
    };
    
    onAddInteraction(interactionData);

    // Reset state to show the normal form again
    setIsCallCompleted(true);
    setCallDuration(0);
    setInteractionDetails(initialInteractionDetails);
    setInteractionChannel('Note');
    
    // We can't change the prop, so we manage this with internal state.
    // The component will now render the default form.
  }
  
  const handleDetailChange = (field: keyof typeof interactionDetails, value: string) => {
      setInteractionDetails(prev => ({...prev, [field]: value}))
  }

  const sharedFormFields = (
       <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interaction-purpose">Purpose / Subject</Label>
              <Input id="interaction-purpose" placeholder="e.g., Follow up on recent order" value={interactionDetails.purpose} onChange={e => handleDetailChange('purpose', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="interaction-discussion">Discussion Summary</Label>
                <Textarea id="interaction-discussion" placeholder="Summarize the key points of the conversation..." value={interactionDetails.discussion} onChange={e => handleDetailChange('discussion', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="interaction-output">Output / Resolution</Label>
                <Input id="interaction-output" placeholder="e.g., Customer agreed to exchange, sent return label" value={interactionDetails.output} onChange={e => handleDetailChange('output', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="interaction-next-action">Next Action</Label>
                <Input id="interaction-next-action" placeholder="e.g., Follow up in 3 days to check shipping status" value={interactionDetails.nextAction} onChange={e => handleDetailChange('nextAction', e.target.value)} />
            </div>
        </div>
  )

  if (initialIsCallActive && !isCallCompleted) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                     <CardTitle className="flex items-center gap-2">
                        {isCallLive ? (
                            <Badge variant={'default'}>
                                <Phone className="mr-2 h-4 w-4 animate-pulse"/>
                                Live Call
                            </Badge>
                        ) : (
                           <Badge variant={'destructive'}>
                                <PhoneOff className="mr-2 h-4 w-4"/>
                                Call Ended
                            </Badge>
                        )}
                         <span className="text-sm text-muted-foreground font-mono">{formatDuration(callDuration)}</span>
                     </CardTitle>
                     {isCallLive && (
                        <Button variant="destructive" size="sm" onClick={handleEndCall}>
                            <PhoneOff className="mr-2 h-4 w-4"/>
                            End Call
                        </Button>
                     )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {sharedFormFields}
                 {!isCallLive && (
                    <div className="space-y-2">
                        <Label>Transcript</Label>
                        <Textarea readOnly value={mockTranscript} className="min-h-32 font-mono text-xs" />
                    </div>
                 )}
            </CardContent>
             <CardFooter className="justify-end">
                <Button onClick={handleLogCallInteraction} disabled={isCallLive}>
                    <Save className="mr-2 h-4 w-4" />
                    Log Interaction
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
            {sharedFormFields}
        </CardContent>
        <CardFooter className="justify-end">
            <Button onClick={handleLogInteraction}>
                <Send className="mr-2 h-4 w-4" />
                Add Interaction
            </Button>
        </CardFooter>
    </Card>
  );
}
