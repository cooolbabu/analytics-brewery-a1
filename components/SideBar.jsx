import SideBarHeader from "./SideBarHeader";

function SideBar() {
  return (
    <div className="px-4 w-80 min-h-full bg-base-300 py-12 grid grid-rows-[auto,1fr,auto]">
      {/* Sidebar Header*/}
      <SideBarHeader />
      {/* Sidebar New Brews */}
      {/* Sidebar Select or My Brews */}
      {/* Sidebar Brew Crafters */}
      {/* Sidebar Shared Brews */}
      {/* Sidebar Profile */}
    </div>
  );
}

export default SideBar;
