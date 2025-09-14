'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Link as LinkIcon, Link2Off, PlusCircle } from "lucide-react";
import { Identity } from "@/lib/types";
import { Icons } from "../icons";

interface LinkedIdentitiesProps {
  identities: Identity[];
}

const getIcon = (channel: Identity['channel']) => {
  switch (channel) {
    case 'Phone': return <Phone className="h-5 w-5 text-muted-foreground" />;
    case 'Email': return <Mail className="h-5 w-5 text-muted-foreground" />;
    case 'Facebook': return <Icons.facebook className="h-5 w-5 text-muted-foreground" />;
    case 'Zalo': return <Icons.zalo className="h-5 w-5 text-muted-foreground" />;
    default: return <LinkIcon className="h-5 w-5 text-muted-foreground" />;
  }
}

export function LinkedIdentities({ identities }: LinkedIdentitiesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Linked Identities</CardTitle>
        <Button variant="ghost" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Link
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {identities.map((identity) => (
            <div key={`${identity.channel}-${identity.identifier}`} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getIcon(identity.channel)}
                <div>
                  <p className="font-medium text-sm">{identity.channel}</p>
                  <p className="text-xs text-muted-foreground">{identity.identifier}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Link2Off className="h-4 w-4" />
                <span className="sr-only">Unlink</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
