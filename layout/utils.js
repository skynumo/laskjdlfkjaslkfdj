export const getFullname = (addAddressData) => {
  let name = "";

  if (addAddressData.firstname) {
    name += addAddressData.firstname;
  }

  if (addAddressData.lastname) {
    name += " ";
    name += addAddressData.lastname;
  }

  return name;
};

export const getFirstLastName = (name) => {
  const nameArr = name ? name.split(" ") : [];
  if (nameArr.length > 1) {
    const [firstname, lastname] = nameArr;
    name = { firstname: firstname, lastname: lastname };
  } else {
    name = { firstname: name, lastname: "" };
  }
  return name;
};

export const getStreetArray = (data) => {
  let streetStr = "";

  if (data.houseno) streetStr += data.houseno;
  if (data.address) streetStr += ", " + data.address;
  if (data.area) streetStr += ", " + data.area;

  return [streetStr];
};

export const getStreetText = (data) => {
  let streetStr = "";

  if (data.street && data.street.length > 0) {
    streetStr = data.street["0"];
  }

  return streetStr;
};

export const getAddressByStreetArray = (data) => {
  const dataStreetStr = data.street[0];
  const dataStreetArr = dataStreetStr.split(",");

  let address = {
    houseno: dataStreetArr.length > 0 ? dataStreetArr["0"].trim() : "",
    address: dataStreetArr.length > 1 ? dataStreetArr["1"].trim() : "",
    area:
      dataStreetArr.length > 2
        ? dataStreetArr
            .slice(2)
            .toString()
            .trim()
        : "",
  };

  return address;
};

export const getSelectedCountryData = (list, code) => {
  let country = {};
  if (list.main && list.main.length > 0) {
    country = list.main.find((c) => c.store_code === code);
  }
  return country;
};

export const getAddressType = (data) => {
  let type = "Other";

  if (data.default_billing) {
    type = "Home";
  }

  if (data.default_shipping) {
    type = "Flat";
  }

  return type;
};

export const isShippingAddress = (data) => {
  if (data.addresstype === "Home") {
    return true;
  }
  return false;
};

export const isBillingAddress = (data) => {
  if (data.addresstype === "Flat") {
    return true;
  }
  return false;
};

export const convertAddressDataToFormData = (data, countryData) => {
  let newData = { ...data };

  // Name Conversion
  newData = { ...newData, name: getFullname(newData) };

  // Address Conversion
  const address = getAddressByStreetArray(newData);
  newData = { ...newData, ...address };

  // Region to State
  newData = { ...newData, state: newData?.region?.region };

  // Address Type
  newData = { ...newData, addresstype: getAddressType(data) };

  // Country
  newData = { ...newData, country: countryData?.full_name_english };

  return newData;
};

export const formatCardNumber = (value) => {
  const v = value.replace(/[^0-9\.]+/g, "").replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};


export const formatCardDate = (date) => {

  date = date.replace(/[^0-9\.]+/g, "").replace(
    /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
  ).replace(
    /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
  ).replace(
    /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
  ).replace(
    /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
  ).replace(
    /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
  ).replace(
    /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
  ).replace(
    /\/\//g, '/' // Prevent entering more than 1 `/`
  );

  return date;
}

export const getCardLastNumber = (number) => {
  let codedNumber = "XX";

  const forthNumber = number.split(' ')['3'].slice()
  codedNumber = codedNumber + forthNumber[2] + forthNumber[3]
  return codedNumber;
}

export const getGenderOptions = (index) => {
  return [
    'Male', 'Female', 'Other'
  ]
}

export const getGenderName = (index) => {
  const genders = getGenderOptions()
  return genders[index];
}

export const getStoreTypes = (index) => {
  return [
    'Men', 'Woman', 'Children'
  ]
}

export const getToken = (key = 'token') => {

  const tokenType = sessionStorage.getItem('tokenType');

  if (tokenType === 'guest') {
    const token = sessionStorage.getItem('guestToken');
    if(token && token !== null && token !== undefined && token !== '') {
      return token;
    }
  } else {
    const token = sessionStorage.getItem(key);
    if(token && token !== null && token !== undefined && token !== '') {
      return token;
    }
  }

  return false
}

export const getTokenType = (key = 'token') => {
  return  sessionStorage.getItem('tokenType'); 
}

export const getCountryCode = (key = 'countryCode') => {

  const code = localStorage.getItem(key);

  if(code && code !== null && code !== undefined && code !== '') {
    return code.toLowerCase();
  }

  return false
}


export const getQuoteId = (key = 'quoteid') => {
  const quoteid = sessionStorage.getItem(key);
  return quoteid
}