
import { Interaction } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InteractionTimelineItem } from "./interaction-timeline-item";

interface InteractionTimelineProps {
  interactions: Interaction[];
  onUpdateInteraction: (interaction: Interaction) => void;
}

export function InteractionTimeline({ interactions, onUpdateInteraction }: InteractionTimelineProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interaction Timeline</CardTitle>
        <CardDescription>A log of all communications and activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-8">
            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>
            {interactions.map((interaction) => (
                <InteractionTimelineItem 
                  key={interaction.id} 
                  interaction={interaction}
                  onUpdateInteraction={onUpdateInteraction}
                />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
