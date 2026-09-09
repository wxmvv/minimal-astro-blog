import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Command } from 'cmdk';
import { navigate } from 'astro:transitions/client';
import './cmdkSearch.css';

interface Post {
  href: string;
  title: string;
  description: string;
  tags: string[];
}

export default function Search({
  posts,
  config = {},
  showTrigger = true,
}: {
  posts: Post[];
  config?: { placeholder?: string };
  showTrigger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [shortcut, setShortcut] = useState('Ctrl K');
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    setReady(true);
    setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey) || event.isComposing)
        return;
      event.preventDefault();
      if (!event.repeat) setOpen((value) => !value);
    };
    const close = () => flushSync(() => setOpen(false));
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('astro:before-preparation', close);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('astro:before-preparation', close);
    };
  }, []);

  useEffect(() => {
    let frame: number | undefined;
    if (!open && wasOpen.current) {
      setQuery('');
      frame = requestAnimationFrame(() => trigger.current?.focus());
    }
    wasOpen.current = open;
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [open]);

  return (
    <>
      {showTrigger && (
        <button
          ref={trigger}
          type="button"
          className="search-trigger"
          aria-label="搜索文章"
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={!ready}
          onClick={() => setOpen(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
          <span>搜索</span>
          <kbd>{shortcut}</kbd>
        </button>
      )}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="搜索文章"
        aria-describedby={undefined}
        loop
      >
        <div className="search-input-row">
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder={config.placeholder ?? '搜索文章标题、摘要或标签…'}
            aria-label="搜索文章"
          />
          <button
            type="button"
            className="search-close"
            onClick={() => setOpen(false)}
            aria-label="关闭搜索"
          >
            Esc
          </button>
        </div>
        <Command.List>
          <Command.Empty>没有找到相关文章，试试其他关键词。</Command.Empty>
          <Command.Group heading="文章">
            {posts.map((post) => (
              <Command.Item
                key={post.href}
                value={post.href}
                keywords={[post.title, post.description, ...post.tags]}
                onSelect={() => {
                  flushSync(() => setOpen(false));
                  void navigate(post.href);
                }}
              >
                <span className="search-result-title">{post.title}</span>
                {post.description && (
                  <span className="search-result-description">{post.description}</span>
                )}
                {post.tags.length > 0 && (
                  <span className="search-result-tags">{post.tags.join(' · ')}</span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
        <div className="search-footer">
          ↑ ↓ 选择 <span>↵ 打开文章</span>
        </div>
      </Command.Dialog>
    </>
  );
}
