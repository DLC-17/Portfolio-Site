"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type ProjectType = "Contract" | "Full-time" | "Part-time";

interface ContactDialogProps {
  children?: React.ReactNode;
}

export function ContactDialog({ children }: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Full-time");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail && !trimmedPhone) {
      setError("Please provide at least one form of contact (email address or phone/LinkedIn) so David can reach you.");
      setLoading(false);
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          phone: trimmedPhone,
          projectType,
          message: message.trim(),
          website,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setProjectType("Full-time");
    setMessage("");
    setWebsite("");
    setSuccess(false);
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          handleReset();
        }
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="default" className="gap-2">
            <Mail className="size-4" />
            Get in Touch
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-6 text-primary" />
            </div>
            <DialogTitle className="mb-2 text-xl font-semibold">Message Sent!</DialogTitle>
            <DialogDescription className="mb-6 max-w-xs text-sm text-muted-foreground">
              Thanks for reaching out! I will review your note and get back to you promptly.
            </DialogDescription>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                handleReset();
              }}
              className="border-border/80"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Get in Touch</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Have an opportunity, consulting inquiry, or technical project? Send a note directly below.
              </DialogDescription>
            </DialogHeader>

            {error ? (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Honeypot field (hidden from view) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Your Name <span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-border/80"
                />
              </div>

              <div className="space-y-2.5 rounded-lg border border-border/80 bg-muted/20 p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Contact Method <span className="text-destructive">*</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    (At least one required)
                  </span>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className="border-border/80 bg-background"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                    Phone Number or LinkedIn
                  </label>
                  <Input
                    type="text"
                    placeholder="+1 (555) 000-0000 or linkedin.com/in/jane"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError(null);
                    }}
                    className="border-border/80 bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Engagement Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Full-time", "Contract", "Part-time"] as ProjectType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProjectType(type)}
                      className={`rounded-md border py-1.5 text-xs font-medium transition-colors ${
                        projectType === type
                          ? "border-primary bg-primary text-primary-foreground font-semibold"
                          : "border-border/80 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about your team, project, or role..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md border border-border/80 bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
