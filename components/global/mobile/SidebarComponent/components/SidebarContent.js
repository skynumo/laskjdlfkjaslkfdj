import SidebarHeader from "./SidebarHeader";
import SidebarLinks from "./SidebarLinks";
import SidebarFooter from "./SidebarFooter";
import styles from "../SidebarComponent.module.css";

export default function SidebarContent() {
  return (
    <div className={styles.sidebarContent}>
      <SidebarHeader />
      <div className="sidebar-body">
        <SidebarLinks />
        <SidebarFooter />
      </div>
    </div>
  );
}
