
import { Interaction } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InteractionTimelineItem } from "./interaction-timeline-item";
import { LogInteractionForm } from "./log-interaction-form";

interface InteractionTimelineProps {
  interactions: Interaction[];
  onAddInteraction: (interaction: Omit<Interaction, 'id' | 'date' | 'agent'>) => void;
  isCallActive?: boolean;
}

export function InteractionTimeline({ interactions, onAddInteraction, isCallActive }: InteractionTimelineProps) {

  return (
    <div className="space-y-6">
      <LogInteractionForm onAddInteraction={onAddInteraction} isCallActive={isCallActive} />
      <Card>
        <CardHeader>
          <CardTitle>Interaction Timeline</CardTitle>
          <CardDescription>A log of all communications and activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-8">
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>
              {interactions.filter(i => !i.isLive).map((interaction) => (
                  <InteractionTimelineItem 
                    key={interaction.id} 
                    interaction={interaction}
                  />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    