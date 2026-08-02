import { useRouter } from 'next/router';
import { useState } from 'react';
import { hasMemberAccess } from '@/lib/memberAccess';

export function useMemberMeetingsAccess() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function goToMeetings() {
    setOpen(false);
    void router.push('/meetings');
  }

  function handleClick() {
    if (hasMemberAccess()) {
      goToMeetings();
      return;
    }
    setOpen(true);
  }

  return {
    open,
    setOpen,
    handleClick,
    goToMeetings,
  };
}
