import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './components/theme-provider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="uleam-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}