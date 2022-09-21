import Sidebar from "react-sidebar";
import SidebarContent from "./components/SidebarContent";
import styles from "./SidebarComponent.module.css";

export default function SidebarComponent({ show, setShow, children }) {
  return (
    <Sidebar
      className="slide-pane"
      sidebar={<SidebarContent />}
      open={show}
      onSetOpen={() => setShow(false)}
      styles={{
        sidebar: {
          background: "#fff",
          zIndex: 999999,
          position: "fixed",
          width: "308px",
          height: "100vh",
          transition: "all .5s linear",
        },
      }}
      shadow={true}
      transitions={true}
      docked={false}
      pullRight={true}
      touch={true}
      touchHandleWidth={50}
      overlayClassName={styles.sidebarOverlay}
    >
      {children}
    </Sidebar>
  );
}
