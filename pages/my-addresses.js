import React, { useState, useContext, useEffect } from 'react'
// import Image from 'next/image';
import { FaBuilding, FaCheckCircle, FaEdit, FaHome, FaTrashAlt } from 'react-icons/fa';
import MapPicker from 'react-google-map-picker' 
import { convertAddressDataToFormData, getFirstLastName, getFullname, getSelectedCountryData, getStreetArray, getToken, isBillingAddress, isShippingAddress } from '../layout/utils';
import toast from 'react-hot-toast'; 
import { FiChevronLeft } from "react-icons/fi";
import { AppContext } from './_app';
import { Modal } from '../components/common/modal';
import { useRouter } from 'next/router'

const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;

const MyAddresses = () => {

  const appData = useContext(AppContext)
  const APIUrl = process.env.NEXT_PUBLIC_API_URL 
  const router = useRouter()

  const countryCode = appData.countryCode;
  const googleMapAPIKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

  const selectedCountry = getSelectedCountryData(appData.countryList, countryCode);

  const [locationStep, setLocationStep] = useState({
    currentStep: 'addressList',
    prevStep: 'backToCart'
  })

  const [addressDetails, setAddressDetails] = useState([])
  const [addAddressData, setAddAddressData] = useState({ country_id: selectedCountry?.id, country: selectedCountry?.full_name_english })
  const [editAddressData, setEditAddressData] = useState({})
  const [deleteAddressConfirm, setDeleteAddressConfirm] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('')

  const [selectedShippingMethod, setSelectedShippingMethod] = useState('')
  const [showShippingMethods, setShowShippingMethods] = useState(false)
  const [shippingMethods, setShippingMethods] = useState([])
  
  // Location Picker
  const [mapLoading, setMapLoading] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const fetchStateList = async (country_id) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/wt-address/${country_id.toUpperCase()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData && resData.length > 0) {
        setStateList(resData)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCitiesList = async (state) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/magecomp_cityandregionmanager/ajax/getcities`, {
        body: JSON.stringify({
          "selected_state": state
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData && request !== "AJAX ERROR") {
        // console.log('cities', resData)
        setStateList(resData)
      } else {
        console.log("Error in fetching cities")
      }
    } catch (err) {
      console.log(err);
    }
  };

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    setMapLoading(true)
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      setDefaultLocation(currentLocation);
      setMapLoading(false)

      console.clear()
      getReverseGeocodingData(position.coords.latitude, position.coords.longitude)
    });
    setZoom(DefaultZoom);
  }

  // Note This have to check on live site
  function getReverseGeocodingData(lat, lng) {
    const latlng = new google.maps.LatLng(lat, lng);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(status);
      }
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results);
        // console.log('test3')
        // let address = (results[0].formatted_address);
      }
    });
  }

  const returnToAddAddress = () => {
    setLocationStep({
      ...locationStep, 
      currentStep: 'addressList', 
      prevStep: locationStep.currentStep
    })
    setAddAddressData({})
  }

  const handleAddAddress = () => {
    setLocationStep({
      ...locationStep, 
      currentStep: 'addressMap', 
      prevStep: locationStep.currentStep
    })
  }

  const handleDeleteAddress = (id) => {
    setDeleteAddressConfirm(true)
    setSelectedAddress(id)
  }

  
  const confirmDeleteAddress = () => {
    if (selectedAddress !== '') {
      appData.deleteShippingAddress(selectedAddress)
      setDeleteAddressConfirm(false)
    } else {
      darkToast('Selected address id not found');
    }
  }

  const cancelDeleteAddress = () => {
    setDeleteAddressConfirm(false)
  }
  
  const handleMapAddressDetails = () => {
    setLocationStep({
      ...locationStep, 
      currentStep: 'addAddressForm', 
      prevStep: locationStep.currentStep
    })
  }

  const editAddress = async (id) => {

    setLocationStep({
      ...locationStep, 
      currentStep: 'editAddressForm', 
      prevStep: locationStep.currentStep
    })

    const foundAddress = addressDetails.find(a => a.id === id);
    if (foundAddress !== undefined) {
      const convertedAddress = await convertAddressDataToFormData(foundAddress, selectedCountry);
      setEditAddressData(convertedAddress)
    } else {
      console.log('Edit address not found.');
    }

  }

  const handleContinue = () => {
    setShowShippingMethods(true)
    console.log('Continue Address clicked')
  }

  useEffect(() => {
    if (appData.user.addressList.total_count > 0) {
      setAddressDetails(appData.user.addressList.items)
    }

    if (appData.shippingMethods) {
      setShippingMethods(appData.shippingMethods)
      // console.log('appData.shippingMethods', appData.shippingMethods)
    }

    // if (navigator) {
    //   setMapLoading(true)
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     const currentLocation = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     }

    //     setDefaultLocation(currentLocation);
    //     setMapLoading(false)
    //   });

    //   // console.log("loaded", navigator.geolocation)
    // }

  }, [appData])

  useEffect(() => {
    fetchStateList(countryCode); // Fetch List of States
  }, [countryCode])


  const handleSelectShippingMethod = (value) => {
    setSelectedShippingMethod(value)
  }

  const handleSelectedShipping = () => {
    if (selectedShippingMethod) {
      setShowShippingMethods(false)
      sessionStorage.setItem('selectedShippingMethod', selectedShippingMethod);
      appData.getShippingInformation(selectedShippingMethod, props.onContinue)
      // props.onContinue && props.onContinue() // Next step payments
    } else {
      console.log('Select shipping method.');
    }
  }

  const addCustomerDetailsChange = (e) => {

    let { value, name } = e.target;
    
    let data = { ...addAddressData, [name]: value }

    if (name === 'state') {
      fetchCitiesList(value)
    }
 
    setAddAddressData(data); // internal state
  }

  const darkToast = (message) => {
    toast(message,
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  }

  const submitNewAddress = () => {

    const nameArr = getFirstLastName(addAddressData.name);
    const streetArr = getStreetArray(addAddressData);

    const addUpdateData = {
      customerAddress: {
        default_shipping: isShippingAddress(addAddressData),
        default_billing: isShippingAddress(addAddressData),
        customer_id: appData?.customerDetails?.id,
        firstname: nameArr?.firstname,
        lastname: nameArr?.lastname,
        postcode: addAddressData?.postcode,
        telephone: addAddressData?.telephone,
        city: addAddressData?.city,
        region: {
          region: addAddressData?.state,
          region_id: 0,
          region_code: addAddressData?.state
        },
        street: streetArr,
        country_id: selectedCountry?.id,
        custom_attributes: [
          {
            value: "",
            attribute_code: "latitude"
          },
          {
            value: "",
            attribute_code: "longitude"
          }
        ],
      }
    }

    console.clear();
    console.log('Submit Address', addAddressData)

    if (!addAddressData.name || addAddressData.name === '') {
      darkToast('Please add full name.')
      return
    }

    if (!addAddressData.telephone || addAddressData.telephone === '') {
      darkToast('Please add your number.')
      return
    }

    if (!addAddressData.houseno || addAddressData.houseno === '') {
      darkToast('Please add house number.')
      return
    }

    if (!addAddressData.address || addAddressData.address === '') {
      darkToast('Please add address')
      return
    }

    if (!addAddressData.area || addAddressData.area === '') {
      darkToast('Please add area')
      return
    }

    if (!addUpdateData.customerAddress.country_id || addUpdateData.customerAddress.country_id === '') {
      darkToast('Please add country')
      return
    }

    if (!addAddressData.state || addAddressData.state === '') {
      darkToast('Please add state')
      return
    }

    if (!addAddressData.city || addAddressData.city === '') {
      darkToast('Please add city')
      return
    }

    if (!addAddressData.postcode || addAddressData.postcode === '') {
      darkToast('Please add zipcode')
      return
    }

    appData.addUpdateAddress(addUpdateData, returnToAddAddress)
  }

  const submitUpdateAddress = () => {

    let nameArr = [];
    if (editAddressData.name) {
      nameArr = getFirstLastName(editAddressData.name);
    } else {
      nameArr = { firstname: editAddressData.firstname, lastname: editAddressData.lastname }
    }
    const streetArr = getStreetArray(editAddressData);

    const updateData = {
      customerAddress: {
        id: editAddressData.id,
        default_shipping: isShippingAddress(editAddressData),
        default_billing: isBillingAddress(editAddressData),
        customer_id: appData?.customerDetails?.id,
        firstname: nameArr?.firstname,
        lastname: nameArr?.lastname,
        postcode: editAddressData?.postcode,
        telephone: editAddressData?.telephone,
        city: editAddressData?.city,
        region: {
          region: editAddressData.state ? editAddressData?.state : editAddressData?.region,
          region_id: 0,
          region_code: editAddressData.state ? editAddressData?.state : editAddressData?.region_code,
        },
        street: streetArr,
        country_id: editAddressData.country_id,
        custom_attributes: [
          {
            value: "",
            attribute_code: "latitude"
          },
          {
            value: "",
            attribute_code: "longitude"
          }
        ],
      }
    }

    // console.clear();
    // console.log('Update Customer Address', editAddressData)

    if (!editAddressData.firstname || editAddressData.firstname === '') {
      darkToast('Please add full name.')
      return
    }

    if (!editAddressData.telephone || editAddressData.telephone === '') {
      darkToast('Please add your number.')
      return
    }

    if (!editAddressData.houseno || editAddressData.houseno === '') {
      darkToast('Please add house number.')
      return
    }

    if (!editAddressData.address || editAddressData.address === '') {
      darkToast('Please add address')
      return
    }

    if (!editAddressData.area || editAddressData.area === '') {
      darkToast('Please add area')
      return
    }

    if (!editAddressData.country || editAddressData.country === '') {
      darkToast('Please add country')
      return
    }

    if (!editAddressData.state || editAddressData.state === '') {
      darkToast('Please add state')
      return
    }

    if (!editAddressData.city || editAddressData.city === '') {
      darkToast('Please add city')
      return
    }

    if (!editAddressData.postcode || editAddressData.postcode === '') {
      darkToast('Please add city')
      return
    }

    appData.addUpdateAddress(updateData, returnToAddAddress)
  }

  const editCustomerDetailsChange = (e) => {

    let { value, name } = e.target;
    let data = Object.assign({}, editAddressData);

    data = { ...data, [name]: value }

    if (name === 'name') {
      const [firstname, lastname] = value.split(" ");
      data = { ...data, firstname: firstname, lastname: lastname }
    }

    if (name === 'houseno' || name === 'address' || name === 'area') {
      const street = data.street['0'].split(",");

      if (name === 'houseno') street['0'] = value.trimStart()
      if (name === 'address') street['1'] = value.trimStart()
      if (name === 'area') street['2'] = value.trimStart()

      data = { ...data, street: [street['0'] + ',' + street['1'] + ',' + street['2']] }
    }

    if (name === 'state') {
      data = { ...data, region: { region: value, region_code: value, region_id: 0 }, region_id: 0 }
      fetchCitiesList(value)
    }

    setEditAddressData(data)
  }

  const handlePageBackButton = () => {
    if (locationStep.currentStep === 'addressList') {
      router.back()
    } else {
      returnToAddAddress() 
    }
  }

  return (
    <div className="my-cards-ui my-addresses-page">
      <div className="cart-header">
        <span onClick={() => handlePageBackButton()} className="carent-icon-circle icon">
          <FiChevronLeft />
        </span>
        My Addresses
      </div>

      <div className='checkout-location'>

        {/* Step 1 */}
        {locationStep.currentStep === 'addressList' &&
          <div className="select-address card-body">
            <h3>Select Address</h3>

            {addressDetails && addressDetails.map((address, idx) => {
              return <div key={idx} className="selected-address card">
                {appData.selectedShippingAddress === address && <div className="addresschecked"><FaCheckCircle className='text-success' /></div>}
                <div className="addressbox" onClick={() => appData.selectShippingAddress(address)}>
                  <h3>{address?.firstname + ' ' + address?.lastname} </h3>
                  <p>{`${address?.street}, ${address?.city},  ${address?.postcode}, ${address?.region?.region}, ${address?.country_id}`}</p>
                </div>
                <div className="addressactions">
                  <button className='btn btn-sm btn-light' onClick={() => editAddress(address.id)}><FaEdit /></button>
                  <button className='btn btn-sm btn-light text-danger' onClick={() => handleDeleteAddress(address.id)}><FaTrashAlt /></button>
                </div>
              </div>
            })
            }

            <button className='btn btn-outline-secondary w-100 mb-3' onClick={() => handleAddAddress()}>Add Address</button>

          </div>
        }

        {/* Step 2 */}
        {locationStep.currentStep === 'addressMap' &&
          <div className="select-address-map">
            <div className="d-flex align-items-center d-none justify-content-between">
              <div className="form-group mb-3">
                <label>Latitute:</label>
                <button className='btn btn-primary' onClick={handleResetLocation}>Reset Location</button>
              </div>
              <div className="form-group mb-3">
                <label>Latitute:</label><input className='form-control w-auto' type='text' value={location.lat} disabled />
              </div>
              <div className="form-group mb-3">
                <label>Longitute:</label><input className='form-control' type='text' value={location.lng} disabled />
              </div>
              <div className="form-group mb-3">
                <label>Zoom:</label><input className='form-control' type='text' value={zoom} disabled />
              </div>
            </div>

            {!mapLoading && <div className="map">
              <MapPicker defaultLocation={defaultLocation}
                zoom={zoom}
                mapTypeId="roadmap"
                onChangeLocation={handleChangeLocation}
                onChangeZoom={handleChangeZoom}
                apiKey={googleMapAPIKey}
              />
              <div className="card-body">
                <button className='btn btn-primary btn-lg w-100' onClick={() => handleMapAddressDetails()}>Address Details</button>
              </div>
            </div>
            }
          </div>
        }

        {/* Step 3 */}
        {locationStep.currentStep === 'addAddressForm' &&
          <div className="select-address-details card-body">
            <h3>Customer & Address Details</h3>
            <input
              className='form-control'
              type="text"
              name="name"
              value={addAddressData?.name}
              placeholder='Name'
              onChange={(e) => addCustomerDetailsChange(e)}
            />
            <input
              className='form-control'
              type="text"
              name="telephone"
              placeholder='Number'
              value={addAddressData?.telephone}
              onChange={(e) => addCustomerDetailsChange(e)}
            />
            <hr />
            <input
              className='form-control'
              type="text"
              name="houseno"
              value={addAddressData?.houseno}
              placeholder='House No.'
              onChange={(e) => addCustomerDetailsChange(e)}
            />
            <input
              className='form-control'
              type="text"
              name="address"
              value={addAddressData?.address}
              placeholder='Address'
              onChange={(e) => addCustomerDetailsChange(e)}
            />
            <input
              className='form-control'
              type="text"
              name="area"
              value={addAddressData?.area}
              placeholder='Area'
              onChange={(e) => addCustomerDetailsChange(e)}
            />
            <input
              className='form-control'
              type="text"
              readOnly
              name="country"
              value={addAddressData.country ? addAddressData.country : selectedCountry.full_name_english}
              placeholder='Country'
              onChange={(e) => addCustomerDetailsChange(e)}
            />

            {stateList.length === 0 ?
              <input
                className='form-control'
                type="text"
                name="state"
                value={addAddressData?.state}
                placeholder='State'
                onChange={(e) => addCustomerDetailsChange(e)}
              />
              :
              <select className='form-control custom-select' name="state" value={addAddressData?.state} onChange={(e) => addCustomerDetailsChange(e)}>
                <option value="">Select state...</option>
                {
                  stateList.map((state, idx) => <option key={idx} value={state.title}>{state.title}</option>
                  )}
              </select>
            }

            {cityList.length === 0 ?
              <input
                className='form-control'
                type="text"
                name="city"
                value={addAddressData?.city}
                placeholder='City'
                onChange={(e) => addCustomerDetailsChange(e)}
              />
              :
              <select className='form-control custom-select' name="city" value={addAddressData?.city} onChange={(e) => addCustomerDetailsChange(e)}>
                <option value="">Select city...</option>
                {
                  cityList.map((city, idx) => <option key={idx} value={city.full_name_english}>{city.full_name_english}</option>
                  )}
              </select>
            }

            <input
              className='form-control'
              type="text"
              name="postcode"
              value={addAddressData?.postcode}
              placeholder='Zip Code'
              onChange={(e) => addCustomerDetailsChange(e)}
            />
            <div className="addresstype">
              <label>
                <input
                  type="radio"
                  name="addresstype"
                  value="Home"
                  checked={!addAddressData.addresstype || (addAddressData.addresstype === 'Home') ? true : false}
                  onChange={(e) => addCustomerDetailsChange(e)}
                /> <FaHome /> Home
              </label>
              <label>
                <input
                  type="radio"
                  name="addresstype"
                  value="Flat"
                  onChange={(e) => addCustomerDetailsChange(e)}
                /> <FaBuilding /> Flat
              </label>
              <label>
                <input
                  type="radio"
                  name="addresstype"
                  value="Other"
                  onChange={(e) => addCustomerDetailsChange(e)}
                /> Other
              </label>
            </div>
            <button className='btn btn-primary btn-lg w-100' onClick={() => submitNewAddress()}>Add Address</button>
          </div>
        }

        {locationStep.currentStep === 'editAddressForm' &&
          <div className="select-address-details card-body">
            <h3>Customer & Address Details</h3>
            <input
              className='form-control'
              type="text"
              name="name"
              required={true}
              defaultValue={editAddressData?.name}
              placeholder='Name'
              onChange={(e) => editCustomerDetailsChange(e)}
            />
            <input
              className='form-control'
              type="text"
              name="telephone"
              placeholder='Number'
              value={editAddressData?.telephone}
              onChange={(e) => editCustomerDetailsChange(e)}
            />
            <hr />
            <input
              className='form-control'
              type="text"
              name="houseno"
              value={editAddressData?.houseno}
              placeholder='House No.'
              onChange={(e) => editCustomerDetailsChange(e)}
            />
            <input
              className='form-control'
              type="text"
              name="address"
              required={true}
              value={editAddressData?.address}
              placeholder='Address'
              onChange={(e) => editCustomerDetailsChange(e)}
            />
            <input
              className='form-control'
              type="text"
              name="area"
              value={editAddressData?.area}
              placeholder='Area'
              onChange={(e) => editCustomerDetailsChange(e)}
            />
            <input
              className='form-control'
              type="text"
              name="country"
              value={editAddressData.country ? editAddressData.country : selectedCountry.full_name_english}
              placeholder='Country'
              onChange={(e) => editCustomerDetailsChange(e)}
            />

            {stateList.length === 0 ?
              <input
                className='form-control'
                type="text"
                name="state"
                value={editAddressData?.state}
                placeholder='State'
                onChange={(e) => editCustomerDetailsChange(e)}
              />
              :
              <select className='form-control custom-select' name="state" value={editAddressData?.state} onChange={(e) => editCustomerDetailsChange(e)}>
                <option value="">Select state...</option>
                {
                  stateList.map((state, idx) => <option key={idx} value={state.title}>{state.title}</option>
                  )}
              </select>
            }

            {cityList.length === 0 ?
              <input
                className='form-control'
                type="text"
                name="city"
                value={editAddressData?.city}
                placeholder='City'
                onChange={(e) => editCustomerDetailsChange(e)}
              />
              :
              <select className='form-control custom-select' name="city" value={editAddressData?.city} onChange={(e) => editCustomerDetailsChange(e)}>
                <option value="">Select city...</option>
                {
                  cityList.map((city, idx) => <option key={idx} value={city.full_name_english}>{city.full_name_english}</option>
                  )}
              </select>
            }

            <input
              className='form-control'
              type="text"
              name="postcode"
              value={editAddressData?.postcode}
              placeholder='Zip Code'
              onChange={(e) => editCustomerDetailsChange(e)}
            />
            <div className="addresstype">
              <label>
                <input
                  type="radio"
                  name="addresstype"
                  value="Home"
                  checked={!editAddressData.addresstype || editAddressData.addresstype === 'Home' ? true : false}
                  onChange={(e) => editCustomerDetailsChange(e)}
                /> <FaHome /> Home
              </label>
              <label>
                <input
                  type="radio"
                  name="addresstype"
                  value="Flat"
                  checked={editAddressData.addresstype === 'Flat' ? true : false}
                  onChange={(e) => editCustomerDetailsChange(e)}
                /> <FaBuilding /> Flat
              </label>
              <label>
                <input
                  type="radio"
                  name="addresstype"
                  value="Other"
                  checked={editAddressData.addresstype === 'Other' ? true : false}
                  onChange={(e) => editCustomerDetailsChange(e)}
                /> Other
              </label>
            </div>
            <button className='btn btn-primary w-100' onClick={() => submitUpdateAddress()}>Update Changes</button>
          </div>
        }

        {
          showShippingMethods && <div className='shipping-methods '>
            <div className="card-body">
              <h3>Shipping Method</h3>
              {shippingMethods && shippingMethods.length > 0 && shippingMethods.map((option, idx) => {
                if (option.available) {
                  return <div key={idx} className="form-check">
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={() => handleSelectShippingMethod(option.method_code)}
                        checked={selectedShippingMethod == option.method_code ? true : false}
                      />
                      {option?.method_title} {option?.price_incl_tax}
                    </label>
                  </div>
                }
              })}
              {shippingMethods && shippingMethods?.length === 0 && <div className='mb-3'><small>Shipping method not found.</small></div>}
              <button disabled={selectedShippingMethod === '' ? true : false} className='btn btn-primary w-100' onClick={() => handleSelectedShipping()}>OK</button>
            </div>
          </div>
        }

        {deleteAddressConfirm &&
          <Modal
            title="Newness"
            content="Do you want to continue with removing your address?"
            onClose={() => cancelDeleteAddress()}
            onConfirm={() => confirmDeleteAddress()}
          />
        }
      </div>
    </div>
  );
};

export default MyAddresses;
