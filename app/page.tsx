"use client";

import { useState, useEffect } from "react";

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

function ApiKeySection() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("douyin_api_key") || "";
    setApiKey(stored);
  }, []);

  function handleSave() {
    localStorage.setItem("douyin_api_key", apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="border-t border-gray-200 pt-8 space-y-3">
      <p className="font-mono text-xs text-gray-500 tracking-wider uppercase">
        阿里云百炼 API Key
      </p>
      <p className="text-sm text-gray-500 leading-relaxed">
        提取语音文案需要配置阿里云百炼平台的 API Key，密钥仅保存在本地浏览器中。
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={visible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-transparent border border-gray-200 px-4 py-2.5 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-150"
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-400 hover:text-gray-900 transition-colors"
          >
            {visible ? "隐藏" : "显示"}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="font-mono text-sm text-white bg-gray-900 px-5 py-2.5 hover:opacity-80 transition-opacity duration-150 whitespace-nowrap"
        >
          {saved ? "已保存" : "保存"}
        </button>
      </div>
    </div>
  );
}

function VideoResult({
  info,
  text,
}: {
  info: VideoInfo;
  text?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!text) return;
    const content = `# ${info.title}\n\n${text}`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${info.video_id || "transcript"}.md`;
    a.click();
  }

  return (
    <div className="space-y-6 border-t border-gray-200 pt-8">
      <div className="space-y-2">
        <p className="font-mono text-xs text-gray-500 tracking-wider uppercase">视频信息</p>
        <p className="text-xl text-gray-900 leading-snug">{info.title}</p>
        <p className="font-mono text-xs text-gray-400">ID: {info.video_id}</p>
      </div>

      {info.download_url && (
        <div>
          <a
            href={info.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-gray-900 underline hover:opacity-60 transition-opacity"
          >
            下载无水印视频
          </a>
        </div>
      )}

      {text && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-gray-500 tracking-wider uppercase">语音文案</p>
            <div className="flex gap-4">
              <button
                onClick={handleCopy}
                className="font-mono text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                {copied ? "已复制" : "复制"}
              </button>
              <button
                onClick={handleDownload}
                className="font-mono text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                下载 Markdown
              </button>
            </div>
          </div>
          <div className="border border-gray-200 px-5 py-4 font-mono text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}

function DouyinExtractor() {
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
        if (!apiKey) throw new Error("请先在下方配置 API Key");
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
      <div className="flex gap-6 font-mono text-sm border-b border-gray-200 pb-4">
        {(["info", "extract"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError("");
              setVideoInfo(null);
              setExtractResult(null);
            }}
            className={`transition-colors duration-150 pb-1 ${
              mode === m
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {m === "info" ? "获取视频信息" : "提取语音文案"}
          </button>
        ))}
      </div>

      {/* URL input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="font-mono text-xs text-gray-500 tracking-wider uppercase block mb-2">
            抖音分享链接
          </span>
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="粘贴分享链接或含链接的文本，例如：https://v.douyin.com/..."
            rows={3}
            className="w-full bg-transparent border border-gray-200 px-4 py-3 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-150 resize-none"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="font-mono text-sm text-white bg-gray-900 px-6 py-2.5 disabled:opacity-40 hover:opacity-80 transition-opacity duration-150"
        >
          {loading
            ? mode === "info" ? "获取中..." : "提取中，请稍候..."
            : mode === "info" ? "获取信息" : "提取文案"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="border border-gray-900 px-4 py-3 font-mono text-sm text-gray-900">
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

      {/* API Key */}
      {mode === "extract" && <ApiKeySection />}
    </section>
  );
}

export default function Home() {
  return (
    <main
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "#F8F7F3", color: "#1A1A1A", fontFamily: "Georgia, serif" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-16 border-b border-gray-200 pb-8">
          <p className="font-mono text-xs text-gray-400 tracking-widest uppercase mb-4">
            Tool · Douyin MCP Server
          </p>
          <h1 className="text-5xl font-normal leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            抖音文案
            <br />
            <em>提取器</em>
          </h1>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-prose">
            粘贴抖音分享链接，获取无水印视频信息或提取语音文案。
          </p>
        </header>

        <DouyinExtractor />

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-gray-200">
          <p className="font-mono text-xs text-gray-400">
            基于{" "}
            <a
              href="https://github.com/Leon-Drq/douyin-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 transition-colors"
            >
              douyin-mcp-server
            </a>{" "}
            · 阿里云百炼 Paraformer-v2
          </p>
        </footer>
      </div>
    </main>
  );
}
