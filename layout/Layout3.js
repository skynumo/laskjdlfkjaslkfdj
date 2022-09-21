import BottomNavigation from "../components/global/mobile/BottomNavigation/BottomNavigation";
import TopBar from "../components/global/mobile/TopBar/TopBar";

export default function Layout({ children }) {
  return (
    <>
      <div className="app-container2 without-header">
        <div className="app-inner-content">
          {children}
        </div>
        <BottomNavigation />
      </div>
    </>
  );
}
