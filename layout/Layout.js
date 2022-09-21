import Head from 'next/head'
import BottomNavigation from "../components/global/mobile/BottomNavigation/BottomNavigation";
import TopBar from "../components/global/mobile/TopBar/TopBar";

export default function Layout({ children }) {
  return (
    <>
      <div className="app-container">
        <Head>
          <title>Newness</title>
          <link rel="icon" type="image/x-icon" href="https://newness.net/pub/media/favicon/stores/1/Newness-Brand-Logo-favicon.png" />
          <link rel="shortcut icon" type="image/x-icon" href="https://newness.net/pub/media/favicon/stores/1/Newness-Brand-Logo-favicon.png" />
          <meta name="keywords" content="Newness,Shop Fashion Clothing &amp; Accessories,fashion clothing store,fashion clothing brands,fashion clothing store near me,fashion clothing online,online shopping for women,online shopping clothes,online shopping for men,online shopping brands,online shopping cheap,online shopping for teens,online shopping for kids,clothing and accessories store,clothing and accessories brands,clothing brands for men,clothing brands for women,clothing brands for teens,clothing brands affordable,fashion accessories for men,fashion accessories brand,fashion accessories store,fashion and accessories
namshi,daraz bangladesh,darazbd,namshi.com,vogacloset,maxfashion, max fashion,ferfectch,adidas,nike,puma,amazon,evaly,aleshamart,bangladesh online shopping,shopping,watches,watch,clock,clothing,shoes,accesorries,newness.net newness, new ness, newness bangladesh, newnessbd, newness bd, newness dubai, newness uae, newness bahrain, newness bh, newness sa, newness saudi, newness saudi arabia, newnessksa , newness shopping, newness, new ness"/>
          <meta name="robots" content="INDEX,FOLLOW" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
        </Head>
        <TopBar />
        <div className="app-inner-content">
          {children}
        </div>
        <BottomNavigation />
      </div>
    </>
  );
}
