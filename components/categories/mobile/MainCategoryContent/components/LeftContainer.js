import styles from "../MainCategoryContent.module.css";
 
export default function LeftContainer(props) {

  const { subCategories, activeSubCategory } = props || {} ;

  const handleSubCategoryClick = (subCategory) => {
    props.onSubCategoryChange && props.onSubCategoryChange(subCategory)
  }

  return (
    <div className={styles.leftContainer}>
      {subCategories && subCategories.map((subCategory, index) => (
        <p
          key={subCategory.id}
          onClick={() => handleSubCategoryClick(subCategory)}
          className={`${styles.category} ${
            activeSubCategory.id === subCategory.id ? styles.activeCategory : null
          }`}
        >
          {subCategory.name}
        </p>
      ))}
    </div>
  );
}
