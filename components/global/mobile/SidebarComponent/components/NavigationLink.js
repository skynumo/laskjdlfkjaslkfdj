import Link from "next/link";
import styles from "../SidebarComponent.module.css";

export default function NavigationLink({ icon, link, title, count }) {
  return (
    <div className='sidebar-nav-link'>
      {icon}
      <Link href={link}>
        {title}
      </Link>
      {count !== undefined && <div className="badge-circle">{count}</div>}
    </div>
  );
}
