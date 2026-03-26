"use client";

import { useState, useEffect } from "react";

export function ApiKeySection() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("douyin_api_key") || "";
    setApiKey(stored);
  }, []);

  function save() {
    localStorage.setItem("douyin_api_key", apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clear() {
    localStorage.removeItem("douyin_api_key");
    setApiKey("");
  }

  return (
    <div className="border-t border-border pt-8 space-y-4">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs text-muted tracking-wider uppercase">
          阿里云百炼 API Key
        </p>
        <span className="font-mono text-xs text-muted">
          存储于本地，不上传
        </span>
      </div>

      <div className="flex gap-3">
        <input
          type={show ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="flex-1 bg-transparent border border-border px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors duration-150"
        />
        <button
          onClick={() => setShow(!show)}
          className="font-mono text-xs text-muted hover:text-ink transition-colors duration-150 px-3 border border-border"
        >
          {show ? "隐藏" : "显示"}
        </button>
      </div>

      <div className="flex gap-4 font-mono text-xs">
        <button
          onClick={save}
          className="text-ink underline hover:opacity-60 transition-opacity duration-150"
        >
          {saved ? "已保存" : "保存"}
        </button>
        {apiKey && (
          <button
            onClick={clear}
            className="text-muted underline hover:text-ink transition-colors duration-150"
          >
            清除
          </button>
        )}
      </div>

      <p className="font-mono text-xs text-muted leading-relaxed">
        前往{" "}
        <a
          href="https://bailian.console.aliyun.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink transition-colors duration-150"
        >
          阿里云百炼控制台
        </a>{" "}
        获取 API Key。
      </p>
    </div>
  );
}
