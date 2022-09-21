import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import ProductSearchPane from "../../../Product/ProductSearchPane";
import SidebarComponent from "../SidebarComponent/SidebarComponent";
import styles from "./TopBar.module.css";

export default function TopBar() {
  const [show, setShow] = useState(false);
  const [showSearchPane, setShowSearchPane] = useState(false);

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.leftContainer}>
          <Link href="/home"><Image src="/logo.png" alt="Newness" width={696 * 0.2} height={142 * 0.2} /></Link>
        </div>
        <div className={styles.rightContainer}>
          <BiSearch onClick={() => setShowSearchPane(!showSearchPane)} />
          <Image
            src="/profile.jfif"
            alt="profile"
            width={45}
            height={45}
            onClick={() => setShow(true)}
          />
        </div>
      </div>

      {showSearchPane && <ProductSearchPane onClose={() => setShowSearchPane(false)} />}
      <div className="sidebar-pane-wr">
        <SidebarComponent show={show} setShow={setShow} />
      </div>
    </>
  );
}
