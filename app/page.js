import Image from "next/image";
import Link from "next/link";

import analystBreweryImage from "../assets/AnalystBewery.png";

export default function HomePage() {
  return (
    <div className="flex flex-row max-w-md text-center m-24 pl-24 gap-12">
      <div className="flex flex-col items-center justify-center min-w-96 gap-4">
        <h1 className="text-4xl font-bold ">Welcome to Analytics Brewery</h1>
        <h2 className="text-2xl font-bold">Forget coding. Just type it in ...</h2>
        <Link href="/new_brews" className="btn btn-secondary  ">
          Let&apos;s mix some data
        </Link>
        <div className="flex flex-col items-center justify-center min-w-96 gap-4 text-xs">
          <p>
            This is a portfolio app. It is not a real product. It is a demo of a data analytics tool. You can use either
            Google or LinkedIn account to gain access. You personal information is neither requested or saved. I reserve
            the right to block access anytime.
          </p>
        </div>
      </div>
      <Image src={analystBreweryImage} alt="Analytics Brewery" className="mb-6" />
    </div>
  );
}
