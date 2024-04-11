import Image from "next/image";
import Link from "next/link";

import analystBreweryImage from "../assets/AnalystBewery.png";

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto text-center m-8">
      <Image src={analystBreweryImage} alt="Analytics Brewery" className="mb-6" />
      <Link href="/new_brews" className="btn btn-secondary  ">
        Let&apos;s mix some data
      </Link>
    </div>
  );
}
