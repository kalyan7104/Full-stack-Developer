import React from "react";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to Finn-Parse</h1>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition" onClick={() => window.location.href = "/auth/google"}>
        Sign in with Google
      </button>
    </div>
  );
}
