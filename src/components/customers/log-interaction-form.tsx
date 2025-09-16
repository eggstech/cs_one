
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
import { Badge } from "../ui/badge";

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
    isCallActive?: boolean;
}

export function LogInteractionForm({ onAddInteraction, ticketId, isCallActive: initialIsCallActive = false }: LogInteractionFormProps) {
  const { toast } = useToast();
  
  const [interactionChannel, setInteractionChannel] = useState<InteractionChannel>('Note');
  const [interactionContent, setInteractionContent] = useState("");
  const [isLiveCall, setIsLiveCall] = useState(initialIsCallActive);
  const [callDuration, setCallDuration] = useState(0);
  const [callDetails, setCallDetails] = useState({
      startTime: initialIsCallActive ? new Date().toISOString() : '',
      endTime: '',
      purpose: '',
      discussion: '',
      output: '',
      nextAction: '',
  });

  useEffect(() => {
    if (initialIsCallActive) {
      setInteractionChannel('Phone');
      setIsLiveCall(true);
      setCallDetails(prev => ({ ...prev, startTime: new Date().toISOString() }));
    } else {
      setIsLiveCall(false);
    }
  }, [initialIsCallActive]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLiveCall) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLiveCall]);
  
  const handleEndCall = () => {
    setIsLiveCall(false);
    setCallDetails(prev => ({ ...prev, endTime: new Date().toISOString() }));
  };

  const formatDuration = (seconds: number) => {
      const date = new Date(0);
      date.setSeconds(seconds);
      const time = date.toISOString().substr(14, 5);
      return time;
  };
  
  const handleAddReply = () => {
    let interactionData: Omit<Interaction, 'id' | 'date' | 'agent'>;

    if (interactionChannel === 'Phone') {
        if (!callDetails.purpose || !callDetails.discussion) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Please fill out all call details."});
            return;
        }
        const durationInSeconds = callDetails.startTime && callDetails.endTime ? Math.round((new Date(callDetails.endTime).getTime() - new Date(callDetails.startTime).getTime()) / 1000) : callDuration;
        
        interactionData = {
            type: 'Call',
            channel: 'Phone',
            content: callDetails.purpose,
            duration: `${Math.floor(durationInSeconds / 60)}m ${durationInSeconds % 60}s`,
            ticketId,
            ...callDetails,
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
    setCallDetails({ startTime: '', endTime: '', purpose: '', discussion: '', output: '', nextAction: '' });
    setInteractionChannel('Note');
    setCallDuration(0);
  };

  const renderInteractionForm = () => {
      if (initialIsCallActive && isLiveCall) {
          return (
             <div className="flex items-center justify-between p-4 border rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                    <Badge variant={'default'}>
                        <Phone className="mr-2 h-4 w-4 animate-pulse"/>
                        Calling
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">{formatDuration(callDuration)}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={handleEndCall}>
                    <PhoneOff className="mr-2 h-4 w-4"/>
                    End Call
                </Button>
            </div>
          );
      }

      if (interactionChannel === 'Phone') {
          return (
              <div className="space-y-4">
                   <div className="space-y-2">
                      <Label htmlFor="call-purpose">Purpose *</Label>
                      <Input id="call-purpose" placeholder="e.g., Follow up on recent order" value={callDetails.purpose} onChange={e => setCallDetails({...callDetails, purpose: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="call-discussion">Discussion Summary *</Label>
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

  const showChannelSelector = !initialIsCallActive || (initialIsCallActive && !isLiveCall);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Log Interaction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {showChannelSelector && (
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
            )}
            {renderInteractionForm()}
        </CardContent>
       {(!initialIsCallActive || (initialIsCallActive && !isLiveCall)) && (
            <CardFooter className="justify-end">
                <Button onClick={handleAddReply}>
                    <Send className="mr-2 h-4 w-4" />
                    Add Interaction
                </Button>
            </CardFooter>
       )}
    </Card>
  );
}
