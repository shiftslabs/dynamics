import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, X, Search, MessageSquare, Bell, User, Building2, Home, Compass, Users } from "lucide-react";
import { Container } from "./ui";
import { useAuth } from "../lib/auth";

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-white">Skip to content</a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <Container className="flex h-14 items-center justify-between gap-3">
          <Link to="/" className="font-semibold text-brand-700">DiscoverMe</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-700">
            <NavLink to="/discover" className="hover:text-brand-700">Discover</NavLink>
            <NavLink to="/categories" className="hover:text-brand-700">Categories</NavLink>
            <NavLink to="/communities" className="hover:text-brand-700">Communities</NavLink>
            <NavLink to="/for-businesses" className="hover:text-brand-700">For Businesses</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/search" className="rounded-lg p-2 hover:bg-slate-100" aria-label="Search"><Search size={18}/></Link>
            {user ? (
              <>
                <Link to="/notifications" className="hidden sm:block rounded-lg p-2 hover:bg-slate-100" aria-label="Notifications"><Bell size={18}/></Link>
                <Link to="/messages" className="hidden sm:block rounded-lg p-2 hover:bg-slate-100" aria-label="Messages"><MessageSquare size={18}/></Link>
                <Link to="/account" className="hidden sm:inline-flex rounded-lg px-2 py-1.5 text-sm hover:bg-slate-100">Account</Link>
                <button onClick={async()=>{await signOut(); nav("/");}} className="hidden sm:inline-flex rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Sign out</button>
              </>
            ) : (
              <Link to="/sign-in" className="hidden sm:inline-flex rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white">Sign in</Link>
            )}
            <button className="md:hidden rounded-lg p-2 hover:bg-slate-100" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X size={20}/>:<Menu size={20}/>}</button>
          </div>
        </Container>
        {open && <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-sm">
          <Link to="/discover" onClick={()=>setOpen(false)} className="block py-1">Discover</Link>
          <Link to="/categories" onClick={()=>setOpen(false)} className="block py-1">Categories</Link>
          <Link to="/communities" onClick={()=>setOpen(false)} className="block py-1">Communities</Link>
          <Link to="/for-businesses" onClick={()=>setOpen(false)} className="block py-1">For Businesses</Link>
          {user ? <><Link to="/account" onClick={()=>setOpen(false)} className="block py-1">Account</Link><button onClick={async()=>{await signOut(); setOpen(false);}} className="block py-1 text-left">Sign out</button></> : <Link to="/sign-in" onClick={()=>setOpen(false)} className="block py-1 font-medium text-brand-700">Sign in</Link>}
        </div>}
      </header>
      <main id="main" className="flex-1 pb-20 md:pb-0"><Outlet/></main>
      {user && <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white md:hidden">
        <div className="grid grid-cols-5 text-[11px] text-slate-600">
          <NavLink to="/feed" className="flex flex-col items-center py-2 gap-0.5"><Home size={18}/><span>Feed</span></NavLink>
          <NavLink to="/discover" className="flex flex-col items-center py-2 gap-0.5"><Compass size={18}/><span>Discover</span></NavLink>
          <NavLink to="/messages" className="flex flex-col items-center py-2 gap-0.5"><MessageSquare size={18}/><span>Messages</span></NavLink>
          <NavLink to="/communities" className="flex flex-col items-center py-2 gap-0.5"><Users size={18}/><span>Groups</span></NavLink>
          <NavLink to="/account" className="flex flex-col items-center py-2 gap-0.5"><User size={18}/><span>Account</span></NavLink>
        </div>
      </nav>}
      <footer className="hidden md:block border-t border-slate-200 bg-white mt-8">
        <Container className="py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-sm text-slate-600">
          <div><div className="font-semibold text-slate-900">DiscoverMe</div><p className="mt-1">Business discovery and customer engagement by Shift Labs.</p></div>
          <div className="space-y-1"><div className="font-medium text-slate-900">Explore</div><Link to="/discover" className="block hover:text-brand-700">Discover</Link><Link to="/categories" className="block hover:text-brand-700">Categories</Link><Link to="/communities" className="block hover:text-brand-700">Communities</Link></div>
          <div className="space-y-1"><div className="font-medium text-slate-900">Businesses</div><Link to="/for-businesses" className="block hover:text-brand-700">For Businesses</Link><Link to="/business" className="block hover:text-brand-700">Business Workspace</Link></div>
          <div className="space-y-1"><div className="font-medium text-slate-900">Legal & Help</div><Link to="/privacy" className="block hover:text-brand-700">Privacy</Link><Link to="/terms" className="block hover:text-brand-700">Terms</Link><Link to="/help" className="block hover:text-brand-700">Help</Link><Link to="/contact" className="block hover:text-brand-700">Contact</Link></div>
        </Container>
      </footer>
    </div>
  );
}