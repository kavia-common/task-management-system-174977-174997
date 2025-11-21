import React, { useEffect, useRef } from 'react';

/**
 * Simple accessible modal dialog.
 * Traps focus and closes on backdrop click or ESC.
 */
// PUBLIC_INTERFACE
export default function Modal({ isOpen, onClose, title = 'Dialog', children, ariaLabelledById }) {
  /** Accessible modal */
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      // Focus the dialog container
      setTimeout(() => dialogRef.current && dialogRef.current.focus(), 0);
      const handleKey = (e) => {
        if (e.key === 'Escape') {
          onClose?.();
        }
        // very light focus trap
        if (e.key === 'Tab' && dialogRef.current) {
          const focusable = dialogRef.current.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    } else if (previouslyFocused.current) {
      previouslyFocused.current.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose?.();
    }
  };

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onMouseDown={onBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledById}
        className="modal-surface"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="modal-header">
          <h2 id={ariaLabelledById} className="modal-title">{title}</h2>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
