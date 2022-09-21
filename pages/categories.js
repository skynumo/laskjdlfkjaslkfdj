import { useState, useEffect, useContext } from "react";
import MainCategoryContent from "../components/categories/mobile/MainCategoryContent/MainCategoryContent";
import CategoriesTabs from "../components/global/mobile/Categories/Categories";
import { getToken } from "../layout/utils";
import { AppContext } from "./_app";

export default function Categories() {

  const appData = useContext(AppContext)
  
  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  const token = appData.token; 
  const countryCode = appData.countryCode; 

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
 
  const fetchCategories = async () => {

    const token = getToken();

    try {
      const res = await fetch(`${APIUrl}/V1/categorylisting`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "storecode": countryCode ? countryCode.toLowerCase() : '',
            "admintoken": appData.adminToken
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const data = await res.json();
      if (data.success === 200) {
        setActiveCategory(data.data.children_data[0]) // Default First Category
        setCategories(data.data.children_data); // Categories Data
        localStorage.setItem('activeCategory', JSON.stringify(data.data.children_data[0])) // Save to localstorage
        localStorage.setItem('categories', JSON.stringify(data.data.children_data)) // Save to localstorage
      }
    } catch (err) {
      console.log("Category list API Error", err);
    }
  };

  const onChangeCategory = (category) => {
    setActiveCategory(category);
  }

  useEffect(() => {
    let loadLsActiveCategory = localStorage.getItem('activeCategory');
    loadLsActiveCategory = loadLsActiveCategory && loadLsActiveCategory !=='' ? JSON.parse(loadLsActiveCategory) : {};
    setActiveCategory(loadLsActiveCategory);
  
    let loadLsCategories = localStorage.getItem('categories');
    loadLsCategories = loadLsCategories  && loadLsCategories !== '' ? JSON.parse(loadLsCategories) : {};
    setCategories(loadLsCategories);
    fetchCategories();
  }, [])
 
  return (
    <>
      <CategoriesTabs
        categories={categories}
        activeCategory={activeCategory}
        onChangeCategory={onChangeCategory}
      />
      <MainCategoryContent 
        subCategories={activeCategory.children_data}
      />
    </>
  );
}
