import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { router } from './routes';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '16px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </AppProvider>
    </ThemeProvider>
  );
}
