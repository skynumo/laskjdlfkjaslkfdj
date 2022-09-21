import React, { useContext, useState } from "react";
import Image from "next/image";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import toast from "react-hot-toast";
import { AppContext } from "../../pages/_app";
import { formatCardDate, formatCardNumber, getToken } from "../../layout/utils";

export default function AddCardScreen({ onBack }) {
  const emptyCard = {
    name: "",
    card_number: "",
    cvv: "",
    expiry_date: "",
  }
  const [formData, setFormData] = useState(emptyCard);

  const appData = useContext(AppContext);

  const APIUrl = process.env.NEXT_PUBLIC_API_URL;
  const customertoken = appData.token;
  const countryCode = appData.countryCode;

  const handleFieldChange = (e) => {
    let { value, name } = e.target;

    if (name === 'card_number') {
      value = value.replace(/[^0-9\.]+/g, "");
      value = formatCardNumber(value);
    }

    if (name === 'expiry_date') {
      value = formatCardDate(value);
    }

    if (name === 'cvv') {
      value = value.replace(/[^0-9\.]+/g, "")
    }

    let data = { ...formData, [name]: value };
    setFormData(data);
  };

  const closeCardPage = () => {
    onBack && onBack();
  };

  const postSaveCard = async (cardData) => {

    const customertoken = getToken();

    try {
      const res = await fetch(
        `${APIUrl}/${countryCode.toLowerCase()}/V1/customer/save-card`,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              token: customertoken,
              name: cardData?.name,
              card_number: cardData?.card_number,
              expiry_date: cardData?.expiry_date,
              customer_id: appData.customerid,
            },
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customertoken}`,
          },
        }
      );
      const resData = await res.json();
      if (resData.success === 200) {
        toast.success("Your card has been saved.")
        setFormData(emptyCard)
        onBack && onBack();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitCardDetails = (e) => {
    e.preventDefault();

    if (formData.card_number === "") {
      toast("Please add card number.");
      return;
    }

    if (formData.card_number !== "" && formData.card_number.length < 19) {
      toast("Please valid card number.");
      return;
    }

    if (formData.expiry_date === "") {
      toast("Please add card expiry date.");
      return;
    }

    if (formData.cvv === "") {
      toast("Please add cvv");
      return;
    }

    if (formData.name === "") {
      toast("Please add card holder name.");
      return;
    }

    postSaveCard(formData)
  };

  return (
    <div className="checkout-page add-card-screen">
      <div className="checkout-header bg-primary text-white">
        <div onClick={() => closeCardPage()} className="go-back">
          <MdOutlineArrowBackIosNew />
        </div>
        <div className="sitelogo">
          <Link href="/home">
            <Image
              src="/logo.png"
              alt="Newness"
              width={696 * 0.2}
              height={142 * 0.2}
            />
          </Link>
        </div>
      </div>

      <div className="card checkout-card">
        <div className="card-body">
          <div className="bg-primary blue-card-ui">
            <div className="card-number">XXXX XXXX XXXX XXXX</div>
            <div className="card-details">
              <span>Holder Name</span>
              <span>Exp Date</span>
            </div>
          </div>

          <form
            className="add-card-form"
            onSubmit={(e) => submitCardDetails(e)}
          >
            <div className="mb-3">
              <label>Card Number</label>
              <input
                className="form-control"
                type="text"
                maxLength={19}
                pattern="[0-9 ]+"
                name="card_number"
                value={formData?.card_number}
                onChange={(e) => handleFieldChange(e)}
              />
            </div>
            <div className="row gs-2">
              <div className="col">
                <div className="mb-3">
                  <label>Expiry Date</label>
                  <input
                    className="form-control"
                    type="text"
                    maxLength={5}
                    name="expiry_date"
                    value={formData?.expiry_date}
                    onChange={(e) => handleFieldChange(e)}
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label>CVV</label>
                  <input
                    className="form-control"
                    type="text"
                    name="cvv"
                    maxLength={5}
                    value={formData?.cvv}
                    onChange={(e) => handleFieldChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label>Card Holder Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                maxLength={30}
                value={formData?.name}
                onChange={(e) => handleFieldChange(e)}
              />
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                onChange={(e) => handleFieldChange(e)}
                type="checkbox"
                value={formData.secureSave === 'yes' ? 'no' : 'yes'}
                name="secureSave"
                checked={formData.secureSave === 'yes'}
                id="saveSecuritly"
              />
              <label className="form-check-label" htmlFor="saveSecuritly">
                Securely save card and details
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100">
              + Add card
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
