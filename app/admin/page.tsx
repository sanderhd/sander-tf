import AdminBlogForm from "./AdminBlogForm";

export default function AdminPage() {
    return (
        <main className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Admin</h1>
            <AdminBlogForm />
        </main>
    )
}