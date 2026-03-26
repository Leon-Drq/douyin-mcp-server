import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") || "video.mp4";

  if (!url) {
    return NextResponse.json({ error: "缺少 url 参数" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/video/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "下载失败" }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "video/mp4";
    const contentDisposition =
      res.headers.get("content-disposition") ||
      `attachment; filename="${filename}"`;

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "无法连接到后端服务" },
      { status: 502 }
    );
  }
}
