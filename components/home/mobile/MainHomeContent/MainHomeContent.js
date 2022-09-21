import { useContext, useEffect, useState } from "react";
import Categories from "./components/Categories";
import YouMayLike from "./components/YouMayLike";
import NewArrivals from "./components/NewArrivals";
import FeaturedProducts from "./components/FeaturedProducts";
import TopOffersOnBrands from "./components/TopOffersOnBrands";
import styles from "./MainHomeContent.module.css";
import TrendingProducts from "./components/TrendingProducts";
import TopBrands from "./components/Top Brands";
import SliderBanner from "./components/BannerSlider";
import SliderBanner1 from "./components/BannerSlider2";
import SliderBanner2 from "./components/BannerSlider3";
import RecentlyViewed from "./components/RecentlyViewed";
import HomeBanner from "../HomeBanner/HomeBanner";
import SliderBanner0 from "./components/BannerSlider0";
import YourWishlist from "./components/YourWishlist";
import { catData } from "./components/_config";
import { AppContext } from "../../../../pages/_app";
// import { SubscriptionModal } from "../../../common/SubscriptionModal";
import { useRouter } from "next/router";
import { getToken } from "../../../../layout/utils";
 
export default function MainHomeContent(props) {

  const appData = useContext(AppContext)

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  const token = appData.token;
  // const customertoken = appData.token;
  const countryCode = appData.countryCode; 

  const router = useRouter();

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(props.catIndex);
  const [activeCategoryId, setActiveCategoryId] = useState(props.catId); 
 
  const [homeData, setHomeData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [categories, setCategories] = useState(catData);
 
  const fetchHomeData = async () => {

    const token = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/wt-home/${activeCategoryId}/${token}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json();
      setHomeData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBannerData = async () => {
    try {
      const res = await fetch(`${APIUrl}/V1/get-banner`)
      const data = await res.json();
      if (data.success === 200) {
        setBannerData(data.data.banners);
      }
    } catch (err) {
      console.log("Banner API Error", err);
    }
  };

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
        setCategories(data.data.children_data);
      }
    } catch (err) {
      console.log("Banner API Error", err);
    }
  };

  const onChangeCategory = (category, index) => {
    setActiveCategoryIndex(index) 
    setActiveCategoryId(category.id);
    router.push({pathname: `/home/${category.name.toLowerCase()}`, query: {cat: category.id, idx: index}})
  }

  useEffect(() => {
    fetchCategories();
    fetchBannerData();
    fetchHomeData();
  }, [])

  return (
    <div className={styles.mainHomeContent}>
      {/* <SubscriptionModal />  */}
      <HomeBanner data={bannerData} />
      <Categories
        categories={categories}
        activeCategory={activeCategoryIndex}
        onChangeCategory={onChangeCategory}
      />
      <YouMayLike catId={activeCategoryId} />
      <NewArrivals data={homeData.new_arrivals} />
      <SliderBanner0 data={homeData.banners} />
      <FeaturedProducts data={homeData.featured_products} activeCategoryId={activeCategoryId} />
      <SliderBanner data={homeData.category_banner_image} />
      <TopOffersOnBrands data={homeData.top_offers_on_brands} />
      <SliderBanner1 data={homeData.top_offer_section} />
      <TrendingProducts data={homeData.best_selling} />
      <TopBrands data={homeData.top_brands} />
      <RecentlyViewed data={homeData.recently_viewed} activeCategoryId={activeCategoryId} />
      <YourWishlist />
      <SliderBanner2 data={homeData.category_banner} />
    </div>
  );
}
