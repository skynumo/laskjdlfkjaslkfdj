import { useRouter } from 'next/router'
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from 'next/link';
import parse from "html-react-parser";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineHeart,
  AiOutlineStar
} from 'react-icons/ai';
import { FaShare } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import TopBrands from '../home/mobile/MainHomeContent/components/Top Brands';
import RelatedProducts from '../home/mobile/MainHomeContent/components/RelatedProducts';
import { AppContext } from '../../pages/_app';
import { AddToCartSuccessModal } from "../common/AddToCartSuccessModal"
import { AddToCartFailedModal } from '../common/AddToCartFailedModal';
import { getCountryCode, getQuoteId, getToken, getTokenType } from '../../layout/utils';
import { Loader } from '../common/Loader';

export default function ProductContent(props) {

  const appData = useContext(AppContext)

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [starVal, setStarVal] = useState(0)
  const [addReviewData, setReviewData] = useState({})
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [quoteId, setQuoteId] = useState('')
  const [addToCartSuccess, setAddToCartSuccess] = useState(false)
  const [addToCartFailed, setAddToCartFailed] = useState(false)
  const [addToCartFailedMsg, setAddToCartFailedMsg] = useState('You need to choose options for your item.')
  const [addToCartLoader, setAddToCartLoader] = useState(false)
  
  const router = useRouter()
  const productSku = router.query ? router.query.sku : '';

  const [product, setProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({});

  const fetchProductData = async (productSku) => {

    const token = getToken();
    const countryCode = getCountryCode()
    
    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/wt-products/${productSku}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addToWishlist = async (productid) => {

    const customertoken = getToken();
    const countryCode = getCountryCode();

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
        // fetchYouMayLike(categoryId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromWishlist = async (productid) => {

    const customertoken = getToken();
    const countryCode = getCountryCode();

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/deletewishlist`, {
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
        // fetchYouMayLike(categoryId);
        console.log('Removed from wishlist');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    generateCartQuoteId();

    if (productSku !== '' && productSku !== undefined) {
      fetchProductData(productSku);
    } else {
      console.log("Product sku not found.");
    }
  }, [productSku])

  const handleToggleReadMore = () => {
    setShowFullDesc(!showFullDesc)
  }

  const handleAddReviewStar = (value) => {
    if (value === starVal) {
      setStarVal(0)
    } else {
      setStarVal(value)
    }
  }

  const handleReviewChange = (e) => {
    const { value } = e.target
    const formdata = {
      "reviews": {
        "product_id": product.product_id,
        "rating_votes": [
          {
            "rating_id": parseFloat(starVal).toFixed(1),
            "value": parseFloat(starVal).toFixed(1)
          }
        ],
        "nickname": appData.user ? appData.user.username : "",
        "detail": value,
        "title": "good"
      }
    }

    setReviewData(formdata);
  }

  const postReviewData = async (productSku) => {

    const token = getToken();
    const countryCode = getCountryCode();

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/wt-customer/reviews-add`, {
        method: 'POST',
        body: JSON.stringify(addReviewData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      if (res.status === 200) {
        fetchProductData(productSku);
        setReviewSubmitted(true)
      } else {
        console.log('Invalid request add review.');
        setReviewSubmitted(false)
      }
    } catch (err) {
      setReviewSubmitted(false)
      console.log(err);
    }
  };

  const postAddToCart = async (productSku) => {

    setAddToCartLoader(true);

    const quote_id = quoteId ? quoteId : getQuoteId();
    const countryCode = getCountryCode(); 

    const token = getToken();
    let url = `${APIUrl}/${countryCode}/V1/carts/mine/items`;

    const tokenType = getTokenType()
    if (tokenType === 'guest') {
      url = `${APIUrl}/${countryCode}/V1/guest-carts/${token}/items`;
    } 

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          "cartItem": {
            "quote_id": quote_id,
            "qty": 1,
            "sku": productSku
          }
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      const data = await res.json();
      console.log('Add to cart failed', data, res);
      if (res.status === 200) {
        setAddToCartSuccess(true);
        setAddToCartFailed(false)
        console.log('A product added to cart')
      } else {
        setAddToCartFailed(true)
        setAddToCartFailedMsg(data.message);
        setAddToCartSuccess(false); 
        console.log('Product add to cart failed.')
      }
      setAddToCartLoader(false);
    } catch (err) {
      console.log(err);
      setAddToCartSuccess(false);
      setAddToCartLoader(false);
    }

    setTimeout(() => {
      setAddToCartLoader(false)
    }, 5000);
  };

  const generateCartQuoteId = async () => {

    const token = getToken();
    const tokenType = getTokenType()
    const countryCode = getCountryCode();

    if (tokenType === 'guest') {
      sessionStorage.setItem('quoteid', token);
      setQuoteId(token)
    } else {
      try {
        const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/carts/mine`, {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        })
  
        const data = await res.json();
        if (res.status === 200) {
          sessionStorage.setItem('quoteid', data);
          setQuoteId(data)
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    postReviewData(productSku);
  }

  const handleSizeSelect = (size) => {
    setSelectedProduct({ ...selectedProduct, size: size })
  }

  const handleColorSelect = (color) => {
    setSelectedProduct({ ...selectedProduct, color: color })
  }
 
  const handleWishlist = (product) => {
    if (product.wishlist) {
      removeFromWishlist(product.product_id);
      setProduct({ ...product, wishlist: false })
    } else {
      setProduct({ ...product, wishlist: true })
      addToWishlist(product.product_id);
    }
  }

  const colorOptions = () => {
    let colorOptions = [];
    if (product !== null) {
      const simpleProducts = product.config_simple_product;
      if (simpleProducts)
        colorOptions = simpleProducts.reduce((newItems, item) => {

          let newItem = {};
          if (item.images.length > 0) {
            newItem.image = item.images['0']
            newItem.color = item.options['0'].label
            newItem.attribute_id = item.options['0'].attribute_id
          }

          if (!newItems.find((prevItem) => {
            return prevItem.color === newItem.color;
          })) {
            newItems = [...newItems, newItem];
          }

          return newItems;
        }, [])
    }
    return colorOptions;
  }

  const productColors = colorOptions();

  return (
    <React.Fragment>
      {product !== null &&
        <div className="card product-details-card position-relative">
          <div className='product-header'>
            <span onClick={() => router.back()} className='carent-icon-circle icon'><FiChevronLeft /></span>
            <span className='share-and-save text-primary'>
              <span className='icon'><FaShare /></span>
              <span className='icon' onClick={() => handleWishlist(product)}>
                {product.wishlist ? <AiFillHeart /> : <AiOutlineHeart />}
              </span>
            </span>
          </div>
          {(product.images) &&
            <div className='pdc-image'>
              <Image src={product.images['0']} alt="" height={414} width={414} />
            </div>
          }
          <div className="pdc-label bg-secondary">
            {product.label}
          </div>
          <div className='pdc-header-price'>
            <div className='pdc-header'>
              <div className='pdc-manufacturer'>{product.manufacturer}</div>
              <div className='pdc-name'>{product.name}</div>
            </div>
            <div className='pdc-price-box'>
              <del className='pdc-price'>{product.price}</del>
              <span className='pdc-dprice'>{product.discount_price}</span>
            </div>
          </div>

          <div className="pdc-full-details">

            {product.all_options.length > 0 &&
              product.all_options.map((option, idx) => {
                if (option.label === 'size') {
                  return <div key={idx} className="pdc-size-selector">
                    <div className="card-body">
                      <h3 className='card-header'>Size</h3>
                      <div className="pdc-sizes">
                        {option.value.map((size, sidx) =>
                          <button
                            onClick={() => handleSizeSelect(size)}
                            key={sidx}
                            className={selectedProduct.size && selectedProduct.size === size ? 'btn btn-primary btn-sm' : 'btn btn-outline-secondary btn-sm'}
                          >{size}</button>
                        )}
                      </div>
                      <hr />
                    </div>
                  </div>
                }

                if (option.label === 'color') {
                  return <div key={idx} className="pdc-color-selector">
                    <div className="card-body">
                      <h3 className='card-header'><span>Color</span></h3>
                      <div className="pdc-colors">
                        {productColors.map((citem, cidx) => <div key={citem.id ? citem.id : cidx} className='pdc-colorbox'>
                          <Image
                            src={citem.image}
                            height={40}
                            width={40}
                            alt=""
                            onClick={() => handleColorSelect(citem.image)}
                          />
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                }
              }
              )
            }

            <div className="card pdc-details">
              <div className="card-body py-0">
                <h3 className='card-header'>
                  <span>Product Details</span>
                  <span className='text-primary link' onClick={() => handleToggleReadMore()}>Read More</span>
                </h3>
                <div className="pdc-content text-muted" >
                  <div className='pdcc-short'>{!showFullDesc && parse(product.description)}</div>
                  {showFullDesc && parse(product.description)}
                </div>
                <div className="pdc-extra">
                  <div className="row">
                    <div className="col">
                      Short Description Sku
                    </div>
                    <div className="col">
                      {product.sku}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      Stock Status
                    </div>
                    <div className="col">
                      {product.stock_status ?
                        <span className='text-success'>In Stock</span> :
                        <span className='text-danger'>Out of Stock</span>
                      }
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      Product Label
                    </div>
                    <div className="col">
                      {product.label}
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            </div>

            {/* {product.info_care && product.info_care !== null && */}
            <div className="card pdc-info-and-care">
              <div className="card-body pt-0">
                <h3 className='card-header'>Info and Care</h3>
                <div className="pdcic-cards" >
                  <div className="card-body">
                    <span className='text-primary'>
                      {/* <AiOutlineCheck /> */}
                      <Image width={70} height={70} alt="" src="/single-product/icn_genuline@2x.png" />
                    </span>
                    <p>100% Genuine</p>
                  </div>
                  <div className="card-body">
                    <span className='text-primary'>
                      {/* <TbTruckDelivery /> */}
                      <Image width={70} height={70} alt="" src="/single-product/icn_postdelivery@2x.png" />
                    </span>
                    <p>Fast Delivery</p>
                  </div>
                  <div className="card-body">
                    <span className='text-primary'>
                      {/* <AiOutlineCheck /> */}
                      <Image width={70} height={70} alt="" src="/single-product/icn_cashon@2x.png" />
                    </span>
                    <p>Cost On Delivery</p>
                  </div>
                  <div className="card-body">
                    <span className='text-primary'>
                      {/* <AiOutlineCheck /> */}
                      <Image width={70} height={70} alt="" src="/single-product/icn_exange@2x.png" />
                    </span>
                    <p>Free 14 days Exchange</p>
                  </div>
                </div>
                <hr />
              </div>
            </div>
            {/* } */}

            {product.review && product.review !== null &&
              <div className="card pdc-rating-review">
                <div className="card-body pt-0">
                  <h3 className='card-header pb-0'>
                    <span>Rating & Review</span>
                    <span className='text-primary link' onClick={() => handleToggleReadMore()}>Read More</span>
                  </h3>
                  <div className='text-muted pdcrc-desc'>
                    <span className='badge badge-primary bg-primary'>{product?.review?.avg_rating_percent} <AiFillStar /></span>
                    <span className='text-primary pdcr-rating'>{product?.review.reviews.length} Ratings</span>
                  </div>
                  {product.review.reviews.map((rwItem, rwIdx) => {
                    return <div key={rwItem.review_id} className="pdcrc-msg-box">
                      <h3 className='card-header pb-0'>{rwItem.nickname}</h3>
                      <div className="pdcrc-ratingstart-date">
                        <div className="pdcrc-stars">
                          {[...Array(rwItem.rating_votes['0'].value)].map((star, idx) => <AiFillStar key={idx} className='text-warning' />)}
                          {[...Array(5 - rwItem.rating_votes['0'].value)].map((star, idx) => <AiOutlineStar key={idx} className='text-muted' />)}
                        </div>
                        <span className="pdcrc-date text-muted">
                          {rwItem.created_at}
                        </span>
                      </div>
                      <div className='mb-3'>{rwItem.detail}</div>
                    </div>
                  })}
                  <hr />
                </div>
              </div>
            }

            {!reviewSubmitted &&

              <div className="card pdc-review-card">
                <div className="card-body pt-0">
                  <h3 className='card-header'>Do you own or have used this product?</h3>
                  <div className='text-muted pdcrc-desc'>Tell us your opinion by assigning a rating.</div>
                  <div className="pdcrc-stars">
                    {[...Array(5)].map((star, idx) => {
                      if (idx <= (starVal - 1)) {
                        return <AiFillStar key={idx} className='text-warning' onClick={() => handleAddReviewStar(idx + 1)} />
                      } else {
                        return <AiOutlineStar key={idx} onClick={() => handleAddReviewStar(idx + 1)} />
                      }
                    })}
                  </div>
                  <form className='review-form' action="" onSubmit={(e) => handleReviewSubmit(e)}>
                    <div className="form-group mb-4">
                      <textarea className='w-100 form-control' onChange={(e) => handleReviewChange(e)} rows='5'></textarea>
                    </div>
                    <button className={starVal === 0 ? 'btn btn-light btn-lg w-100' : 'btn btn-primary btn-lg w-100'} disabled={starVal === 0}>Add Review</button>
                  </form>
                </div>
              </div>
            }

            {reviewSubmitted &&
              <div className="card pdc-review-thankyou">
                <div className="card-body">
                  <h3 className='card-header'>Ratings</h3>
                  <div className="ratingbox">
                    {/* <AiFillCheckCircle className='text-primary' /> */}
                    <div className='card-img'><Image src="/single-product/AddedBlue@2x.png" alt="" width={100} height={100} /></div>
                    <div className="card-body p-0">
                      <h3 className='card-header'>Thank you, We received your review!</h3>
                      <div className='text-muted pdcrc-desc'>We are still working on our review feature. We will publish your review as soon as we are ready.</div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <TopBrands data={product.brand.slice(0, 20)} />
            <RelatedProducts data={product.related_product} />
          </div>
          <div className="pdc-add-to-cart">
            <button onClick={() => postAddToCart(product.sku)} className='btn btn-primary btn-lg'>
              <span>ADD TO CART {addToCartLoader && <Loader type="inline-loader" />} </span> <span>{product.discount_price}</span>
            </button>
          </div>

          {addToCartSuccess && <AddToCartSuccessModal />}
          {addToCartFailed && <AddToCartFailedModal message={addToCartFailedMsg} onClose = {() => setAddToCartFailed(false)} />}
        </div>
      }
    </React.Fragment>
  );
}