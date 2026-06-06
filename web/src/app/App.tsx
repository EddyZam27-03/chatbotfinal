import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './components/theme-provider';
import { DataStoreProvider } from './stores/dataStore';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="uleam-ui-theme">
      <DataStoreProvider>
        <RouterProvider router={router} />
      </DataStoreProvider>
    </ThemeProvider>
  );
}