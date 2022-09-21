import {
  MdOutlineArrowBackIosNew
} from 'react-icons/md';

import {
  FaSearch
} from 'react-icons/fa';

import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { debounce } from "lodash";
import { getCountryCode, getToken } from '../../layout/utils';

export default function ProductSearchPane(props) {
 
  const router = useRouter();
  const queryString = router.query;

  const APIUrl = process.env.NEXT_PUBLIC_API_URL  

  const [categoryId, setCategoryId] = useState(queryString.pCatId ? queryString.pCatId : '73');
  const [brandId, setBrandId] = useState(queryString.pBrandId ? queryString.pBrandId : '');
  const [searchData, setSearchData] = useState({});
  const [searchPane, setSearchPane] = useState({
    showSearchPane: true,
  });

  const searchProducts = async (keywords) => {

    const customertoken = getToken();
    const countryCode = getCountryCode();
 
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
    } catch (err) {
      console.log(err); 
    }
  };

  useEffect(() => {

    if (router.query) {
      const queryString = router.query;
      setCategoryId(queryString.pCatId ? queryString.pCatId : '73')
      setBrandId(queryString.pBrandId ? queryString.pBrandId : '')
    }

  }, [categoryId, brandId, router])

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
      props.onClose && props.onClose();  
      const href = { pathname: '/products', query: { pBrandId: brandId, pCatId: categoryId, search: keywords } }
      router.push(href);
    }
  };

  const handleClearSearch = () => {
    searchProducts([]);
    props.onClose && props.onClose();
  }

  const handleBrandNavigation = (href) => {
    props.onClose && props.onClose();
    router.push(href);
  }

  const handleCatNavigation = (href) => {
    props.onClose && props.onClose();
    router.push(href);
  }

  return (
    <SlidingPane
      closeIcon={<MdOutlineArrowBackIosNew />}
      isOpen={searchPane.showSearchPane}
      from="bottom"
      width="100%"
      title={<div className='custom-pane-header'><Image src="/logo.png" alt="Newness" width={696 * 0.2} height={142 * 0.2} /><span onClick={() => handleClearSearch()} className='link'>Clear All</span></div>}
      onRequestClose={() => props.onClose()}
    >
      <div className="searchpane">
        <div className="search-bar" onClick={() => setSearchPane({ ...searchPane, showSearchPane: true })}>
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
                return <span
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
  );
}