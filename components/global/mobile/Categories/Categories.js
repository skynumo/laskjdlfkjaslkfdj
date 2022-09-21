import { useEffect, useRef } from "react"; 
import styles from "./Categories.module.css";

export default function CategoriesTabs(props) {

  let { categories, activeCategory, onChangeCategory } = props || {};
  const categoriesRef = useRef();
 
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
      {categories.length > 0 && categories?.map((category) => (
        <button
          key={category.id}
          className={`${styles.categoryButton} ${activeCategory.id === category.id ? styles.active : null}`}
          onClick={() => onChangeCategory(category)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
