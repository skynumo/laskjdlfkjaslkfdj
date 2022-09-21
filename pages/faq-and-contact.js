import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FiChevronLeft } from "react-icons/fi";

const FaqAndContacts = () => {

  const router = useRouter()

  const openExternalLink = (url) => {
    window.open(url);
  }

  return (
    <div className="faq-and-contact-ui">
      <div className="cart-header text-center">
        <span onClick={() => router.back()} className="carent-icon-circle icon">
          <FiChevronLeft />
        </span>
        Contact Us
      </div>

      <div className="contact-cards">

        <Link href="/write-to-us">
          <div className="card">
            <img src="/write-to-us.png" alt="" />
            <div className="card-body">
              <h3>Write to us</h3>
              <p>Drop us a line and we&apos;ll get back to you as fast as we can. Email us at</p>
            </div>
         </div>
        </Link>

        <div className="card" onClick={() => openExternalLink('https://www.facebook.com/newnesspeople')}>
          <img src="/facebook.png" alt="" />
          <div className="card-body">
            <h3>Facebook us</h3>
            <p>Contact with us on your favourite social network.</p>
          </div>
        </div>

        <div className="card" onClick={() => openExternalLink('https://twitter.com/newness_people')}>
          <img src="/twitter.png" alt="" />
          <div className="card-body">
            <h3>Twitter us</h3>
            <p>React out in 140 characters! We&apos;re @NEWNESS57148288</p>
          </div>
        </div>

        <div className="card" onClick={() => openExternalLink('https://www.instagram.com/newness_people/')}>
          <img src="/instagram.png" alt="" />
          <div className="card-body">
            <h3>Instagram us</h3>
            <p>Contact with us on your favourite social network</p>
          </div>
        </div>

        <div className="card">
          <img src="/phone_red.png" alt="" />
          <div className="card-body">
            <h3>Talk to us</h3>
            <p>7 days a week, 07:00 Am to 12:00 Am<br /> Call us on</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FaqAndContacts;
