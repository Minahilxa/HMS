
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
                          <div className="flex justify-center gap-1">
                             <button className="p-2 text-slate-400 hover:text-sky-600"><Icons.Dashboard className="w-4 h-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'blogs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {blogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group">
                 <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                       <button onClick={() => handleToggleStatus('blog', blog.id, blog.status)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg ${blog.status === 'Published' ? 'bg-white text-green-600' : 'bg-white text-slate-400'}`}>{blog.status}</button>
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
                       <button className="text-sky-600 font-black text-[10px] uppercase hover:underline tracking-widest">Edit Post</button>
                    </div>
                 </div>
              </div>
           ))}
           <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-300 hover:text-sky-600 hover:border-sky-300 transition-all cursor-pointer">
              <Icons.Prescription className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-black uppercase text-xs tracking-widest">Write New Article</p>
           </div>
        </div>
      )}

      {activeTab === 'sliders' && (
        <div className="space-y-4">
           {sliders.map(slider => (
              <div key={slider.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                 <div className="w-32 aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white overflow-hidden">
                    <span className="text-[10px] font-black uppercase opacity-40">Banner Preview</span>
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{slider.title}</h4>
                    <p className="text-xs text-slate-500">{slider.subTitle}</p>
                    <div className="mt-2 flex gap-2">
                       <span className="bg-slate-100 text-[8px] font-black px-2 py-0.5 rounded text-slate-500 uppercase">{slider.buttonText}</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] font-bold text-slate-400">Order: {slider.order}</p>
                       <button onClick={() => handleToggleStatus('slider', slider.id, slider.isActive)} className={`w-12 h-6 rounded-full transition-colors relative ${slider.isActive ? 'bg-green-500' : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${slider.isActive ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>
                    <button className="text-sky-600 font-bold text-[10px] uppercase hover:underline">Customize Assets</button>
                 </div>
              </div>
           ))}
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
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
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
                             <button className="text-[10px] font-black text-slate-400 uppercase hover:text-sky-600">Edit Marketing Bio</button>
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
           {seo.map(item => (
              <div key={item.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Global SEO: {item.pageName}</h2>
                    <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all">Save Changes</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Browser Title Tag</label>
                          <input defaultValue={item.titleTag} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Meta Keywords (Comma separated)</label>
                          <input defaultValue={item.keywords} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Meta Description</label>
                       <textarea defaultValue={item.metaDescription} className="w-full h-[124px] px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none" />
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default CMSManagement;
