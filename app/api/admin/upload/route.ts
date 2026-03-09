import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync, write } from "fs";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
    const authenticated = await isAuthenticated();
    if (!authenticated) return new Response("Unauthorized", { status: 403 });
    
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return new Response("No file", { status: 400 });
    if (file.size > 10 * 1024 * 1024) return new Response("File too large", { status: 400});
    if (!file.type.startsWith("image/")) return new Response("Not an image", { status: 400});

    const uploadsDir = join(process.cwd(), "public", "thumbnails");
    if(!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_").toLowerCase()}`;
    await writeFile(join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));

    return Response.json({ url: `/thumbnails/${filename}`});
}