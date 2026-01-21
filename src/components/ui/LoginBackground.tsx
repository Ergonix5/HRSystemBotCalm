'use client';
import '../styles/background-animations.css'
export default function LoginBackground() {
  return (
    <>
      {/* Grid / Pattern background */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            radial-gradient(#E2E8F0 1px, transparent 1px),
            linear-gradient(#EDF2F7 1px, transparent 1px),
            linear-gradient(90deg, #EDF2F7 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px',
          backgroundPosition: '20px 20px, 0 0, 0 0',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B91434]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#B91434]/5 blur-[120px] rounded-full" />

      {/* Scan line animation */}
      <div className="absolute inset-0 w-full h-[1px] bg-slate-300 blur-[1px] animate-scan z-0" />
    </>
  );
}
