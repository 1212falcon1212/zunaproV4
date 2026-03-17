import type { Block } from '@zunapro/types';

interface SocialLinksProps {
  block: Block;
  locale: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  twitter: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  instagram: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z',
  youtube: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z',
  tiktok: 'M9 12a4 4 0 104 4V4a5 5 0 005 5',
};

export function SocialLinksBlock({ block }: SocialLinksProps) {
  const props = block.props as {
    links?: SocialLink[];
    size?: 'sm' | 'md' | 'lg';
    color?: string;
  };

  const links = props.links || [];
  const size = props.size || 'md';

  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {links.map((link, index) => {
        const iconPath = SOCIAL_ICONS[link.platform];
        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-2 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]"
            style={props.color ? { color: props.color } : undefined}
          >
            {iconPath ? (
              <svg
                className={sizeClass[size]}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={iconPath}
                />
              </svg>
            ) : (
              <span className="text-sm capitalize">{link.platform}</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
