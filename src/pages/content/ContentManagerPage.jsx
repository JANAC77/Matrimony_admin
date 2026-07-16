import { useEffect, useState } from "react";
import { Loader2, Plus, Edit, Trash2, Globe, Heart, FileText, HelpCircle } from "lucide-react";



export default function ContentManagerPage() {
  const [activeTab, setActiveTab] = useState("blogs");
  const [banners, setBanners] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stories, setStories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [bannersRes, blogsRes, storiesRes, faqsRes] = await Promise.all([
        fetch("https://server.familiess.com/api/admin/banners", { headers }),
        fetch("https://server.familiess.com/api/admin/blogs", { headers }),
        fetch("https://server.familiess.com/api/admin/stories", { headers }),
        fetch("https://server.familiess.com/api/admin/faqs", { headers })
      ]);

      if (bannersRes.ok) setBanners(await bannersRes.json());
      if (blogsRes.ok) setBlogs(await blogsRes.json());
      if (storiesRes.ok) setStories(await storiesRes.json());
      if (faqsRes.ok) setFaqs(await faqsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://server.familiess.com/api/admin/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: blogTitle, content: blogContent, author: blogAuthor })
      });
      if (res.ok) {
        setBlogTitle("");
        setBlogContent("");
        setBlogAuthor("");
        fetchData();
      }
    } catch (err) {
      alert(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this content ${type}?`)) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://server.familiess.com/api/admin/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Content Management</h1>
        <p className="text-sm text-slate-600">Administer public homepage widgets, faq listings, blogs, and articles</p>
      </div>

      {/* Tab Selection */}
      <div className="mb-8 flex border-b border-slate-200 gap-6">
        {(["blogs", "stories", "banners", "faqs"]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-colors ${activeTab === tab
                ? "border-purple-500 text-purple-500"
                : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
          >
            {tab === "faqs" ? "FAQs" : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main List Column */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === "blogs" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" /> Published Blogs
                </h3>
                <div className="space-y-2">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="flex items-center justify-between rounded-xl bg-slate-200/70 border border-slate-200 p-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{blog.title}</h4>
                        <span className="text-xs text-slate-500 mt-1 block">Author: {blog.author}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(blog._id, "blogs")}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "stories" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-500" /> Success Testimonials
                </h3>
                <div className="space-y-2">
                  {stories.map((story) => (
                    <div key={story._id} className="flex items-center justify-between rounded-xl bg-slate-200/70 border border-slate-200 p-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{story.partnerAName} & {story.partnerBName}</h4>
                        <span className="text-xs text-slate-500 mt-1 block">Wedding Date: {new Date(story.weddingDate).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(story._id, "stories")}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "banners" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" /> Home Page Banners
                </h3>
                <div className="space-y-2">
                  {banners.map((banner) => (
                    <div key={banner._id} className="flex items-center justify-between rounded-xl bg-slate-200/70 border border-slate-200 p-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{banner.title}</h4>
                        <span className="text-xs text-slate-500 mt-1 block">Order: {banner.order}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(banner._id, "banners")}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "faqs" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-500" /> FAQ List
                </h3>
                <div className="space-y-2">
                  {faqs.map((faq) => (
                    <div key={faq._id} className="flex items-center justify-between rounded-xl bg-slate-200/70 border border-slate-200 p-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{faq.question}</h4>
                        <span className="text-xs text-slate-500 mt-1 block">Category: {faq.category}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(faq._id, "faqs")}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar form for quickly adding a Blog Post */}
          <div className="rounded-2xl bg-slate-200/70 border border-slate-200 p-6 h-fit space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Create Blog Article</h3>
              <p className="text-xs text-slate-500">Draft a new post for the public feed</p>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 font-semibold">Title</label>
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 font-semibold">Author</label>
                <input
                  type="text"
                  required
                  value={blogAuthor}
                  onChange={(e) => setBlogAuthor(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 font-semibold">Content</label>
                <textarea
                  rows={4}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-650 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> Publish Blog
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
