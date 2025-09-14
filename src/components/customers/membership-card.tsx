import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Customer } from "@/lib/types";
import { Trophy } from "lucide-react";

interface MembershipCardProps {
  membership: NonNullable<Customer['membership']>;
}

const levelColors = {
    Bronze: "text-[#cd7f32]",
    Silver: "text-slate-400",
    Gold: "text-yellow-500",
}

export function MembershipCard({ membership }: MembershipCardProps) {
  const progressPercentage = (membership.points / membership.nextLevelPoints) * 100;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className={`h-5 w-5 ${levelColors[membership.level]}`}/>
            Membership
        </CardTitle>
        <CardDescription>Loyalty program status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline">
            <p className="text-2xl font-bold">{membership.level}</p>
            <p className="text-sm font-semibold">{membership.points} <span className="text-muted-foreground">Points</span></p>
        </div>
        <div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground text-center mt-2">
                {membership.nextLevelPoints - membership.points} points to next level
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
