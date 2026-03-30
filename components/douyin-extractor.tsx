"use client";

import { useState } from "react";
import { ApiKeySection } from "./api-key-section";
import { VideoResult } from "./video-result";

type Mode = "info" | "extract";

interface VideoInfo {
  success: boolean;
  video_id: string;
  title: string;
  download_url: string;
  error?: string;
}

interface ExtractResult extends VideoInfo {
  text: string;
}

export function DouyinExtractor() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<Mode>("info");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [extractResult, setExtractResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState("");

  function getApiKey() {
    return typeof window !== "undefined"
      ? localStorage.getItem("douyin_api_key") || ""
      : "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setVideoInfo(null);
    setExtractResult(null);

    try {
      if (mode === "info") {
        const res = await fetch("/api/video/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        const data: VideoInfo = await res.json();
        if (!data.success) throw new Error(data.error || "获取失败");
        setVideoInfo(data);
      } else {
        const apiKey = getApiKey();
        if (!apiKey) {
          throw new Error("请先在下方配置 API Key");
        }
        const res = await fetch("/api/video/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim(), api_key: apiKey }),
        });
        const data: ExtractResult = await res.json();
        if (!data.success) throw new Error(data.error || "提取失败");
        setExtractResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10">
      {/* Mode selector */}
      <div className="flex gap-6 font-mono text-sm border-b border-border pb-4">
        <button
          onClick={() => setMode("info")}
          className={`transition-colors duration-150 ${
            mode === "info"
              ? "text-ink border-b-2 border-ink pb-1"
              : "text-muted hover:text-ink"
          }`}
        >
          获取视频信息
        </button>
        <button
          onClick={() => setMode("extract")}
          className={`transition-colors duration-150 ${
            mode === "extract"
              ? "text-ink border-b-2 border-ink pb-1"
              : "text-muted hover:text-ink"
          }`}
        >
          提取语音文案
        </button>
      </div>

      {/* URL input form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="font-mono text-xs text-muted tracking-wider uppercase block mb-2">
            抖音分享链接
          </span>
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="粘贴分享链接或含链接的文本，例如：https://v.douyin.com/..."
            rows={3}
            className="w-full bg-transparent border border-border rounded-none px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors duration-150 resize-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="font-mono text-sm text-paper bg-ink px-6 py-2.5 disabled:opacity-40 hover:opacity-80 transition-opacity duration-150"
        >
          {loading
            ? mode === "info"
              ? "获取中..."
              : "提取中，请稍候..."
            : mode === "info"
            ? "获取信息"
            : "提取文案"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="border border-ink px-4 py-3 font-mono text-sm text-ink">
          {error}
        </div>
      )}

      {/* Result */}
      {(videoInfo || extractResult) && (
        <VideoResult
          info={extractResult || videoInfo!}
          text={extractResult?.text}
        />
      )}

      {/* API Key section - only shown in extract mode */}
      {mode === "extract" && (
        <ApiKeySection />
      )}
    </section>
  );
}
