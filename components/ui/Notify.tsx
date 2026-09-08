"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./Notify.module.css";

type Status = "idle" | "sending" | "done" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The one thing on the page that asks for something, so it stays folded away
 * until it is asked for. No modal, no panel — the label is replaced in place by
 * a single ruled field.
 */
export function Notify({ endpoint }: { endpoint: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    // One frame later: the field is still computed as hidden in this commit,
    // and a hidden element cannot take focus.
    const focus = requestAnimationFrame(() => {
      const field = inputRef.current;
      if (!field) return;
      // Flush the pending style change: a field still computed as hidden
      // silently refuses focus.
      void field.offsetWidth;
      field.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setStatus("idle");
      setMessage("");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focus);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const email = inputRef.current?.value.trim() ?? "";
    if (!EMAIL.test(email)) {
      setStatus("error");
      setMessage("Check that address");
      return;
    }

    // Anything that fills the trap field is not a person. Accept it, send nothing.
    if (trapRef.current?.value) {
      setStatus("done");
      setMessage("On the list");
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "coming-soon" }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("done");
      setMessage("On the list");
    } catch {
      setStatus("error");
      setMessage("Didn't send — try again");
    }
  };

  return (
    <div className={styles.root} data-open={open || undefined}>
      {status === "done" ? (
        <p className={styles.done} role="status">
          {message}
        </p>
      ) : (
        <>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="gh-notify"
            inert={open}
          >
            Get notified
          </button>

          <form id="gh-notify" className={styles.form} onSubmit={onSubmit} noValidate inert={!open}>
            <label className={styles.label} htmlFor="gh-notify-email">
              Email address
            </label>
            <input
              id="gh-notify-email"
              ref={inputRef}
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              spellCheck={false}
              enterKeyHint="go"
              onChange={() => {
                if (status === "error") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
            />
            <input
              ref={trapRef}
              className={styles.trap}
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <button type="submit" className={styles.submit} aria-label="Join the list">
              {status === "sending" ? "···" : "→"}
            </button>
          </form>
        </>
      )}

      <p className={styles.status} role="status" aria-live="polite">
        {status === "error" ? message : ""}
      </p>
    </div>
  );
}
