import Image from "next/image";
import Link from "next/link";

import analystBreweryImage from "../assets/AnalystBewery.png";

export default function HomePage() {
  return (
    <div>
      <Image
        src={analystBreweryImage}
        alt="Analytics Brewery"
        width={300}
        height={300}
      />
      <Link href="/new_brews" className="btn btn-secondary ">
        Let&apos;s brew some prompts
      </Link>
    </div>
  );
}
