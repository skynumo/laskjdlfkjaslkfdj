import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LeftContainer from "./components/LeftContainer";
import styles from "./MainCategoryContent.module.css";

const RightContainer = dynamic(() => import("./components/RightContainer"), { ssr: false });

export default function MainCategoryContent(props) {

  const [activeSubCategory, setActiveSubCategory] = useState({}); // Level 2

  const [subSubCategories, setSubSubCategories] = useState([]); // Level 3 
  // const [activeSubSubCategory, setActiveSubSubCategory] = useState({}); // Level 3

  const handleSubCategoryChange = (category) => {
    setActiveSubCategory(category)
    setSubSubCategories(category.children_data)
  }

  useEffect(() => {
    setActiveSubCategory(props.subCategories ? props.subCategories['0'] : {})
    setSubSubCategories(props.subCategories ? props.subCategories['0'].children_data : [])
    // setActiveSubSubCategory(props.subSubCategories ? props.subSubCategories['0'] : {})
  }, [props.subCategories, props.subSubCategories])
 
  return (
    <div className={styles.mainCategoryContent}>
      <LeftContainer 
        {...props} 
        onSubCategoryChange = {handleSubCategoryChange} 
        activeSubCategory = {activeSubCategory}
      />
      <RightContainer 
        {...props} 
        // activeSubSubCategory= {activeSubSubCategory}  
        parentCatId = {activeSubCategory.parent_id}
        subSubCategories= {subSubCategories}  
      />
    </div>
  );
}
