import React, { useContext, useState, useMemo } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { AppContext } from "../../pages/_app";
import { Loader } from "./Loader";

const countyListUseMemo = (clist) => {
  if (clist && clist.length > 0) {
    return clist;
  }
  return []
};

export const SelectCountryModal = (props) => {
  const appData = useContext(AppContext);
  const clist = appData.countryList.main;

  const countryList = useMemo(() => countyListUseMemo(clist), [clist]);

  const activeCountry = countryList && countryList.find(c => c.id === appData.countryCode)
  const [selectedCountry, setSelectedCountry] = useState(activeCountry ?? {});
  const [showLoader, setShowLoader] = useState(false);
 
  const onClose = () => {
    props.onClose && props.onClose();
  };

  const submitCountry = () => {
    setShowLoader(true)

    appData.setCountryCode && appData.setCountryCode(selectedCountry.id);
    localStorage.setItem('countryCode', selectedCountry.id);
    props.onClose && props.onClose();

    setTimeout(() => {
      setShowLoader(false)
    }, 5000);
  };

  const handleCountryCode = (country) => {
    if (props.modalType && props.modalType === "first") {
      appData.setCountryCode && appData.setCountryCode(country.id);
      localStorage.setItem('countryCode', country.id);
    } else {
      setSelectedCountry(country);
    }
  };

  // useEffect(() => {
  //   const countryCode = localStorage.getItem('countryCode');
  //   if (countryCode && countryCode !== undefined && countryCode !== null) {
  //     if (countryList) {
  //       const defaultCountry = countryList.find(c => c.id === countryCode); 
  //       setSelectedCountry(defaultCountry);
  //     }
  //   }  
  // }, [countryList])

  return (
    <Modal className="country-modal" backdrop={props.backdrop} centered show={countryList && countryList.length > 0} onHide={onClose}>
      <Modal.Body>
        {props.modalType && props.modalType === "first" ? (
          <h3 className="heading text-center">
            {props.title ?? "Select your country"}
          </h3>
        ) : (
          <h3 className="heading">{props.title ?? "Country"}</h3>
        )}
        <ListGroup>
          {countryList &&
            countryList.length > 0 &&
            countryList.map((item, idx) => {
              if (selectedCountry === item) {
                return (
                  <ListGroup.Item
                    className="active"
                    onClick={() => handleCountryCode(item)}
                    key={idx}
                  >
                    {item?.full_name_locale}{" "}
                    <span className="bg-success rounded dot"></span>
                  </ListGroup.Item>
                );
              } else {
                return (
                  <ListGroup.Item
                    onClick={() => setSelectedCountry(item)}
                    key={idx}
                  >
                    {item?.full_name_locale}
                  </ListGroup.Item>
                );
              }
            })}
        </ListGroup>
        {Object.keys(selectedCountry).length > 0 && 
          <Button variant="primary" className="w-100" onClick={() => submitCountry()}>
            {props.btnLabel ? props.btnLabel : 'Done'}
            {showLoader && <Loader type="inline" />}
          </Button>
        }
      </Modal.Body>
    </Modal>
  );
};
