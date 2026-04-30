import { NavLink, Link } from "react-router-dom";
import { Home, ScanSearch, Activity } from "lucide-react";

export default function Header() {
  return (
    <header className="header" id="main-header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo" id="header-logo">
          <div className="header-logo-icon">
            <Activity size={20} />
          </div>
          <span>
            Endo<span className="highlight">Assist</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="header-nav" id="main-nav">
          <NavLink
            to="/"
            end
            id="nav-home"
            className={({ isActive }) =>
              `header-nav-link${isActive ? " active" : ""}`
            }
          >
            <Home size={15} />
            Home
          </NavLink>

          <NavLink
            to="/analysis"
            id="nav-analysis"
            className={({ isActive }) =>
              `header-nav-link${isActive ? " active" : ""}`
            }
          >
            <ScanSearch size={15} />
            Analysis
          </NavLink>
        </nav>
      </div>
    </header>
  );
}