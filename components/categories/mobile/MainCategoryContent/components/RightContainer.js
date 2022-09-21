import Image from "next/image"; 
import Link from "next/link";

export default function RightContainer(props) {
 
  const subSubCategories = props.subSubCategories ? props.subSubCategories : [];
  const parentCatId = props.parentCatId ? props.parentCatId : '73';

  return (
    <div className='sub-category-right'>
      {subSubCategories && subSubCategories.map((category) => (
        category.is_active && category.category_image && <div className="subSubcategorycard" key={category.id}>
          <Link href={{ pathname: '/products', query: { catId: category.id, pCatId: parentCatId } }}><Image src={category.category_image} alt="" width={246} height={130} /></Link>
          <p className="text">{category.name}</p>
        </div>
      ))}
      {subSubCategories.length === 0 &&  <div className="notextfound">No records found.</div>}
    </div>
  );
}
