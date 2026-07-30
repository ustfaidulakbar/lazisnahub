import React, { useState, useEffect } from "react";
import { DonationRecord } from "../types";
import { Award, User, Settings, Check, Download, Camera, LogOut } from "lucide-react";

interface MemberCardProps {
  pastDonations: DonationRecord[];
  onRegisterSuccess: (name: string, wa: string, photo?: string) => void;
  onAdminLogin: () => void;
  onNavigateToUmroh?: () => void;
  isAgent?: boolean;
}

export default function MemberCard({ pastDonations, onRegisterSuccess, onAdminLogin, onNavigateToUmroh, isAgent }: MemberCardProps) {
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<"profil" | "pengaturan">("profil");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lazisna_member");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setRegisteredUser(u);
        onRegisterSuccess(u.name, u.wa, u.photo);
      } catch (e) {}
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("lazisna_member");
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@lazisna.org" && password === "admin123") {
      onAdminLogin();
      return;
    }
    try {
      const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: email.split("@")[0] })
      });
      if (res.ok) {
        const u = await res.json();
        setRegisteredUser(u);
        localStorage.setItem("lazisna_member", JSON.stringify(u));
        onRegisterSuccess(u.name, u.wa, undefined);
      } else {
        alert("Gagal otentikasi.");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan jaringan.");
    }
  };
    setRegisteredUser(null);
    onRegisterSuccess("", "");
  };

  return (
    <div className="max-w-md mx-auto p-5 space-y-6 text-left">
      {registeredUser ? (
        <div className="space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setActiveSection("profil")} className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeSection === "profil" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}>Profil</button>
            <button onClick={() => setActiveSection("pengaturan")} className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeSection === "pengaturan" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}>Pengaturan</button>
          </div>
          
          {activeSection === "profil" ? (
             <div className="bg-emerald-600 text-white rounded-2xl p-5 shadow-lg">
               <h3 className="text-xl font-bold">{registeredUser.name}</h3>
               <p className="text-emerald-100 text-sm mt-1">{registeredUser.email}</p>
               <div className="mt-6 border-t border-emerald-500/50 pt-4 flex justify-between">
                 <div>
                   <div className="text-xs text-emerald-200">Total Donasi</div>
                   <div className="text-lg font-bold">Rp {pastDonations.reduce((a, b) => a + b.amount, 0).toLocaleString("id-ID")}</div>
                 </div>
                 <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-emerald-100 hover:text-white">
                   <LogOut className="w-4 h-4" /> Keluar
                 </button>
               </div>
             </div>
          ) : (
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-4">Pengaturan Akun</h4>
                <p className="text-xs text-slate-500">Pengaturan aplikasi Lazisna Anda.</p>
             </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-5">
          <div className="text-center space-y-2">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><User className="w-6 h-6"/></div>
             <h3 className="font-bold text-slate-800">Masuk / Daftar</h3>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full text-xs rounded-xl border border-slate-200 p-3" placeholder="email@domain.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full text-xs rounded-xl border border-slate-200 p-3" placeholder="Password" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs">
              {isLoginMode ? "Masuk" : "Daftar"}
            </button>
            <div className="text-center">
               <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-xs text-emerald-600 font-semibold">
                 {isLoginMode ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
               </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
