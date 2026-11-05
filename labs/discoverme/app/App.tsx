import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { PublicLayout } from "./components/layout";
import { RequireAuth } from "./components/RequireAuth";
import * as P from "./routes/pages";
import * as A from "./routes/auth-pages";
import * as C from "./routes/customer-pages";
import * as B from "./routes/business-pages";
import * as CM from "./routes/community-pages";
import * as AD from "./routes/admin-pages";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          {/* Public marketing & legal */}
          <Route path="/" element={<P.Home />} />
          <Route path="/about" element={<P.Simple title="About DiscoverMe" body="DiscoverMe helps people find businesses, connect with owners, and engage through messaging, bookings, orders, reviews, and communities." />} />
          <Route path="/how-it-works" element={<P.Simple title="How It Works" body="Discover businesses and services, view public profiles, and sign in to message, book, order, follow, and participate in communities." />} />
          <Route path="/for-businesses" element={<P.ForBusinesses />} />
          <Route path="/categories" element={<P.Categories />} />
          <Route path="/categories/:slug" element={<P.CategoryDetail />} />
          <Route path="/discover" element={<P.Discover />} />
          <Route path="/search" element={<P.Search />} />
          <Route path="/near/:location" element={<P.Near />} />
          <Route path="/business/:slug" element={<P.BusinessPublic />} />
          <Route path="/products/:slug" element={<P.ProductPublic />} />
          <Route path="/services/:slug" element={<P.ServicePublic />} />
          <Route path="/communities" element={<CM.CommunityDirectory />} />
          <Route path="/communities/create" element={<RequireAuth><CM.CommunityCreate /></RequireAuth>} />
          <Route path="/communities/:slug" element={<CM.CommunityDetail />} />
          <Route path="/communities/:slug/feed" element={<CM.CommunityFeed />} />
          <Route path="/communities/:slug/members" element={<CM.CommunityMembers />} />
          <Route path="/communities/:slug/about" element={<CM.CommunityAbout />} />
          <Route path="/communities/:slug/settings" element={<RequireAuth><CM.CommunitySettings /></RequireAuth>} />
          <Route path="/communities/:slug/moderation" element={<RequireAuth><CM.CommunityModeration /></RequireAuth>} />
          <Route path="/communities/:slug/polls" element={<CM.CommunityPolls />} />
          <Route path="/communities/:slug/polls/:pollId" element={<CM.CommunityPollDetail />} />
          <Route path="/privacy" element={<P.Policy title="Privacy Policy" draft />} />
          <Route path="/terms" element={<P.Policy title="Terms of Service" draft />} />
          <Route path="/community-guidelines" element={<P.Policy title="Community Guidelines" draft />} />
          <Route path="/review-policy" element={<P.Policy title="Review Policy" draft />} />
          <Route path="/safety" element={<P.Policy title="Safety" draft />} />
          <Route path="/contact" element={<P.Simple title="Contact" body="For support, use the Help Center or contact the DiscoverMe team through your configured support channel." />} />
          <Route path="/help" element={<P.Help />} />
          <Route path="/help/:slug" element={<P.HelpArticle />} />

          {/* Auth */}
          <Route path="/sign-up" element={<A.SignUp />} />
          <Route path="/sign-in" element={<A.SignIn />} />
          <Route path="/verify-email" element={<A.VerifyEmail />} />
          <Route path="/verify-email/:token" element={<A.VerifyEmail />} />
          <Route path="/forgot-password" element={<A.ForgotPassword />} />
          <Route path="/reset-password/:token" element={<A.ResetPassword />} />
          <Route path="/auth/callback" element={<A.AuthCallback />} />
          <Route path="/auth/logout" element={<A.Logout />} />
          <Route path="/auth/sessions" element={<RequireAuth><A.Sessions /></RequireAuth>} />
          <Route path="/onboarding" element={<RequireAuth><A.Onboarding /></RequireAuth>} />

          {/* Customer */}
          <Route path="/feed" element={<RequireAuth><C.Feed /></RequireAuth>} />
          <Route path="/messages" element={<RequireAuth><C.Messages /></RequireAuth>} />
          <Route path="/messages/:conversationId" element={<RequireAuth><C.MessageDetail /></RequireAuth>} />
          <Route path="/bookings" element={<RequireAuth><C.Bookings /></RequireAuth>} />
          <Route path="/bookings/:bookingId" element={<RequireAuth><C.BookingDetail /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><C.Orders /></RequireAuth>} />
          <Route path="/orders/:orderId" element={<RequireAuth><C.OrderDetail /></RequireAuth>} />
          <Route path="/saved" element={<RequireAuth><C.Saved /></RequireAuth>} />
          <Route path="/following" element={<RequireAuth><C.Following /></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><C.Notifications /></RequireAuth>} />
          <Route path="/account" element={<RequireAuth><C.Account /></RequireAuth>} />
          <Route path="/account/profile" element={<RequireAuth><C.AccountProfile /></RequireAuth>} />
          <Route path="/account/security" element={<RequireAuth><C.AccountSecurity /></RequireAuth>} />
          <Route path="/account/preferences" element={<RequireAuth><C.AccountPreferences /></RequireAuth>} />
          <Route path="/account/notifications" element={<RequireAuth><C.AccountNotifications /></RequireAuth>} />
          <Route path="/account/privacy" element={<RequireAuth><C.AccountPrivacy /></RequireAuth>} />
          <Route path="/account/data" element={<RequireAuth><C.AccountData /></RequireAuth>} />
          <Route path="/account/delete" element={<RequireAuth><C.AccountDelete /></RequireAuth>} />

          {/* Business workspace */}
          <Route path="/business" element={<RequireAuth><B.BusinessHome /></RequireAuth>} />
          <Route path="/business/onboarding" element={<RequireAuth><B.BusinessOnboarding /></RequireAuth>} />
          <Route path="/business/claim" element={<RequireAuth><B.BusinessClaim /></RequireAuth>} />
          <Route path="/business/claim/:claimId" element={<RequireAuth><B.BusinessClaimStatus /></RequireAuth>} />
          <Route path="/business/dashboard" element={<RequireAuth><B.Dashboard /></RequireAuth>} />
          <Route path="/business/profile" element={<RequireAuth><B.Profile /></RequireAuth>} />
          <Route path="/business/profile/preview" element={<RequireAuth><B.ProfilePreview /></RequireAuth>} />
          <Route path="/business/catalog" element={<RequireAuth><B.Catalog /></RequireAuth>} />
          <Route path="/business/products" element={<RequireAuth><B.Products /></RequireAuth>} />
          <Route path="/business/products/new" element={<RequireAuth><B.ProductNew /></RequireAuth>} />
          <Route path="/business/products/:productId" element={<RequireAuth><B.ProductEdit /></RequireAuth>} />
          <Route path="/business/services" element={<RequireAuth><B.Services /></RequireAuth>} />
          <Route path="/business/services/new" element={<RequireAuth><B.ServiceNew /></RequireAuth>} />
          <Route path="/business/services/:serviceId" element={<RequireAuth><B.ServiceEdit /></RequireAuth>} />
          <Route path="/business/media" element={<RequireAuth><B.Media /></RequireAuth>} />
          <Route path="/business/bookings" element={<RequireAuth><B.Bookings /></RequireAuth>} />
          <Route path="/business/bookings/:bookingId" element={<RequireAuth><B.BookingDetail /></RequireAuth>} />
          <Route path="/business/availability" element={<RequireAuth><B.Availability /></RequireAuth>} />
          <Route path="/business/orders" element={<RequireAuth><B.Orders /></RequireAuth>} />
          <Route path="/business/orders/:orderId" element={<RequireAuth><B.OrderDetail /></RequireAuth>} />
          <Route path="/business/inbox" element={<RequireAuth><B.Inbox /></RequireAuth>} />
          <Route path="/business/inbox/:conversationId" element={<RequireAuth><B.InboxDetail /></RequireAuth>} />
          <Route path="/business/posts" element={<RequireAuth><B.Posts /></RequireAuth>} />
          <Route path="/business/posts/new" element={<RequireAuth><B.PostNew /></RequireAuth>} />
          <Route path="/business/posts/:postId" element={<RequireAuth><B.PostEdit /></RequireAuth>} />
          <Route path="/business/reviews" element={<RequireAuth><B.Reviews /></RequireAuth>} />
          <Route path="/business/community" element={<RequireAuth><B.Community /></RequireAuth>} />
          <Route path="/business/community/settings" element={<RequireAuth><B.CommunitySettings /></RequireAuth>} />
          <Route path="/business/surveys" element={<RequireAuth><B.Surveys /></RequireAuth>} />
          <Route path="/business/surveys/new" element={<RequireAuth><B.SurveyNew /></RequireAuth>} />
          <Route path="/business/surveys/:surveyId" element={<RequireAuth><B.SurveyDetail /></RequireAuth>} />
          <Route path="/business/insights" element={<RequireAuth><B.Insights /></RequireAuth>} />
          <Route path="/business/team" element={<RequireAuth><B.Team /></RequireAuth>} />
          <Route path="/business/team/invitations" element={<RequireAuth><B.TeamInvitations /></RequireAuth>} />
          <Route path="/business/notifications" element={<RequireAuth><B.Notifications /></RequireAuth>} />
          <Route path="/business/settings" element={<RequireAuth><B.Settings /></RequireAuth>} />
          <Route path="/business/settings/privacy" element={<RequireAuth><B.SettingsPrivacy /></RequireAuth>} />
          <Route path="/business/settings/security" element={<RequireAuth><B.SettingsSecurity /></RequireAuth>} />
          <Route path="/business/settings/notifications" element={<RequireAuth><B.SettingsNotifications /></RequireAuth>} />

          {/* Admin */}
          <Route path="/admin" element={<RequireAuth admin><AD.Overview /></RequireAuth>} />
          <Route path="/admin/users" element={<RequireAuth admin><AD.Users /></RequireAuth>} />
          <Route path="/admin/users/:userId" element={<RequireAuth admin><AD.UserDetail /></RequireAuth>} />
          <Route path="/admin/businesses" element={<RequireAuth admin><AD.Businesses /></RequireAuth>} />
          <Route path="/admin/businesses/:businessId" element={<RequireAuth admin><AD.BusinessDetail /></RequireAuth>} />
          <Route path="/admin/claims" element={<RequireAuth admin><AD.Claims /></RequireAuth>} />
          <Route path="/admin/reviews" element={<RequireAuth admin><AD.Reviews /></RequireAuth>} />
          <Route path="/admin/content" element={<RequireAuth admin><AD.Content /></RequireAuth>} />
          <Route path="/admin/communities" element={<RequireAuth admin><AD.Communities /></RequireAuth>} />
          <Route path="/admin/reports" element={<RequireAuth admin><AD.Reports /></RequireAuth>} />
          <Route path="/admin/reports/:reportId" element={<RequireAuth admin><AD.ReportDetail /></RequireAuth>} />
          <Route path="/admin/moderation" element={<RequireAuth admin><AD.Moderation /></RequireAuth>} />
          <Route path="/admin/appeals" element={<RequireAuth admin><AD.Appeals /></RequireAuth>} />
          <Route path="/admin/audit" element={<RequireAuth admin><AD.Audit /></RequireAuth>} />
          <Route path="/admin/categories" element={<RequireAuth admin><AD.Categories /></RequireAuth>} />
          <Route path="/admin/help" element={<RequireAuth admin><AD.HelpAdmin /></RequireAuth>} />
          <Route path="/admin/settings" element={<RequireAuth admin><AD.Settings /></RequireAuth>} />

          <Route path="*" element={<P.NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}