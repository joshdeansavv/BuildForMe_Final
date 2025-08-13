import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BotFeature } from '@/data/features';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface FeatureListProps {
  features: BotFeature[];
}

export const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Powerful Features for Every Server
            </h2>
            <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              BuildForMe offers comprehensive Discord server management tools that scale with your community needs
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="backdrop-blur-sm h-full flex flex-col group">
                <CardContent className="p-6 flex-1 flex">
                  <div>
                    <CardTitle className="text-xl text-white font-semibold leading-tight mb-2">
                      <feature.icon className="inline-block mr-2 h-5 w-5 align-[-0.1em] text-white/90" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Swiper
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1.1}
              centeredSlides={false}
              pagination={{ 
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-gray-600',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-white'
              }}
              className="features-swiper !pb-12"
              breakpoints={{
                475: {
                  slidesPerView: 1.2,
                  spaceBetween: 20,
                },
                540: {
                  slidesPerView: 1.3,
                  spaceBetween: 24,
                }
              }}
            >
              {features.map((feature, index) => (
                <SwiperSlide key={index} className="h-auto">
              <Card className="backdrop-blur-sm h-full flex flex-col min-h-[200px]">
                <CardContent className="p-6 flex-1 flex">
                  <div>
                    <CardTitle className="text-xl text-white font-semibold leading-tight mb-2">
                      <feature.icon className="inline-block mr-2 h-5 w-5 align-[-0.1em] text-white/90" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}; 