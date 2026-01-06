
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { CMSPage, CMSBlog, CMSSlider, CMSSEOSetting, Doctor } from '../types';
import { Icons } from '../constants';

const CMSManagement: React.FC = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [blogs, setBlogs] = useState<CMSBlog[]>([]);
  const [sliders, setSliders] = useState<CMSSlider[]>([]);
  const [seo, setSeo] = useState<CMSSEOSetting[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pages' | 'blogs' | 'sliders' | 'doctors' | 'seo'>('pages');

  // Modals
  const [showPageModal, setShowPageModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Editing states
  const [editingItem, setEditingItem] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [p, b, s, seoData, docs] = await Promise.all([
      apiService.getCMSPages(),
      apiService.getCMSBlogs(),
      apiService.getCMSSliders(),
      apiService.getCMSSEO(),
      apiService.getDoctors()
    ]);
    setPages(p);
    setBlogs(b);
    setSliders(s);
    setSeo(seoData);
    setDoctors(docs);
    setLoading(false);
  };

  const handleToggleStatus = async (type: 'page' | 'blog' | 'slider' | 'doctor', id: string, current: any) => {
    if (type === 'page') await apiService.updateCMSPage(id, { status: current === 'Published' ? 'Draft' : 'Published' });
    if (type === 'blog') await apiService.updateCMSBlog(id, { status: current === 'Published' ? 'Draft' : 'Published' });
    if (type === 'slider') await apiService.updateCMSSlider(id, { isActive: !current });
    if (type === 'doctor') await apiService.updateDoctorCMS(id, { displayOnWeb: !current });
    loadData();
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Permanently delete this ${type}?`)) return;
    if (type === 'page') await apiService.deleteCMSPage(id);
    if (type === 'blog') await apiService.deleteCMSBlog(id);
    if (type === 'slider') await apiService.deleteCMSSlider(id);
    if (type === 'seo') await apiService.deleteCMSSEO(id);
    loadData();
  };

  const handlePageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get('title') as string,
      slug: fd.get('slug') as string,
      content: fd.get('content') as string,
      status: fd.get('status') as any
    };
    editingItem ? await apiService.updateCMSPage(editingItem.id, data) : await apiService.createCMSPage(data);
    setShowPageModal(false);
    loadData();
  };

  const handleBlogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get('title') as string,
      category: fd.get('category') as string,
      author: fd.get('author') as string,
      excerpt: fd.get('excerpt') as string,
      status: fd.get('status') as any
    };
    editingItem ? await apiService.updateCMSBlog(editingItem.id, data) : await apiService.createCMSBlog(data);
    setShowBlogModal(false);
    loadData();
  };

  const handleSliderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get('title') as string,
      subTitle: fd.get('subTitle') as string,
      buttonText: fd.get('buttonText') as string,
      buttonLink: fd.get('buttonLink') as string,
      order: parseInt(fd.get('order') as string),
      isActive: true
    };
    editingItem ? await apiService.updateCMSSlider(editingItem.id, data) : await apiService.createCMSSlider(data);
    setShowSliderModal(false);
    loadData();
  };

  const handleSeoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      pageName: fd.get('pageName') as string,
      titleTag: fd.get('titleTag') as string,
      metaDescription: fd.get('metaDescription') as string,
      keywords: fd.get('keywords') as string,
    };
    editingItem ? await apiService.updateCMSSEO(editingItem.id, data) : await apiService.createCMSSEO(data);
    setShowSeoModal(false);
    loadData();
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      publicBio: fd.get('publicBio') as string,
      displayOnWeb: fd.get('displayOnWeb') === 'on'
    };
    await apiService.updateDoctorCMS(editingItem.id, data);
    setShowProfileModal(false);
    loadData();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.DocumentText className="w-8 h-8 mr-3 text-sky-600" />
            Content Management (CMS)
          </h1>
          <p className="text-sm text-slate-500">Administrate public-facing website content, marketing assets, and SEO configurations.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab('pages')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'pages' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Pages</button>
          <button onClick={() => setActiveTab('blogs')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'blogs' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Blogs & News</button>
          <button onClick={() => setActiveTab('sliders')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'sliders' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Sliders</button>
          <button onClick={() => setActiveTab('doctors')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'doctors' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Web Profiles</button>
          <button onClick={() => setActiveTab('seo')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'seo' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>SEO Settings</button>
        </div>
      </div>

      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => { setEditingItem(null); setShowPageModal(true); }} className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-sky-700 transition-all flex items-center">
              Create New Page
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Page Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Slug / Link</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Modified</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pages.map(page => (
                      <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{page.title}</td>
                        <td className="px-6 py-4 text-xs text-sky-600 font-medium">/{page.slug}</td>
                        <td className="px-6 py-4 text-center">
                            <button onClick={() => handleToggleStatus('page', page.id, page.status)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${page.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>{page.status}</button>
                        </td>
                        <td className="px-6 py-4 text-center text-[10px] text-slate-400 font-bold">{page.lastUpdated}</td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => { setEditingItem(page); setShowPageModal(true); }} className="p-2 text-slate-400 hover:text-sky-600"><Icons.Cog6Tooth className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('page', page.id)} className="p-2 text-slate-400 hover:text-red-500"><Icons.Logout className="w-4 h-4" /></button>
                            </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'blogs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {blogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group">
                 <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                       <button onClick={() => handleToggleStatus('blog', blog.id, blog.status)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg ${blog.status === 'Published' ? 'bg-white text-green-600' : 'bg-white text-slate-400'}`}>{blog.status}</button>
                       <button onClick={() => { setEditingItem(blog); setShowBlogModal(true); }} className="bg-white p-1 rounded-full text-slate-400 hover:text-sky-600 shadow-lg"><Icons.Cog6Tooth className="w-4 h-4"/></button>
                       <button onClick={() => handleDelete('blog', blog.id)} className="bg-white p-1 rounded-full text-slate-400 hover:text-red-600 shadow-lg"><Icons.Logout className="w-4 h-4"/></button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                       <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>
                    </div>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] text-sky-600 font-black uppercase tracking-widest mb-1">{blog.category}</p>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-xs text-slate-500 mb-6 line-clamp-2">{blog.excerpt}</p>
                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                       <span className="text-[10px] text-slate-400 font-bold uppercase">{blog.date}</span>
                       <span className="text-[8px] text-slate-400 italic">By {blog.author}</span>
                    </div>
                 </div>
              </div>
           ))}
           <div 
            onClick={() => { setEditingItem(null); setShowBlogModal(true); }}
            className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-300 hover:text-sky-600 hover:border-sky-300 transition-all cursor-pointer"
           >
              <Icons.Prescription className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-black uppercase text-xs tracking-widest">Write New Article</p>
           </div>
        </div>
      )}

      {activeTab === 'sliders' && (
        <div className="space-y-6">
           <div className="flex justify-end">
            <button onClick={() => { setEditingItem(null); setShowSliderModal(true); }} className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-sky-700 transition-all flex items-center">
              Add Slider
            </button>
          </div>
          <div className="space-y-4">
            {sliders.map(slider => (
                <div key={slider.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group">
                  <div className="w-32 aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white overflow-hidden shrink-0">
                      <span className="text-[10px] font-black uppercase opacity-40">Banner</span>
                  </div>
                  <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{slider.title}</h4>
                      <p className="text-xs text-slate-500">{slider.subTitle}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="bg-slate-100 text-[8px] font-black px-2 py-0.5 rounded text-slate-500 uppercase">{slider.buttonText} → {slider.buttonLink}</span>
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-slate-400">Order: {slider.order}</p>
                        <button onClick={() => handleToggleStatus('slider', slider.id, slider.isActive)} className={`w-12 h-6 rounded-full transition-colors relative ${slider.isActive ? 'bg-green-500' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${slider.isActive ? 'right-1' : 'left-1'}`}></div>
                        </button>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingItem(slider); setShowSliderModal(true); }} className="text-sky-600 font-bold text-[10px] uppercase hover:underline">Edit</button>
                        <button onClick={() => handleDelete('slider', slider.id)} className="text-red-500 font-bold text-[10px] uppercase hover:underline">Delete</button>
                      </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Clinician</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Public Bio Snippet</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Web Visibility</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {doctors.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.specialization}</p>
                       </td>
                       <td className="px-6 py-4 max-w-sm">
                          <p className="text-xs text-slate-500 line-clamp-1 italic">{doc.publicBio || 'No public bio set.'}</p>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <button onClick={() => handleToggleStatus('doctor', doc.id, doc.displayOnWeb)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${doc.displayOnWeb ? 'bg-sky-50 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                             {doc.displayOnWeb ? 'Visible' : 'Hidden'}
                          </button>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex justify-center">
                             <button 
                              onClick={() => { setEditingItem(doc); setShowProfileModal(true); }}
                              className="text-[10px] font-black text-slate-400 uppercase hover:text-sky-600"
                             >
                              Edit Marketing Bio
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => { setEditingItem(null); setShowSeoModal(true); }} className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-sky-700 transition-all flex items-center">
              New SEO Profile
            </button>
          </div>
          {seo.map(item => (
              <div key={item.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 group">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Page: {item.pageName}</h2>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(item); setShowSeoModal(true); }} className="bg-slate-100 text-slate-600 px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">Edit SEO</button>
                      <button onClick={() => handleDelete('seo', item.id)} className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100">Delete</button>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Browser Title Tag</label>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-700">{item.titleTag}</div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Meta Keywords</label>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500">{item.keywords}</div>
                       </div>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Meta Description</label>
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 h-full">{item.metaDescription}</div>
                    </div>
                 </div>
              </div>
          ))}
        </div>
      )}

      {/* Page Modal */}
      {showPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Page' : 'New Page'}</h3>
                <button onClick={() => setShowPageModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handlePageSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input name="title" required defaultValue={editingItem?.title} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Slug</label>
                    <input name="slug" required defaultValue={editingItem?.slug} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="page-url" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Content (HTML Support)</label>
                  <textarea name="content" required defaultValue={editingItem?.content} className="w-full h-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none resize-none" />
                </div>
                <div className="flex justify-between items-center">
                  <select name="status" defaultValue={editingItem?.status || 'Draft'} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                  <button type="submit" className="bg-sky-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-sky-700 transition-all uppercase text-xs">Save Page</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Article' : 'New Blog Post'}</h3>
                <button onClick={() => setShowBlogModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleBlogSubmit} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                  <input name="title" required defaultValue={editingItem?.title} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                    <input name="category" required defaultValue={editingItem?.category} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. Health" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Author</label>
                    <input name="author" required defaultValue={editingItem?.author} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Short Excerpt</label>
                  <textarea name="excerpt" required defaultValue={editingItem?.excerpt} className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none resize-none" />
                </div>
                <div className="flex justify-between items-center">
                  <select name="status" defaultValue={editingItem?.status || 'Draft'} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                  <button type="submit" className="bg-sky-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-sky-700 transition-all uppercase text-xs">Publish Article</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Slider Modal */}
      {showSliderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Slide' : 'New Slider Asset'}</h3>
                <button onClick={() => setShowSliderModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleSliderSubmit} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Headline</label>
                  <input name="title" required defaultValue={editingItem?.title} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subheadline</label>
                  <input name="subTitle" required defaultValue={editingItem?.subTitle} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Button Text</label>
                    <input name="buttonText" required defaultValue={editingItem?.buttonText} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. Explore" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Link</label>
                    <input name="buttonLink" required defaultValue={editingItem?.buttonLink} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="/about" />
                  </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Order</label>
                    <input name="order" type="number" required defaultValue={editingItem?.order || 1} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all uppercase text-xs">Save Slider Asset</button>
             </form>
          </div>
        </div>
      )}

      {/* SEO Modal */}
      {showSeoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit SEO' : 'New SEO Rule'}</h3>
                <button onClick={() => setShowSeoModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleSeoSubmit} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Page Name</label>
                  <input name="pageName" required defaultValue={editingItem?.pageName} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. About Page" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Browser Title Tag</label>
                  <input name="titleTag" required defaultValue={editingItem?.titleTag} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Meta Description</label>
                  <textarea name="metaDescription" required defaultValue={editingItem?.metaDescription} className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Focus Keywords</label>
                  <input name="keywords" required defaultValue={editingItem?.keywords} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-sky-700 transition-all uppercase text-xs">Save Meta Data</button>
             </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-6 bg-sky-50 border-b border-sky-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-sky-800">Web Profile: {editingItem?.name}</h3>
                <button onClick={() => setShowProfileModal(false)} className="text-sky-400 hover:text-sky-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleProfileSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Public Biography</label>
                  <textarea name="publicBio" defaultValue={editingItem?.publicBio} className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none resize-none" placeholder="Introduce the specialist to the public..." />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="displayOnWeb" id="vis" defaultChecked={editingItem?.displayOnWeb} className="w-4 h-4 rounded text-sky-600" />
                  <label htmlFor="vis" className="text-sm font-bold text-slate-700">Display this profile on hospital website</label>
                </div>
                <button type="submit" className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-sky-700 transition-all uppercase text-xs">Update Specialist Bio</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSManagement;
