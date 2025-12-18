import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth';
import { Toaster } from "@/components/ui/toaster";
import { placeholderImages } from '@/lib/placeholder-images';

export const metadata: Metadata = {
  title: 'Basecamp',
  description: 'Collaborative packing lists for students and educators',
};

const background_image = placeholderImages.find(p => p.id === 'nature-background');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <AuthProvider>
          {background_image && (
             <Image
              src={background_image.imageUrl}
              alt={background_image.description}
              fill
              className="object-cover -z-50"
              data-ai-hint={background_image.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-lg -z-40" />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
