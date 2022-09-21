import { useEffect, useRef } from "react";
import styles from "../MainHomeContent.module.css";
import { catData } from "./_config";

export default function Categories(props) {
  const categoriesRef = useRef();
  let { categories, activeCategory, onChangeCategory } = props;
 
  if (categories.length === 0) {
    categories = catData
  }

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY >= 70) {
        categoriesRef.current?.classList.add(styles.sticked);
      } else {
        categoriesRef.current?.classList.remove(styles.sticked);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.categoryContainer} ref={categoriesRef}>
      {categories?.map((category, index) => (
        <button
          key={category.id}
          className={`${styles.categoryButton} ${activeCategory == index ? styles.active : null}`}
          onClick={() => onChangeCategory(category, index)}
        >
          {category.name} 
        </button>
      ))}
    </div>
  );
}
