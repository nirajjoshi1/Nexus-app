import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
       
      </QueryClientProvider>
      <Toaster
          position="bottom-center"
          toastOptions={{
            success: {
              style: {
                background: 'green',
                color: 'white',
              },
            },
            error: {
              style: {
                background: 'red',
                color: 'white',
              },
            },
          }}
        />
    </BrowserRouter>
  </StrictMode>
);