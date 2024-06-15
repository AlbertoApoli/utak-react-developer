import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import MenuItems from "./pages/MenuItems";
import MenuForm from "./pages/MenuForm";
import { Toaster } from "react-hot-toast";
import MenuDetails from "./pages/MenuDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserInterfaceProvider } from "./contexts/UserInterfaceContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserInterfaceProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<MenuItems />} />
              <Route path="/inventory" element={<MenuItems />} />
              <Route path="/inventory/add" element={<MenuForm />} />
              <Route path="/inventory/edit/:id" element={<MenuForm />} />
              <Route path="/inventory/:id" element={<MenuDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserInterfaceProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
