import {
  MdOutlineArrowBackIosNew
} from 'react-icons/md';

import {
  FaSearch,
  FaSort, FaSpinner
} from 'react-icons/fa';

import {
  AiOutlineShoppingCart,
  AiOutlineFilter,
  AiFillHeart,
  AiOutlineHeart,
} from 'react-icons/ai';
import Image from 'next/image';

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import React, { useEffect, useState, useContext, useReducer } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import { AppContext } from './_app';
import InfiniteScroll from 'react-infinite-scroller';

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

import { debounce } from "lodash";
import { getToken } from '../layout/utils';

const sortOptionsData = [
//   {
//   name: "Suggested",
//   image: "/products/Sort/Unselected/suggested_unselected.imageset/conversation_unselected@2x.png",
//   selectedImage: "/products/Sort/Selected/suggested_selected.imageset/conversation_selected@2x.png",
// },
// {
//   name: "Discount",
//   image: "/products/Sort/Unselected/discount_unselected.imageset/sale_unselected@2x.png",
//   selectedImage: "/products/Sort/Selected/discount_selected.imageset/sale_selected@2x.png",
// },
// {
//   name: "Latest",
//   image: "/products/Sort/Unselected/latest_unselected.imageset/new_unselected@2x.png",
//   selectedImage: "/products/Sort/Selected/latest_selected.imageset/new_selected@2x.png",
// },
{
    name: "Name",
    image: "/products/Sort/Unselected/latest_unselected.imageset/new_unselected@2x.png",
    selectedImage: "/products/Sort/Selected/latest_selected.imageset/new_selected@2x.png",
  },
{
  name: "Low to High",
  image: "/products/Sort/Unselected/low_to_high_unselect.imageset/low_up@2x.png",
  selectedImage: "/products/Sort/Selected/low_to_high_selected.imageset/low_up_selected@2x.png",
},
{
  name: "High to Low",
  image: "/products/Sort/Unselected/high_to_low_unselect.imageset/low_down@2x.png",
  selectedImage: "/products/Sort/Selected/high_to_low_selected.imageset/low_down_selected@2x.png",
}]

