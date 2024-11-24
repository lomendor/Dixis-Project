import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  user: {
    name: string;
    location: string;
    avatar?: string;
  };
  rating: number;
  text: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          {t('feedback.testimonials')}
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          {t('feedback.testimonialsSubtitle')}
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-sm relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-200" />
              
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.user.avatar || `https://ui-avatars.com/api/?name=${testimonial.user.name}`}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{testimonial.user.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.user.location}</p>
                </div>
              </div>

              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="mt-4 text-gray-600 line-clamp-4">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}