"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Database, Download, Eye, Link2, Save, ShieldCheck } from "lucide-react";

type Preview = {
  url: string;
  title: string;
  description: string;
  price: string | null;
  images: string[];
  source: string;
  importType: "Property" | "Lead";
};

type Log = {
  id: string;
  url: string;
  type: "Property" | "Lead";
  status: string;
  source: string;
  message: string;
  createdAt: string;
};

export function DataImportApp() {
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"Property" | "Lead">("Property");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const response = await fetch("/api/import-logs");
    const payload = await response.json();
    setLogs(payload.logs ?? []);
  }

  async function handlePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Inspecting public page...");
    setPreview(null);

    const response = await fetch("/api/import-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, type })
    });
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "Could not preview this page.");
      setLoading(false);
      await loadLogs();
      return;
    }

    setPreview(payload);
    setMessage(`Preview ready from ${payload.source === "crawl4ai" ? "Crawl4AI" : "basic extractor"}.`);
    setLoading(false);
    await loadLogs();
  }

  async function handleSave() {
    if (!preview) return;

    setLoading(true);
    setMessage("Saving reviewed data into Twenty...");
    const response = await fetch("/api/import-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: preview.importType, data: preview })
    });
    const payload = await response.json();
    setMessage(payload.reason ?? payload.error ?? "Save completed.");
    setLoading(false);
    await loadLogs();
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
          <div>
            <a className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground" href="/">
              <ArrowLeft aria-hidden="true" />
              Back to prototype dashboard
            </a>
            <p className="text-sm font-semibold text-muted-foreground">Sergio's RealEstate + Twenty</p>
            <h1 className="mt-1 text-3xl font-bold">Data Import</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Preview public or authorized pages, review extracted data, then save clean records into Twenty.
            </p>
          </div>
          <div className="rounded-lg bg-primary p-4 text-primary-foreground">
            <Database aria-hidden="true" />
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <Link2 aria-hidden="true" />
              <h2 className="text-2xl font-bold">Import Source</h2>
            </div>
            <form className="mt-5 flex flex-col gap-4" onSubmit={handlePreview}>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Public URL
                <input
                  className="rounded-lg border border-border px-3 py-3 outline-none"
                  placeholder="https://example.com/public-property-page"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold">
                Import type
                <select
                  className="rounded-lg border border-border bg-white px-3 py-3 outline-none"
                  value={type}
                  onChange={(event) => setType(event.target.value as "Property" | "Lead")}
                >
                  <option>Property</option>
                  <option>Lead</option>
                </select>
              </label>

              <button
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60"
                disabled={loading}
              >
                <Eye aria-hidden="true" />
                Preview
              </button>
            </form>

            <div className="mt-5 rounded-lg bg-muted p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Guardrails are active: URL validation, restricted-domain blocking, robots.txt checks, and 10 previews
                  per minute.
                </p>
              </div>
            </div>

            {message && <p className="mt-4 rounded-lg border border-border p-3 text-sm">{message}</p>}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-lg border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Review Result</h2>
              <button
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground disabled:opacity-60"
                disabled={!preview || loading}
                onClick={handleSave}
              >
                <Save aria-hidden="true" />
                Save to Twenty
              </button>
            </div>

            {preview ? (
              <article className="mt-5 overflow-hidden rounded-lg border border-border">
                {preview.images?.[0] && (
                  <div className="relative h-72">
                    <Image src={preview.images[0]} alt={preview.title} fill className="object-cover" sizes="60vw" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {preview.importType} | {preview.source}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{preview.title}</h3>
                  {preview.price && <p className="mt-3 text-xl font-bold text-primary">{preview.price}</p>}
                  <p className="mt-3 text-muted-foreground">{preview.description || "No description extracted."}</p>
                  <p className="mt-4 break-all text-sm text-muted-foreground">{preview.url}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(preview.images ?? []).slice(0, 6).map((image) => (
                      <span key={image} className="rounded-lg bg-muted px-2 py-1 text-xs">
                        image
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ) : (
              <div className="mt-5 rounded-lg bg-muted p-8 text-center text-muted-foreground">
                Paste a permitted public URL and preview it before saving.
              </div>
            )}
          </motion.section>
        </div>

        <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <Download aria-hidden="true" />
            <h2 className="text-2xl font-bold">Scraping History</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {logs.length === 0 && <p className="text-muted-foreground">No imports yet.</p>}
            {logs.map((log) => (
              <div key={log.id} className="grid gap-2 rounded-lg border border-border p-3 lg:grid-cols-[120px_100px_1fr_180px]">
                <span className="font-semibold">{log.status}</span>
                <span>{log.type}</span>
                <span className="truncate text-muted-foreground">{log.url}</span>
                <span className="text-sm text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
