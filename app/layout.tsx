import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LOVE HAVEN 🌸 Vườn Chatbot AI & Thư Tình',
  description: 'Một khu vườn nhỏ dành cho những câu chuyện chưa kể, nơi lưu giữ và chia sẻ các nhân vật AI, cốt truyện đặc sắc và những lá thư tình.',
  openGraph: {
    title: 'LOVE HAVEN 🌸 Vườn Chatbot AI & Thư Tình',
    description: 'Một khu vườn nhỏ dành cho những câu chuyện chưa kể, nơi lưu giữ và chia sẻ các nhân vật AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOVE HAVEN 🌸 Vườn Chatbot AI & Thư Tình',
    description: 'Một khu vườn nhỏ dành cho những câu chuyện chưa kể, nơi lưu giữ và chia sẻ các nhân vật AI.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-pink-200 selection:text-pink-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
