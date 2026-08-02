import { useId, useState, type FormEvent } from 'react';
import { grantMemberAccess, isValidMemberCode } from '@/lib/memberAccess';

interface MemberCodePromptProps {
  title?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export default function MemberCodePrompt({
  title = 'Members',
  onSuccess,
  onCancel,
  showCancel = false,
}: MemberCodePromptProps) {
  const errorId = useId();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidMemberCode(code)) {
      setError('Incorrect code. Try again.');
      return;
    }
    grantMemberAccess();
    setError(null);
    onSuccess();
  }

  return (
    <div className="rounded-[var(--radius-default)] border border-border bg-white p-6 shadow-[var(--shadow-card)] max-md:p-4">
      <h2 className="mb-2 text-xl text-green">{title}</h2>
      <p className="mb-4 text-sm text-text-muted">Enter the member code to continue.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-green">
          Member code
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (error) setError(null);
            }}
            className="rounded-md border border-border bg-cream px-3 py-2.5 font-body text-base font-normal text-text outline-none focus:border-green-light"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        </label>
        {error && (
          <p id={errorId} className="m-0 text-sm text-rust" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-light"
          >
            Continue
          </button>
          {showCancel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-semibold text-text-muted hover:border-green-light hover:text-green"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
