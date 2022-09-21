import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaAngleRight } from 'react-icons/fa';  

const TopCategoriesSplash = () => {

  const APIUrl = process.env.NEXT_PUBLIC_API_URL 

  const router = useRouter(); 

  const [topCats, setTopCats] = useState([])

  const onClickHandler = (cat, index) => {
    const countryCode = localStorage.getItem('countryCode');
    if (countryCode && countryCode !== undefined && countryCode !== null) {
      router.push({pathname: `/sign-in/`, query: {category: cat.name.toLowerCase(), cat: cat.id, idx: index, skip: true, hideBack: true}})
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {

      const adminToken = localStorage.getItem('appAdmin');
      const countryCode = localStorage.getItem('countryCode');

      if (!countryCode) {
        console.log("Top Categories page country code not found.");
      }

      if (!adminToken) {
        console.log("Top Categories page admin token not found.");
      }
      
      try {
        const res = await fetch(`${APIUrl}/V1/categorylisting`, {
          method: 'POST',
          body: JSON.stringify({
            "data": {
              "storecode": countryCode ? countryCode.toLowerCase() : '',
              "admintoken": adminToken
            }
          }),
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const data = await res.json();
        if (data.success === 200) {
          setTopCats(data.data.children_data);
        }
      } catch (err) {
        console.log("An error occured during top category fetch.");
      }
    };

    fetchCategories()
  }, [])

  const CategoryRow = ({category, index, className}) => {
    return <div className={className}>
    <div className="flexCol">
      <Image width='211' height='130' src={category?.category_image} alt="" />
    </div>
    <div className="flexCol d-flex align-items-center justify-content-center">
      <Button onClick={() => onClickHandler(category, index)} variant='outline-secondary'>{category?.name} <FaAngleRight /></Button>
    </div>
  </div>
  }

  return (
    <div className='slash-categories'>
      <div className="text-center">
        <Image width='210' height='43' className="white-logo" src="/logo.png" alt="Newness" />
      </div>
      <div className='top-categories'>

        {
        topCats && topCats.map((category, idx) => {
          return <CategoryRow 
            key={category.id} 
            className={idx % 2 === 0 ? "d-flex align-items-center" : "d-flex align-items-center flex-row-reverse"} 
            category={category} 
            index={idx} 
          />
        })
        }
     </div>
    </div>
  );
}

export default TopCategoriesSplash
