"use client";
import React, { useState } from "react";

export default function AdminBlogForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/admin/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, published: true }),
        });
        if (!res.ok) alert(await res.text());
        else {
            setTitle("");
            setContent("");
            alert("Saved");
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-2">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full" />
            <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" className="border p-2 w-full" />
            <button className="border px-3 py-2">Create</button>
        </form>
    );
}