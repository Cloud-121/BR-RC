import { ReactNode, useEffect, useState } from 'react';
import { hasMemberAccess } from '@/lib/memberAccess';
import MemberCodePrompt from './MemberCodePrompt';

interface MeetingsGateProps {
  children: ReactNode;
}

export default function MeetingsGate({ children }: MeetingsGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(hasMemberAccess());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="mt-8 rounded-[var(--radius-default)] border border-border bg-white p-8 shadow-[var(--shadow-card)] max-md:p-6">
        <p className="m-0 text-text-muted">Checking member access…</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto mt-8 max-w-sm">
        <MemberCodePrompt title="Member access" onSuccess={() => setUnlocked(true)} />
      </div>
    );
  }

  return <>{children}</>;
}
