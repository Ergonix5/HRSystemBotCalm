import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black overflow-hidden selection:bg-[#B91434] selection:text-white">
      {/* Custom Keyframes Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glitch-anim {
          0% { clip: rect(31px, 9999px, 94px, 0); }
          20% { clip: rect(62px, 9999px, 42px, 0); }
          40% { clip: rect(10px, 9999px, 86px, 0); }
          60% { clip: rect(57px, 9999px, 12px, 0); }
          80% { clip: rect(34px, 9999px, 75px, 0); }
          100% { clip: rect(89px, 9999px, 23px, 0); }
        }
        @keyframes glitch-anim2 {
          0% { clip: rect(26px, 9999px, 13px, 0); }
          20% { clip: rect(85px, 9999px, 49px, 0); }
          40% { clip: rect(41px, 9999px, 98px, 0); }
          60% { clip: rect(12px, 9999px, 63px, 0); }
          80% { clip: rect(74px, 9999px, 21px, 0); }
          100% { clip: rect(53px, 9999px, 87px, 0); }
        }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .glitch-text::before {
          content: "404";
          position: absolute;
          left: 2px;
          text-shadow: -2px 0 #B91434;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
          background: white;
          width: 100%;
        }
        .glitch-text::after {
          content: "404";
          position: absolute;
          left: -2px;
          text-shadow: -2px 0 #000;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim2 5s infinite linear alternate-reverse;
          background: white;
          width: 100%;
        }
      `}} />

      {/* Subtle Background Scanner Line */}
      <div 
        className="absolute left-0 w-full h-[1px] bg-[#B91434]/10 z-0 pointer-events-none"
        style={{ 
          boxShadow: '0 0 8px rgba(185, 20, 52, 0.4)',
          animation: 'scan 6s linear infinite' 
        }}
      ></div>

      <main className="relative z-10 text-center max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000">
        {/* Main Graphic */}
        <div className="mb-8 relative inline-block">
          <h1 className="glitch-text relative text-[#B91434] text-8xl md:text-[10rem] font-black leading-none tracking-tighter">
            404
          </h1>
        </div>

        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 uppercase tracking-tighter">
            Page <span className="text-[#B91434]">Not Found</span>
          </h2>
          
          <p className="text-gray-500 text-lg md:text-xl mb-10 leading-relaxed max-w-lg mx-auto font-medium">
            The path you followed seems to have vanished. Please verify the URL or return to the dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-10 py-4 bg-[#B91434] text-white font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#B91434]/20 hover:-translate-y-0.5 uppercase tracking-widest text-xs"
            >
              Return Home
            </button>
            <button 
              className="px-10 py-4 border-2 border-black text-black font-bold rounded-full hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-widest text-xs"
            >
              Get Support
            </button>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="absolute bottom-8 w-full px-10 flex justify-between items-center opacity-40 text-[10px] tracking-[0.2em] uppercase font-bold">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#B91434] rounded-full animate-pulse"></div>
          <span>Status: Disconnected</span>
        </div>
        <div className="hidden sm:block">
          Ref: 404-NEXT-UNREACHABLE
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;