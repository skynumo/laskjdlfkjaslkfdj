import { useContext } from "react";
import { AppContext } from "../../../../../pages/_app";
export default function SidebarFooter() {

  const appData = useContext(AppContext);
  const country = appData.countryList.main && appData.countryList.main.find(c => c.id === appData.countryCode)

  return (
    <>
      <div className='sidebar-footer'>
        <div className="select-country">
          <span onClick={() => appData.openCountryModal()}>Country & Language</span>
          <span>{country?.full_name_locale}</span>
        </div>
      </div>
    </>
  );
}
