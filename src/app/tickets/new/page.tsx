import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { NewTicketForm } from './new-ticket-form';

export const dynamic = 'force-dynamic';

export default function NewTicketPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <NewTicketForm />
    </Suspense>
  );
}
