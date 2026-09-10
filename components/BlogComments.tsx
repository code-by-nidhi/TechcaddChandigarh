"use client";

import { useState } from "react";
import { Button, Icon, cx } from "@/components/ui";
import type { CmsComment } from "@/lib/cms";

/**
 * The comment thread under a blog post, and the form for adding to it.
 *
 * The thread itself is rendered from data the server already fetched — this is
 * a client component only because of the form. Nothing a visitor writes appears
 * here until a moderator approves it in the CMS, and the form says so before
 * they type rather than after they submit.
 */

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

const formatWhen = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/* ------------------------------------------------------------------ */
/* Thread                                                              */
/* ------------------------------------------------------------------ */

function CommentCard({ comment, nested = false }: { comment: CmsComment; nested?: boolean }) {
  return (
    <li className={cx(nested && "ml-6 border-l border-line pl-6 sm:ml-10 sm:pl-8")}>
      <article className="rounded-2xl border border-line bg-white p-5">
        <header className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hero-950 text-xs font-bold text-white">
            {initialsOf(comment.authorName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold wrap-anywhere">{comment.authorName}</p>
            <p className="text-xs text-muted">{formatWhen(comment.createdAt)}</p>
          </div>
        </header>

        {/*
          * Plain text, not markup. A comment is typed by a stranger, so it is
          * rendered as text and React escapes it — there is no sanitiser to
          * get wrong because no HTML is ever interpreted.
          */}
        <p className="mt-4 leading-relaxed whitespace-pre-wrap text-muted wrap-anywhere">
          {comment.body}
        </p>
      </article>

      {comment.replies.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} nested />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

function CommentForm({ blogSlug }: { blogSlug: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const authorName = String(data.get("authorName") ?? "").trim();
    const body = String(data.get("body") ?? "").trim();

    if (!authorName) return setError("Please tell us your name.");
    if (body.length < 2) return setError("Write a comment first.");

    setError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          blogSlug,
          authorName,
          email: String(data.get("email") ?? "").trim(),
          body,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(result?.error ?? "Could not post your comment.");
        setStatus("idle");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Could not reach the server. Please check your connection.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-brand-600/20 bg-brand-50 p-6">
        <p className="flex items-center gap-2 font-display font-bold text-brand-700">
          <Icon name="check" className="size-5" />
          Thanks — your comment is with us
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We read every one before it goes up, so it will appear here shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-subtle p-6">
      <h3 className="font-display text-lg font-bold tracking-tight">Leave a comment</h3>
      {/*
        * Said before they type, not after they submit. Discovering the delay
        * only once the comment vanishes reads as the form having failed.
        */}
      <p className="mt-1.5 text-sm text-muted">
        Comments are read before they appear, so yours will show up shortly.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Your name</span>
          <input
            name="authorName"
            required
            maxLength={120}
            autoComplete="name"
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand-600/40"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">
            Email <span className="font-normal text-muted">(optional, never shown)</span>
          </span>
          <input
            name="email"
            type="email"
            maxLength={190}
            autoComplete="email"
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand-600/40"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Comment</span>
        <textarea
          name="body"
          required
          rows={4}
          maxLength={2000}
          className="mt-1.5 w-full rounded-xl border border-line bg-white p-4 text-sm outline-none focus:border-brand-600/40"
        />
      </label>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <Button type="submit" className="mt-5" disabled={status === "sending"}>
        {status === "sending" ? "Posting…" : "Post comment"}
        <Icon name="arrow-right" className="size-4" />
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */

export function BlogComments({
  blogSlug,
  comments,
  total,
}: {
  blogSlug: string;
  comments: CmsComment[];
  total: number;
}) {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold tracking-tight">
        {total > 0 ? `Comments (${total})` : "Comments"}
      </h2>

      {comments.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted">
          No comments yet. Be the first to add one.
        </p>
      )}

      <div className="mt-8">
        <CommentForm blogSlug={blogSlug} />
      </div>
    </section>
  );
}
