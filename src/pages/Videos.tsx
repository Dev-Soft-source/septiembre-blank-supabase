import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelVideoPlayer } from "@/components/hotels/HotelVideoPlayer";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { useTranslation } from "@/hooks/useTranslation";
import BubbleCounter from "@/components/common/BubbleCounter";
export default function Videos() {
  const {
    t,
    language
  } = useTranslation('content');

  // Get videos arrays with proper typing
  const nativeVideos = t('videosContent.nativeVideos', {
    returnObjects: true
  }) as Array<{
    title: string;
    url: string;
  }>;
  const spanishVideos = t('videosContent.spanishVideos', {
    returnObjects: true
  }) as Array<{
    title: string;
    url: string;
  }>;

  // Spanish-specific video sections
  const clientsVideos = t('videosContent.clientsVideos', {
    returnObjects: true
  }) as Array<{
    title: string;
    url: string;
  }>;
  const hotelsVideos = t('videosContent.hotelsVideos', {
    returnObjects: true
  }) as Array<{
    title: string;
    url: string;
  }>;
  const clientsTitle = t('videosContent.clientsTitle', '');
  const hotelsTitle = t('videosContent.hotelsTitle', '');
  const isSpanish = language === 'es';
  return <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      <BubbleCounter />
      
      <main className="flex-1 pt-8">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="glass-card rounded-2xl p-6 mb-8 bg-[#7E00B3]/90 shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
            {isSpanish ?
          // Spanish two-column layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Clients */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-fuchsia-200 text-center mb-6">
                    {clientsTitle}
                  </h2>
                  {clientsVideos.map((video, index: number) => <div key={`clients-${index}`} className="space-y-3">
                      
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${video.url.split('/').pop()}`} frameBorder="0" allowFullScreen className="rounded-lg" />
                      </div>
                    </div>)}
                </div>

                {/* Right Column - Hotels */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-fuchsia-200 text-center mb-6">
                    {hotelsTitle}
                  </h2>
                  {hotelsVideos.map((video, index: number) => <div key={`hotels-${index}`} className="space-y-3">
                      {video.title && (
                        <h3 className="text-lg font-medium text-fuchsia-200 text-center">
                          {video.title}
                        </h3>
                      )}
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${video.url.split('/').pop()}`} frameBorder="0" allowFullScreen className="rounded-lg" />
                      </div>
                    </div>)}
                </div>
              </div> :
          // Non-Spanish layout (original)
          <>
                {/* Native Videos Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nativeVideos.map((video, index: number) => <div key={`native-${index}`} className="space-y-3">
                        {video.title && (
                          <h3 className="text-lg font-medium text-fuchsia-200 text-center">
                            {video.title}
                          </h3>
                        )}
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${video.url.split('/').pop()}`} frameBorder="0" allowFullScreen className="rounded-lg" />
                        </div>
                      </div>)}
                  </div>
                </div>
                
                {/* Spanish Videos Section (if not Spanish language and has Spanish videos) */}
                {spanishVideos.length > 0 && <div className="border-t border-fuchsia-400/20 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {spanishVideos.map((video, index: number) => <div key={`spanish-${index}`} className="space-y-3">
                          {video.title && (
                            <h3 className="text-lg font-medium text-fuchsia-200 text-center">
                              {video.title}
                            </h3>
                          )}
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${video.url.split('/').pop()}`} frameBorder="0" allowFullScreen className="rounded-lg" />
                          </div>
                        </div>)}
                    </div>
                  </div>}
              </>}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
}