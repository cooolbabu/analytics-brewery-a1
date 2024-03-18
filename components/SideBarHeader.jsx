import { SiOpenaigym } from "react-icons/si";

function SideBarHeader() {
  return (
    <div className="flex items-center mb-4 gap-4 px-4">
      <SiOpenaigym className="h-10 w-10 text-primary" />
      <h2 className="text-xl forn-extrabold text-primary">Analytics Brewery</h2>
    </div>
  );
}

export default SideBarHeader;
