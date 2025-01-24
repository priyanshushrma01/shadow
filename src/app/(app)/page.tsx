'use client';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

const messages = [
  { title: "Anonymous Feedback", content: "Great platform for honest opinions!", received: "2 days ago" },
  { title: "Secret Message", content: "I love the privacy this app provides.", received: "1 day ago" },
  { title: "Hidden Thoughts", content: "Finally, a place to share without fear.", received: "3 hours ago" },
]

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="min-h-screen bg-[#1a1f2c]">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="text-xl text-gray-400">Shadow - Where your identity remains a secret.</p>
        </div>
      </section>

        {/* Carousel Section */}
      <section className="container mx-auto px-4">
        <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-lg md:max-w-xl mx-auto">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-[#2d3748] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-gray-300">{message.content}</p>
                      <p className="text-xs text-gray-500">{message.received}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      </main>

      
      <footer className="border-t border-gray-800  bg-[#1a1f2c]">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">© {new Date().getFullYear()} Shadow. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}