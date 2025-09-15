import { MergeTicketsClient } from './merge-tickets-client';

export default function MergeTicketsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merge Duplicate Tickets</h1>
          <p className="text-muted-foreground">
            Consolidate duplicate tickets into a single record to streamline support.
          </p>
        </div>
      </div>
      <MergeTicketsClient />
    </div>
  );
}
