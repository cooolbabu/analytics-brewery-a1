import Link from "next/link";

const links = [
  { id: 1, name: "Data brewers page", path: "/new_brews" },
  { id: 2, name: "My Brews", path: "/my_brews" },
  { id: 2, name: "Social Brews", path: "/abprompt-cards" },
  { id: 6, name: "Brew Crafters", path: "/brew_crafters" },
  { id: 3, name: "Test Form Component", path: "/TestFormComponent" },
  { id: 4, name: "Component Playground", path: "/test/componentPlayground3" },
  { id: 5, name: "Profile", path: "/profile" },
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
