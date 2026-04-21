"use client";

import { useState, useTransition } from "react";
import { createJournalEntry } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default function JournalPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", content);
    fd.set("tags", tags);

    startTransition(async () => {
      const result = await createJournalEntry(fd);
      if (result.error) setError(result.error);
      else {
        setSuccess(true);
        setTitle("");
        setContent("");
        setTags("");
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            New Journal Entry
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            {success && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                Entry saved!
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="j-title">Title</Label>
              <Input
                id="j-title"
                placeholder="Today's reflection..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-content">Content</Label>
              <Textarea
                id="j-content"
                placeholder="Write about your progress, feelings, goals..."
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-tags">Tags (comma-separated)</Label>
              <Input
                id="j-tags"
                placeholder="rehab, mindset, pitching"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              {tags && (
                <div className="flex gap-1 flex-wrap">
                  {tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Entry"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
