import React from "react";
import Link from "next/link";
import Image from "next/image";
const Navbar = () => {
  return (
    <nav className="flex justify-center items-center fixed top-0 z-50 w-full border-b-2 border-black-200 py-7 text-white bg-black-100 font-poppins ">
      <div className="flex justify-between items-center mx-auto w-full max-w-screen-2xl px-6 xs:px-8 sm:px-16">
        {/* <Link href="/"> */}
        <Image src="/logo.png" width={55} height={40} />
        {/* </Link> */}

        <ul className="flex justify-center items-center gap-x-3 max-md:hidden md:gap-x-10">
          <li className="text-[16px] leading-[22px] tracking-[0.25%]  text-gradient_red  font-bold">
            <Link href="/">Dashboard</Link>
          </li>
          <li className="text-[16px] leading-[22px] tracking-[0.25%] !font-normal">
            <Link href="/emails">Email Collect</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
