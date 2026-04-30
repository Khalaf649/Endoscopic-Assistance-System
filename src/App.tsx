import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Components/RootLayout";
import HomePage from "./Home/HomePage";
import AnalysisPage from "./Analysis/AnalysisPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/analysis",
        element: <AnalysisPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
