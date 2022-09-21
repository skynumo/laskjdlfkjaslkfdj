import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode"; 

export default function EmptyReturnOrderBox() {
  return (
    <div className='empty-order-box'>
      <div className='icon'>
        <Image src="/cart.png" alt="sample" width={120} height={120} />
      </div>
      <h2 className="text-center mb-5 heading1">Return/Exchange is empty</h2>
      <div className='bg-light card-body eob-details'>
        <h3>Return/Exchange is empty</h3>
        <p><span className="dot"></span>Return/Exchange can be only made within 14 day from the date of delivery.</p>
        <p><span className="dot"></span>Item should be in good condition and not used along with the original tag.</p>
        <p><span className="dot"></span>It also should be in same brand box you received.</p>
      </div>
    </div>
  );
}
