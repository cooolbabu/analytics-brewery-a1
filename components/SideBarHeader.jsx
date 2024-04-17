import { SiOpenaigym } from "react-icons/si";
import ThemeToggle from "./ThemeToggle";

function SideBarHeader() {
  return (
    <div className="flex items-center mb-4 gap-4 px-4">
      <SiOpenaigym className="h-10 w-10 text-secondary" />
      <h2 className="text-xl forn-extrabold text-secondary">Analytics Brewery</h2>
      <ThemeToggle />
    </div>
  );
}

export default SideBarHeader;
