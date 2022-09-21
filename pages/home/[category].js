import MainHomeContent from "../../components/home/mobile/MainHomeContent/MainHomeContent";
import { useRouter } from "next/router";

const HomeCategoryPage = (props) => {

  const router = useRouter() 
  
  return (
    <MainHomeContent {...props} catId={router.query.cat} catIndex={router.query.idx} />
  );
}

export default HomeCategoryPage