import { Route, Routes } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { ArticlePreview } from "@/pages/dashboard/ArticlePreview"
import { CreateArticle } from "@/pages/dashboard/CreateArticle"
import { CreateArticleEditor } from "@/pages/dashboard/CreateArticleEditor"
import { CreateEvent } from "@/pages/dashboard/CreateEvent"
import { CreateEventEditor } from "@/pages/dashboard/CreateEventEditor"
import { EventPreview } from "@/pages/dashboard/EventPreview"
import { LogActivities } from "@/pages/dashboard/LogActivities"
import { ManageAdmin } from "@/pages/dashboard/ManageAdmin"
import { ManageContent } from "@/pages/dashboard/ManageContent"
import { ManageUser } from "@/pages/dashboard/ManageUser"
import { ManageWebsite } from "@/pages/dashboard/ManageWebsite"
import { Overview } from "@/pages/dashboard/Overview"
import { Profile } from "@/pages/dashboard/Profile"
import { UserProfile } from "@/pages/dashboard/UserProfile"
import {
  AgendaDetailPage,
  AgendaPage,
  ArticlePage,
  CategoryPage,
  CollaborationPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  NotFound,
  PublicLayout,
  RegisterPage,
} from "@/pages/public/PublicSite"
import { categoryMeta, type Category } from "@/data/mockData"

const categories = Object.keys(categoryMeta) as Category[]

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        {categories.map((category) => (
          <Route key={category} path={`/${categoryMeta[category].slug}`} element={<CategoryPage category={category} />} />
        ))}
        <Route path="/artikel/:slug" element={<ArticlePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/agenda/:id" element={<AgendaDetailPage />} />
        <Route path="/kolaborasi" element={<CollaborationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lupa-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="website" element={<ManageWebsite />} />
        <Route path="account/user" element={<ManageUser />} />
        <Route path="account/user/:id" element={<UserProfile />} />
        <Route path="account/admin" element={<ManageAdmin />} />
        <Route path="account/admin/:id" element={<UserProfile />} />
        <Route path="content" element={<ManageContent />} />
        <Route path="create-article" element={<CreateArticle />} />
        <Route path="create-article/new" element={<CreateArticleEditor />} />
        <Route path="article/preview/:id" element={<ArticlePreview />} />
        <Route path="create-article/preview/:id" element={<ArticlePreview />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="create-event/new" element={<CreateEventEditor />} />
        <Route path="event/preview/:id" element={<EventPreview />} />
        <Route path="create-event/preview/:id" element={<EventPreview />} />
        <Route path="logs" element={<LogActivities />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
