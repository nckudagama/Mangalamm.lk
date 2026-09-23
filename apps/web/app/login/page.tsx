"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {api,saveSession} from "../../lib/api";

export default function Login(){
  const router=useRouter();
  const[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError("");
    try{const d=await api<{access_token:string;refresh_token:string}>("/api/v1/auth/login",{method:"POST",body:JSON.stringify({email,password})});saveSession(d);router.push("/dashboard")}
    catch(e){setError(e instanceof Error?e.message:"Sign in failed")}finally{setLoading(false)}
  }
  return <main className="grain min-h-screen px-5 py-6 sm:px-6 sm:py-8">
    <div className="mx-auto max-w-6xl">
      <Link href="/" aria-label="Mangalamm home" className="inline-flex h-12 w-12 overflow-hidden rounded-[15px] shadow-[0_10px_28px_rgba(166,83,94,.18)]"><img src="/branding/mangalamm-logo.png" alt="Mangalamm" className="h-full w-full"/></Link>
      <div className="grid min-h-[82dvh] items-center md:grid-cols-2 md:gap-20">
        <div className="hidden md:block"><p className="sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Welcome back</p><h1 className="mt-5 text-6xl leading-tight">Your next chapter is waiting.</h1><p className="sans mt-5 max-w-md leading-7 text-[#756b69]">Sign in to continue discovering people looking for something meaningful too.</p></div>
        <form onSubmit={submit} className="rounded-[28px] bg-white p-6 shadow-soft sm:p-9"><h2 className="text-3xl">Sign in</h2><p className="sans mt-2 text-sm text-[#756b69]">Continue to your Mangalamm profile.</p><div className="sans mt-7 space-y-4"><input className="field" value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="Email address"/><input className="field" value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="Password"/>{error&&<p className="text-sm text-[#a6535e]">{error}</p>}<button disabled={loading} className="w-full rounded-2xl bg-[#231f20] py-3.5 font-semibold text-white">{loading?"Signing in…":"Sign in"}</button></div><p className="sans mt-7 text-center text-sm text-[#756b69]">New here? <Link className="font-semibold text-[#a6535e]" href="/register">Create an account</Link></p></form>
      </div>
    </div>
  </main>
}