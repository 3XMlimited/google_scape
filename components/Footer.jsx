import React from "react";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="fixed bottom-0 text-white-800 flex justify-between w-full gap-y-10 border-t border-black-400 bg-black-100  px-20 py-2 max-md:flex-col">
      <p>Copyright © 2023 | All rights reserved </p>
      <div className="flex gap-x-9">
        <Link href="/terms-of-use">Terms & Conditions</Link>
        <Link href="/terms-of-use">Privacy Policy</Link>
      </div>
    </footer>
  );
};
export default Footer;
