import { apiRequest } from "../client";
import type { CMSBlog, CMSPage, CMSSEOSetting, CMSSlider } from "../../../types";

export const cmsService = {
    async getCMSPages(): Promise<CMSPage[]> { return apiRequest("/cms/pages"); },
    async createCMSPage(data: any): Promise<CMSPage> { return apiRequest("/cms/pages", { method: "POST", body: JSON.stringify(data) }); },
    async updateCMSPage(id: string, data: any) { return apiRequest(`/cms/pages/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
    async deleteCMSPage(id: string) { return apiRequest(`/cms/pages/${id}`, { method: "DELETE" }); },
    async getCMSBlogs(): Promise<CMSBlog[]> { return apiRequest("/cms/blogs"); },
    async createCMSBlog(data: any): Promise<CMSBlog> { return apiRequest("/cms/blogs", { method: "POST", body: JSON.stringify(data) }); },
    async updateCMSBlog(id: string, data: any) { return apiRequest(`/cms/blogs/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
    async deleteCMSBlog(id: string) { return apiRequest(`/cms/blogs/${id}`, { method: "DELETE" }); },
    async getCMSSliders(): Promise<CMSSlider[]> { return apiRequest("/cms/sliders"); },
    async createCMSSlider(data: any): Promise<CMSSlider> { return apiRequest("/cms/sliders", { method: "POST", body: JSON.stringify(data) }); },
    async updateCMSSlider(id: string, data: any) { return apiRequest(`/cms/sliders/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
    async deleteCMSSlider(id: string) { return apiRequest(`/cms/sliders/${id}`, { method: "DELETE" }); },
    async getCMSSEO(): Promise<CMSSEOSetting[]> { return apiRequest("/cms/seo"); },
    async createCMSSEO(data: any): Promise<CMSSEOSetting> { return apiRequest("/cms/seo", { method: "POST", body: JSON.stringify(data) }); },
    async updateCMSSEO(id: string, data: any) { return apiRequest(`/cms/seo/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
    async deleteCMSSEO(id: string) { return apiRequest(`/cms/seo/${id}`, { method: "DELETE" }); },
};
