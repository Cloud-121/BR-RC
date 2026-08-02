import { useMemberMeetingsAccess } from '@/lib/useMemberMeetingsAccess';
import MemberCodePrompt from './MemberCodePrompt';

export default function MembersFooterButton() {
  const { open, setOpen, handleClick, goToMeetings } = useMemberMeetingsAccess();

  return (
    <div className="mx-auto mt-6 max-w-content border-t border-white/15 pt-5">
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleClick}
          className="cursor-pointer border-0 bg-transparent p-0 text-xs tracking-wide text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
        >
          Members
        </button>
        {open && (
          <div className="w-full max-w-sm text-left text-text">
            <MemberCodePrompt
              showCancel
              onCancel={() => setOpen(false)}
              onSuccess={goToMeetings}
            />
          </div>
        )}
      </div>
    </div>
  );
}
