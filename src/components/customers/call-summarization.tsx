'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { FileAudio, Sparkles, Loader2, Play, Pause } from 'lucide-react';
import { summarizeCall, SummarizeCallOutput } from '@/ai/flows/summarize-call';
import { useToast } from '@/hooks/use-toast';
import { Interaction } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from '../ui/textarea';
import { ChevronDown } from 'lucide-react';

interface CallSummarizationProps {
  interaction: Interaction;
}

const mockAudioDataUri = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAABoR2tGYUdQTk9JREdJS1BNSk9KTEpJR1BNSkpJSUpFREdDRURDQ0VBRlVORVVNT1VORVZVT0dFR0VDRUNFUERDQ0VDRUVERUdFRUVER0dGRUVFR0VFRUVFR0dFRUZHSEdIR0hISUdJSElIR0hIR0hISElISEhGRUdGRUZFRkVERERDQ0RCREJDP/7QMQ PAFVmYQPAAEAAAAPAAAEgAAAAAund2R2d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d//sA4gAAAAAAAwAABpFraWtpampoaGdnZ2ZlZWVlZGRkZGNjY2NjY2JiYmFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFiY2NjY2RkZGRlZWVmZmdnZ2hoaGlpaWlqampqa2tsbW1ubm9wcHFyc3N0dXV2dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tbW3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k=";

export function CallSummarization({ interaction }: CallSummarizationProps) {
  const [summary, setSummary] = useState<SummarizeCallOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeCall({ audioDataUri: mockAudioDataUri });
      
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSummary(result);
    } catch (error) {
      console.error('Failed to summarize call:', error);
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Could not generate a summary for this call recording.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const callDetails = [
      { label: "Discussion", value: interaction.discussion },
      { label: "Output / Resolution", value: interaction.output },
      { label: "Next Action", value: interaction.nextAction },
  ].filter(detail => detail.value);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-muted">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>
            <FileAudio className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">call_recording.mp3</span>
            <span className="text-xs text-muted-foreground">({interaction.duration})</span>
        </div>
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          AI Summarize
        </Button>
      </div>

      {isLoading && (
         <div className="space-y-2 p-4 border rounded-lg animate-pulse">
            <div className="h-4 bg-muted-foreground/20 rounded w-1/4"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
         </div>
      )}

      {summary && (
        <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>AI Summary</AlertTitle>
            <AlertDescription className="space-y-3">
                <div>
                    <h4 className="font-semibold">Overall Summary</h4>
                    <p>{summary.summary}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Sentiment</h4>
                    <p>{summary.sentiment}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Key Topics</h4>
                    <p>{summary.keyTopics}</p>
                </div>
            </AlertDescription>
        </Alert>
      )}
      
      {(callDetails.length > 0 || interaction.transcript) && (
        <Collapsible>
            <CollapsibleTrigger className='flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground w-full justify-center py-1 rounded-md bg-muted/50'>
                View Details <ChevronDown className='size-4' />
            </CollapsibleTrigger>
            <CollapsibleContent className='mt-4 space-y-4'>
                {callDetails.map(detail => (
                    <div key={detail.label}>
                        <h4 className="font-semibold">{detail.label}</h4>
                        <p className="text-muted-foreground">{detail.value}</p>
                    </div>
                ))}
                {interaction.transcript && (
                     <div>
                        <h4 className="font-semibold">Transcript</h4>
                        <Textarea readOnly value={interaction.transcript} className="mt-1 min-h-48 font-mono text-xs" />
                    </div>
                )}
            </CollapsibleContent>
        </Collapsible>
      )}

    </div>
  );
}
