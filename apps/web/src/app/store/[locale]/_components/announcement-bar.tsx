interface AnnouncementBarProps {
  message?: string;
}

export function AnnouncementBar({ message }: AnnouncementBarProps) {
  if (!message) return null;

  return (
    <div className="bg-[var(--color-primary)] py-2 text-center text-sm font-medium text-white">
      {message}
    </div>
  );
}
