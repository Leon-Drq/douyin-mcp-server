"use client";

import { useState } from "react";

interface VideoResultProps {
  info: {
    video_id: string;
    title: string;
    download_url: string;
  };
  text?: string;
}

export function VideoResult({ info, text }: VideoResultProps) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadMarkdown() {
    if (!text) return;
    const content = `# ${info.title}\n\n${text}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${info.video_id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="border-t border-border pt-8 space-y-6">
      {/* Video meta */}
      <div className="space-y-1">
        <p className="font-mono text-xs text-muted tracking-wider uppercase">视频标题</p>
        <p className="text-ink text-lg leading-snug">{info.title}</p>
      </div>

      <div className="space-y-1">
        <p className="font-mono text-xs text-muted tracking-wider uppercase">Video ID</p>
        <p className="font-mono text-sm text-ink">{info.video_id}</p>
      </div>

      {/* Download link */}
      <div className="space-y-2">
        <p className="font-mono text-xs text-muted tracking-wider uppercase">无水印下载链接</p>
        <a
          href={`/api/video/download?url=${encodeURIComponent(info.download_url)}&filename=${info.video_id}.mp4`}
          className="font-mono text-sm text-ink underline hover:opacity-60 transition-opacity duration-150 break-all"
        >
          下载视频
        </a>
      </div>

      {/* Transcript */}
      {text && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-muted tracking-wider uppercase">语音文案</p>
            <div className="flex gap-4 font-mono text-xs">
              <button
                onClick={copyText}
                className="text-muted hover:text-ink transition-colors duration-150 underline"
              >
                {copied ? "已复制" : "复制"}
              </button>
              <button
                onClick={downloadMarkdown}
                className="text-muted hover:text-ink transition-colors duration-150 underline"
              >
                下载 Markdown
              </button>
            </div>
          </div>
          <div className="border border-border p-4">
            <p className="text-ink text-base leading-relaxed whitespace-pre-wrap font-serif">
              {text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
