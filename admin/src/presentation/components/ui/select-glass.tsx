import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../shared/utils/cn.ts';

interface Option {
  value: string;
  label: string;
}

interface SelectGlassProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

interface MenuCoords {
  top: number;
  left: number;
  width: number;
}

export function SelectGlass({
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  className,
}: SelectGlassProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 180),
    });
  }, []);

  useLayoutEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const handleScrollOrResize = () => updatePosition();

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open, updatePosition]);

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'input-glass flex w-full items-center justify-between gap-2.5 text-left cursor-pointer',
          open && 'border-brand shadow-[0_0_0_3px_rgb(var(--brand)/0.14)]',
        )}
      >
        <span className={cn('truncate font-medium', selected ? 'text-ink' : 'text-ink-muted')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 flex-shrink-0 transition-transform duration-200',
            open ? 'text-brand rotate-180' : 'text-ink-muted',
          )}
        />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              minWidth: `${coords.width}px`,
              padding: '8px',
              zIndex: 99999,
            }}
            className="popover-glass max-h-72 overflow-y-auto rounded-xl"
          >
            {options.map(opt => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors cursor-pointer min-h-[2.5rem]',
                    isActive
                      ? 'bg-brand/10 text-brand-strong font-semibold'
                      : 'text-ink-secondary hover:bg-line/45 hover:text-ink font-medium',
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isActive && <Check className="h-3.5 w-3.5 flex-shrink-0 text-brand" />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
