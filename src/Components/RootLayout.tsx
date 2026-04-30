import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer className="footer">
        <span>© 2025 EndoAssist · AI-Powered Endoscopic Assistance System</span>
      </footer>
    </>
  );
}