export default function Products(props) {

  const appData = useContext(AppContext)
 
  const router = useRouter();
  const queryString = router.query;

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  const customertoken = appData.token;
  const countryCode = appData.countryCode;

  const [categoryId, setCategoryId] = useState(queryString.pCatId ? queryString.pCatId : '73');
  const [brandId, setBrandId] = useState(queryString.pBrandId ? queryString.pBrandId : '');
  
  const [selectedFilter, setSelectedFilter] = useState();
  const [searchData, setSearchData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false); 
  const [categories, setCategories] = useState([]);
  const [productListData, setProductListData] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [showSort, setShowSort] = useReducer((show) => !show, false);

  const [searchPane, setSearchPane] = useState({
    showSearchPane: false,
  });

  const [filterPane, setFilterPane] = useState({
    showFilterPane: false,
  });

  let subCategories = []
  if (categories && categories.length > 0) {
    subCategories = categories.filter(cat => cat.id == queryString.pCatId);
    if (subCategories.length > 0) {
      subCategories = subCategories['0'].children_data;
    }
  }

  const fetchProductList = async (catetoryId, sortBy, brandId = '', currentPage = 1) => {

    const customertoken = getToken();

    setLoading(true);
    let productUrl = `${APIUrl}/${countryCode.toLowerCase()}/V1/wt-products?`;
    let filterParamObj = {
      'searchCriteria[filter_groups][0][filters][0][field]': 'category_id',
      'searchCriteria[filter_groups][0][filters][0][condition_type]': 'eq',
      'searchCriteria[filter_groups][0][filters][0][value]': catetoryId,
      'searchCriteria[filter_groups][1][filters][0][condition_type]': 'in',
      'searchCriteria[filter_groups][1][filters][0][value]': '4',
      'searchCriteria[filter_groups][1][filters][0][field]': 'visibility',
      'searchCriteria[currentPage]': currentPage ? currentPage : '1',
      'searchCriteria[pageSize]': itemsPerPage,
    }

    if (sortBy === 'Low to High') {
      filterParamObj = {
        ...filterParamObj, ...{
          'searchCriteria[sortOrders][0][field]': 'price',
          'searchCriteria[sortOrders][0][direction]': 'ASC',
        }
      }

    } else if (sortBy === 'High to Low') {
      filterParamObj = {
        ...filterParamObj, ...{
          'searchCriteria[sortOrders][0][field]': 'price',
          'searchCriteria[sortOrders][0][direction]': 'DESC',
        }
      }
    } else if (sortBy === 'Name') {
      filterParamObj = {
        ...filterParamObj, ...{
          'searchCriteria[sortOrders][0][field]': 'name',
          'searchCriteria[sortOrders][0][direction]': 'ASC',
        }
      }
    }  
   
    if (brandId && brandId !== '') {
      filterParamObj = {
        ...filterParamObj, ...{
          'searchCriteria[filter_groups][2][filters][0][field]': 'manufacturer',
          'searchCriteria[filter_groups][2][filters][0][condition_type]': 'eq',
          'searchCriteria[filter_groups][2][filters][0][value]': brandId,
        }
      }
    }

    productUrl += new URLSearchParams(filterParamObj)

    try {
      const res = await fetch(productUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const data = await res.json();
      setProductListData(data)
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const searchProducts = async (keywords) => {

    const customertoken = getToken();

    setLoading(true);
    let productUrl = `${APIUrl}/${countryCode.toLowerCase()}/V1/wt-search?`;
    let filterParamObj = {
      'searchCriteria[filter_groups][0][filters][0][field]': 'search_term',
      'searchCriteria[filter_groups][0][filters][0][value]': keywords,
      'searchCriteria[filter_groups][1][filters][0][field]': 'visibility',
      'searchCriteria[filter_groups][1][filters][0][condition_type]': 'in',
      'searchCriteria[filter_groups][1][filters][0][value]': '4',
      'searchCriteria[requestName]': 'quick_search_container'
    }
    productUrl += new URLSearchParams(filterParamObj)

    try {
      const res = await fetch(productUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const data = await res.json();
      setSearchData(data)
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
 
  const addToWishlist = async (productid) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/addwishlist`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "customerid": appData.customerid,
            "productid": productid
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const data = await res.json();
      if (data.success === 200) {
        fetchProductList(categoryId, sortBy);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromWishlist = async (productid) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/deletewishlist`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "customerid": appData.customerid,
            "productid": productid
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const data = await res.json();
      if (data.success === 200) {
        fetchProductList(categoryId, sortBy);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product.id)
  }

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product.id)
  }

  useEffect(() => {

    if (router.query) {
      const queryString = router.query;
      setCategoryId(queryString.pCatId ? queryString.pCatId : '73')
      setBrandId(queryString.pBrandId ? queryString.pBrandId : '')
      setSearchPane({...searchPane, keyword: queryString.search ? queryString.search : ''})
    }
    
    fetchProductList(categoryId, sortBy, brandId);

    let loadLsCategories = localStorage.getItem('categories');
    loadLsCategories = loadLsCategories && loadLsCategories !== '' ? JSON.parse(loadLsCategories) : [];
    setCategories(loadLsCategories)

  }, [categoryId, brandId, sortBy, router])
 
  const handleActiveCategory = (catid) => {
    setCategoryId(catid)
    setItemsPerPage(10) // reset to 10
    fetchProductList(catid, sortBy); // For sub categories
  }

  const loadMoreProducts = () => {
    if (searchPane.keyword && searchPane.keyword !== '') {
      return 
    }
    if (!loading) {
      const nextItems = itemsPerPage + 10;
      setItemsPerPage(nextItems)
      fetchProductList(categoryId, sortBy)
    }
  }

  const handleSelectedFilter = (filter) => {
    console.log('Seleted', filter);
    setSelectedFilter(filter)
  }

  const handleSearch = debounce((keywords) => {
    if (keywords.length > 3) {
      searchProducts(keywords);
    }
  }, 1000);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const keywords = e.target.psearch.value;
    if (keywords.length > 2) {
      searchProducts(keywords);
      setSearchPane({...searchPane, showSearchPane: false, keyword: keywords})
    }
  };

  const handleClearSearch = () => {
    searchProducts([]);
    setSearchPane({...searchPane, showSearchPane: false, keyword: ''})
  }

  const handleBrandNavigation = (href) => {
    setSearchPane({...searchPane, showSearchPane: false, keyword: ''})
    router.push(href);
  }

  const handleCatNavigation = (href) => {
    setSearchPane({...searchPane, showSearchPane: false, keyword: ''})
    router.push(href);
  }

  const handleSelectedFilterOptions = (value) => {
    const newOptions = selectedFilter.selectedOptions ? selectedFilter.selectedOptions.slice() : []; 
    if (newOptions.includes(value)) {
      newOptions = newOptions.filter(val => val !== value);
    } else {
      newOptions.push(value);
    }
    setSelectedFilter({...selectedFilter, selectedOptions: newOptions})
  }
  
  return (
    <div className="product-search-page">

      <SlidingPane
        closeIcon={<MdOutlineArrowBackIosNew />}
        isOpen={searchPane.showSearchPane}
        from="bottom"
        width="100%"
        title={<div className='custom-pane-header'><Image src="/logo.png" alt="Newness" width={696 * 0.2} height={142 * 0.2} /><span onClick={() => handleClearSearch()} className='link'>Clear All</span></div>}
        onRequestClose={() => setSearchPane({ ...searchPane, showSearchPane: false })}
      >
        <div className="searchpane">
          <div className="search-bar" onClick={() => setSearchPane({...searchPane, showSearchPane: true})}>
            <span className="search-icon"><FaSearch />  </span>
            <form onSubmit={(e) => onSearchSubmit(e)}>
              <input className='form-control' name='psearch' defaultValue={searchPane.keyword} type="text" onChange={(e) => handleSearch(e.target.value)} placeholder="Search for product and category" />
            </form>
          </div>

          <div className="sp-recommended">
            <h3>Recommended for you</h3>
            <div className="reco-cats">
              {
                searchData && searchData?.brand?.length > 0 && searchData.brand.map((brand) => {
                return   <span 
                    onClick={() => handleBrandNavigation({ pathname: '/products', query: { pBrandId: brand.id, pCatId: categoryId } })} 
                    key={brand.id}   
                    className='btn btn-secondary btn-sm me-2 mb-2'>
                    {brand.brand_name}
                  </span>
              }) 
              }
              {
                searchData && searchData?.category?.length > 0 && searchData.category.map((cat) => {
                return <span 
                  onClick={() => handleCatNavigation({ pathname: '/products', query: { pCatId: cat.id } })} 
                  key={cat.id}   
                  className='btn btn-secondary btn-sm me-2 mb-2'>
                  {cat.name}
                </span> 
              }) 
              }
            </div>
          </div>
        </div>
      </SlidingPane>
      
      <SlidingPane
        closeIcon={<MdOutlineArrowBackIosNew />}
        isOpen={filterPane.showFilterPane}
        from="bottom"
        width="100%"
        title={<div className='custom-pane-header'><Image src="/logo.png" alt="Newness" width={696 * 0.2} height={142 * 0.2} /><span className='link'>Clear All</span></div>}
        onRequestClose={() => setFilterPane({ ...filterPane, showFilterPane: false })}
      >
        <div className="filterpane">
          <div className="sp-recommended">
            <div className="product-cats-modal">
              <div className="product-catlist">
              {productListData && productListData.filters && productListData.filters['0'] && productListData.filters['0'].available_filters && productListData.filters['0'].available_filters.length  > 0 && 
                productListData.filters['0'].available_filters.map((filter, idx) => {
                  return <p
                    className={selectedFilter === filter ? 'fcactive' : ''} 
                    onClick={() => handleSelectedFilter(filter)}
                    key={idx}
                   >{filter.filter_name}</p>
                })
              }
              </div>
              <div className="product-catres">
                {selectedFilter && selectedFilter.filter_options.map((option)=> {
                  return <div key={option.value} className='pcoption'>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          onChange = {() => handleSelectedFilterOptions(option.value)}
                          checked={selectedFilter.selectedOptions && selectedFilter.selectedOptions.includes(option.value) ? true : false}
                        />
                        {option.label}
                      </label>
                    </div>
                  </div>
                })}
              </div>
            </div>
          </div>
          <div className="pfactions">
              <button className='btn btn-secondary'>Cancel</button>
              <button className='btn btn-primary'>Apply</button>
            </div>
        </div>
      </SlidingPane>

      <div className="psproduct-header d-flex align-items-center justify-content-between">
        <div className="goback-icon" onClick={() => router.back()}  >
          <span>
            <MdOutlineArrowBackIosNew />
          </span>
        </div>
        <div className="search-bar" onClick={() => setSearchPane({...searchPane, showSearchPane: true})}>
          <span className="search-icon"><FaSearch />  </span>
          <input className='form-control' type="text" defaultValue={searchPane?.keyword} placeholder="Tap to search product" />
        </div>
        <div className="cart-icon">
          <span className='cart-with-count position-relative'>
            {appData.cart.count > 0 && <span className='badge rounded-1 badge-primary bg-primary text-white position-absolute'>{appData.cart.count}</span>}
            <AiOutlineShoppingCart />
          </span>
        </div>
      </div>

      <div className="product-short-bar d-flex align-items-center justify-content-between">
        <span className='plisted-items'>
          Total Listed Items: {productListData ? productListData?.products?.total_count : 0}
        </span>
        <span className='psort-items' onClick={() => setShowSort()}>
          <FaSort /> Sort
        </span>
        <span className='pfilter-items' onClick={() => setFilterPane({...filterPane, showFilterPane: true})}>
          <AiOutlineFilter /> Filter
        </span>
      </div>

      {showSort &&
        <div className="sort-cards">
          <Swiper
            slidesPerView={3.3}
            spaceBetween={10}
            freeMode={true}
            modules={[FreeMode]}
            breakpoints={{
              400: {
                width: 300,
                slidesPerView: 3.3,
              },
              640: {
                width: 640,
                slidesPerView: 4.3,
              },
              768: {
                width: 768,
                slidesPerView: 5,
              },
            }}
          >

            {sortOptionsData && sortOptionsData.length > 0 && sortOptionsData.map((option, oid) =>
              <SwiperSlide key={oid}>
                <div className={sortBy === option.name ? "card text-white bg-secondary text-center" : "card bg-light text-center"} onClick={() => setSortBy(option.name)}>
                 {sortBy === option.name && <Image src={option.selectedImage} alt="" width="50" height="50" />}
                 {sortBy !== option.name && <Image src={option.image} alt="" width="50" height="50" />}
                  <div className="sctitle">
                    {option.name}
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      }

      <div className="product-cats container-fluid">
        <Swiper
          slidesPerView={3.3}
          spaceBetween={10}
          freeMode={true}
          modules={[FreeMode]}
          breakpoints={{
            640: {
              width: 300,
              slidesPerView: 3.3,
            },
            768: {
              width: 768,
              slidesPerView: 5,
            },
          }}
        >
          {subCategories && subCategories.map((cat) => <SwiperSlide key={cat.id}>
            <span className={categoryId === cat.id ? 'btn btn-primary' : 'btn btn-light'} onClick={() => handleActiveCategory(cat.id)} >{cat.name}</span>
          </SwiperSlide>)}
        </Swiper>
      </div>

      <InfiniteScroll
        pageStart={currentPage}
        loadMore={loadMoreProducts}
        hasMore={(!searchPane.keyword || searchPane.keyword === '') ? false : true}
        loader={<div className="loader" key={0}><div className="spinner-grow spinner-grow-sm text-primary"></div> <div className="spinner-grow spinner-grow-sm text-primary"></div> <div className="spinner-grow spinner-grow-sm text-primary"></div></div>}
      >
        <div className="filtered-products">
          { (!searchPane.keyword || searchPane.keyword === '') && productListData && productListData.products && productListData.products.total_count > 0 && productListData.products.items.map((item, idx) => {
            return <div key={item.id} className="card border-0 product-slide-card">
              <div className="heart-icon">
                {!item.extension_attributes.is_added_in_wishlist && <AiOutlineHeart onClick={() => handleAddToWishlist(item)} />}
                {item.extension_attributes.is_added_in_wishlist && <span className='text-primary'><AiFillHeart onClick={() => handleRemoveFromWishlist(item)} /></span>}
              </div>
              <div className="fpimage shadow shadow-sm bg-light">
                {/* <Link href={`/product/`}>
                {item.productimageurl &&
                  <Image src={item.productimageurl} alt="" width="150" height="225" />
                }
              </Link> */}
              <Link href={`/product/${item.sku}`}>
                <div className="productsslide">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={0}
                    freeMode={true}
                    pagination={{
                      clickable: true,
                    }}
                    className="mySwiper"
                    modules={[Pagination]}
                  >
                    {item.media_gallery_entries && item.media_gallery_entries.length > 0 && item.media_gallery_entries.map((cat) => <SwiperSlide key={cat.id}><Image src={process.env.NEXT_PUBLIC_IMAGE_URL + cat.file} alt={cat.label} width="150" height="225" /></SwiperSlide>)}
                  </Swiper>
                </div>
                </Link>
              </div>
              {item?.extension_attributes?.price && <div className="brandname"><strong>{item?.extension_attributes?.brand_name}</strong></div>}
              <div className="fptitle text-muted">
                {item.name}
              </div>
              <div className="fprice">
                <del>{item?.extension_attributes?.price}</del>
                <span className='text-primary'>{item?.extension_attributes?.product_discount_price}</span>
              </div>
            </div>
          })}

          {searchData && searchData?.search_data?.total_count > 0 && searchData?.search_data.products.map((item, idx) => {
            return <div key={item.id} className="card border-0 product-slide-card">
              <div className="heart-icon">
                {!item.extension_attributes.is_added_in_wishlist && <AiOutlineHeart onClick={() => handleAddToWishlist(item)} />}
                {item.extension_attributes.is_added_in_wishlist && <span className='text-primary'><AiFillHeart onClick={() => handleRemoveFromWishlist(item)} /></span>}
              </div>
              <div className="fpimage shadow shadow-sm bg-light">
                {/* <Link href={`/product/`}>
                {item.productimageurl &&
                  <Image src={item.productimageurl} alt="" width="150" height="225" />
                }
              </Link> */}
                <div className="productsslide">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={0}
                    freeMode={true}
                    pagination={{
                      clickable: true,
                    }}
                    className="mySwiper"
                    modules={[Pagination]}
                  >
                    {item.media_gallery_entries && item.media_gallery_entries.length > 0 && item.media_gallery_entries.map((cat) => <SwiperSlide key={cat.id}><Image src={process.env.NEXT_PUBLIC_IMAGE_URL + cat.file} alt={cat.label} width="150" height="225" /></SwiperSlide>)}
                  </Swiper>
                </div>
              </div>
              {item?.extension_attributes?.price && <div className="brandname"><strong>{item?.extension_attributes?.brand_name}</strong></div>}
              <div className="fptitle text-muted">
                {item.name}
              </div>
              <div className="fprice">
                <del>{item?.extension_attributes?.price}</del>
                <span className='text-primary'>{item?.extension_attributes?.product_discount_price}</span>
              </div>
            </div>
          })}

          {productListData.products && productListData.products.total_count === 0 && <p>Items not found.</p>}
        </div>
      </InfiniteScroll>

    </div>
  );
}