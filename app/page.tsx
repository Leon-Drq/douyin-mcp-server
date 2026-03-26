import { DouyinExtractor } from "@/components/douyin-extractor";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen py-16 px-6 md:px-0">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <header className="mb-16 border-b border-border pb-8">
          <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
            Tool · Douyin MCP Server
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-normal leading-tight text-balance text-ink">
            抖音文案<br />
            <em>提取器</em>
          </h1>
          <p className="mt-4 text-muted text-lg leading-relaxed max-w-prose">
            粘贴抖音分享链接，获取无水印视频信息或提取语音文案。
          </p>
        </header>

        {/* Main Tool */}
        <DouyinExtractor />

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-border">
          <p className="font-mono text-xs text-muted">
            基于 <a
              href="https://github.com/Leon-Drq/douyin-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink transition-colors duration-150"
            >douyin-mcp-server</a> · 阿里云百炼 Paraformer-v2
          </p>
        </footer>
      </div>
    </main>
  );
}
