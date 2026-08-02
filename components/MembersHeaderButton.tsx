import { useMemberMeetingsAccess } from '@/lib/useMemberMeetingsAccess';
import MemberCodePrompt from './MemberCodePrompt';

export default function MembersHeaderButton() {
  const { open, setOpen, handleClick, goToMeetings } = useMemberMeetingsAccess();

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="cursor-pointer rounded border border-white/25 bg-transparent px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-white/65 hover:border-white/50 hover:bg-white/10 hover:text-white"
      >
        Members
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Member access"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-sm text-left" onClick={(event) => event.stopPropagation()}>
            <MemberCodePrompt
              showCancel
              onCancel={() => setOpen(false)}
              onSuccess={goToMeetings}
            />
          </div>
        </div>
      )}
    </>
  );
}
