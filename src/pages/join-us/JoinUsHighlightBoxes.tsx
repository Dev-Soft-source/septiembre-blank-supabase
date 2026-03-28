
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const JoinUsHighlightBoxes = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col items-center gap-8 mb-16 relative">
      {/* Top box - Enhanced design with blue glow and purple background */}
      <div className="relative group w-fit">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={`relative bg-[#5E1183] backdrop-blur-xl border-2 border-cyan-400/60 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${isMobile ? 'p-6 mx-4' : 'p-8'}`}>
          <div className="space-y-5">
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🏨</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>Hotels need people</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🧑‍🤝‍🧑</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>People need better living</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🌐</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>Society needs an update</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">💡</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>All need Hotel Living</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom box - Enhanced design with blue glow and purple background */}
      <div className="relative group w-fit">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={`relative bg-[#5E1183] backdrop-blur-xl border-2 border-cyan-400/60 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${isMobile ? 'p-6 mx-6' : 'p-8'}`}>
          <div className="space-y-5">
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🛏️</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>
                {isMobile ? "5B hotel nights need to be full" : "5 billion hotel nights need to be full"}
              </span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">👨‍👩‍👧‍👦</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>
                {isMobile ? "400M people need better living" : "400 million people need better living"}
              </span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🔁</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>Society keeps repeating the past</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🚀</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>
                {isMobile ? "Hotel-Living changes that" : "Hotel Living changes that"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Box 1 - Enhanced design with blue glow and purple background */}
      <div className="relative group w-fit">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={`relative bg-[#5E1183] backdrop-blur-xl border-2 border-cyan-400/60 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${isMobile ? 'p-6 mx-6' : 'p-8'}`}>
          <div className="space-y-5">
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">💼</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>We created a $131B category</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🔗</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>We matched two massive needs</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🧠</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide ${isMobile ? '' : 'whitespace-nowrap'}`}>By building a unique, original model</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🔒</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide ${isMobile ? '' : 'whitespace-nowrap'}`}>
                {isMobile ? (
                  <>
                    A model that can't be cloned and…<br />
                    80% still unknown!
                  </>
                ) : (
                  "A model that can't be cloned and… 80% still unknown!"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Box 2 - Enhanced design with blue glow and purple background */}
      <div className="relative group w-fit">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={`relative bg-[#5E1183] backdrop-blur-xl border-2 border-cyan-400/60 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${isMobile ? 'p-6 mx-6' : 'p-8'}`}>
          <div className="space-y-5">
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🛡️</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide ${isMobile ? '' : 'whitespace-nowrap'}`}>Hotel Living is crisis-proof</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">💸</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide ${isMobile ? '' : 'whitespace-nowrap'}`}>
                {isMobile ? (
                  <>
                    The greater the crisis, the stronger<br />
                    the need to unify living costs.
                  </>
                ) : (
                  "The greater the crisis, the stronger the need to unify living costs."
                )}
              </span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🙅‍♂️</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide ${isMobile ? '' : 'whitespace-nowrap'}`}>
                {isMobile ? (
                  <>
                    Business models benefiting<br />
                    from any crisis?
                  </>
                ) : (
                  "Business models benefiting from any crisis?"
                )}
              </span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">📈</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>Yes. Hotel Living. It does!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Box 3 - Enhanced design with blue glow and purple background */}
      <div className="relative group w-fit">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={`relative bg-[#5E1183] backdrop-blur-xl border-2 border-cyan-400/60 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${isMobile ? 'p-6 mx-6' : 'p-8'}`}>
          <div className="space-y-5">
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🌐</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide ${isMobile ? '' : 'whitespace-nowrap'}`}>
                {isMobile ? (
                  <>
                    We own the market, because…<br />
                    our model creates it
                  </>
                ) : (
                  "We own the market, because… our model creates it"
                )}
              </span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">💰</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide ${isMobile ? '' : 'whitespace-nowrap'}`}>
                {isMobile ? (
                  <>
                    $12B in annual profits<br />
                    and an astonishing road ahead
                  </>
                ) : (
                  "$12B in annual profits — and an astonishing road ahead"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Box 4 - Enhanced design with blue glow and purple background */}
      <div className="relative group w-fit">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className={`relative bg-[#5E1183] backdrop-blur-xl border-2 border-cyan-400/60 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${isMobile ? 'p-6 mx-6' : 'p-8'}`}>
          <div className="space-y-5">
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">🎯</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide whitespace-nowrap`}>Very few even get this chance</span>
            </div>
            <div className="flex items-center text-white group/item hover:text-cyan-200 transition-colors duration-200">
              <span className="text-2xl mr-4 filter drop-shadow-lg">❓</span>
              <span className={`${isMobile ? 'text-xs' : 'text-base'} font-semibold tracking-wide ${isMobile ? '' : 'whitespace-nowrap'}`}>
                {isMobile ? (
                  <>
                    Are you one of them<br />
                    who belong?
                  </>
                ) : (
                  "Are you one of them who belong?"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
