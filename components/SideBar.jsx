import MemberProfile from "./MemberProfile";
import NavLinks from "./NavLinks";
import SideBarHeader from "./SideBarHeader";

function SideBar() {
  return (
    <div className="px-2 w-72 min-h-full py-12 grid grid-rows-[auto,1fr,auto]">
      {/* Sidebar Header*/}
      <SideBarHeader />
      {/* Sidebar New Brews */}
      {/* Sidebar Select or My Brews */}
      {/* Sidebar Brew Crafters */}
      {/* Sidebar Shared Brews */}
      {/* Sidebar Profile */}
      <NavLinks />
      <MemberProfile />
    </div>
  );
}

export default SideBar;
