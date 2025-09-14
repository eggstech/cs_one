import { MergeProfilesClient } from './merge-profiles-client';

export default function MergePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merge Duplicate Profiles</h1>
          <p className="text-muted-foreground">
            Consolidate customer records to maintain data integrity.
          </p>
        </div>
      </div>
      <MergeProfilesClient />
    </div>
  );
}
