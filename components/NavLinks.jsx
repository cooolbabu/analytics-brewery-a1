import Link from "next/link";

const links = [
  { id: 1, name: "Data brewers page", path: "/new_brews" },
  { id: 2, name: "My Brews", path: "/my_brews" },
  { id: 3, name: "Social Brews", path: "/abprompt-cards" },
  { id: 4, name: "Brew Crafters", path: "/brew_crafters" },
  { id: 5, name: "--  Brew Crafters Test", path: "/test/componentPlayground1" },
  { id: 6, name: "Test Form Component", path: "/TestFormComponent" },
  { id: 7, name: "Component Playground", path: "/test/componentPlayground3" },
  { id: 8, name: "Profile", path: "/profile" },
];

function NavLinks() {
  return (
    <ul className="menu text-base-content">
      {links.map((link) => (
        <li key={link.id}>
          <Link href={link.path} className="capitalize mb-2">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NavLinks;
