import Image from 'next/image';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { SelectCountryModal } from '../components/common/SelectCountryModal';
import { getCountryCode } from '../layout/utils';

const Splash = () => {

  const router = useRouter();
  const APIUrl = process.env.NEXT_PUBLIC_API_URL
 
  const nextNavigationHandler = () => {
   const countryCode = localStorage.getItem('countryCode');
   if (countryCode && countryCode !== undefined && countryCode !== null) {
    // router.push('/top-categories')
    handleOnSkip()
   } else {
    toast('Please select a country.')
   }
  }

  const handleOnSkip = async () => {
    const countryCode = getCountryCode()

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/guest-carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (res.status === 200) {
        const resData = await res.json();
        console.log('Skipped login.')
        sessionStorage.setItem('guestToken', resData)
        sessionStorage.setItem('tokenType', 'guest');
        router.push('/home')
      } else {
        console.log('Error occured while getting guest token.')
      }
    } catch (err) {
      console.log(err);
    }
    
  }

  return (
    <div className='slash-country'>
      <Image width='180' height='36' className="white-logo" src="/logo.svg" alt="Newness" />
      <SelectCountryModal 
        onClose={() => nextNavigationHandler()}
        backdrop={false}  
        modalType= {"first"}
        btnLabel={"Start"}
      />
    </div>
  );
}

export default Splash
