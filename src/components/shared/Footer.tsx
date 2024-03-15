import Link from "next/link";

const Footer = () => {
    return (
        <div className="w-full h-max lg:h-16 flex flex-col gap-5 lg:flex-row justify-between items-start lg:items-center px-5 py-5 lg:py-0 md:px-10">
            <p className="text-xs text-gray-500 font-semibold" >© 2024 Aadarshguru All rights reserved.</p>
            <div className="flex gap-5 flex-col lg:flex-row items-start lg:items-center gap-x-5">
                <Link className="text-xs text-gray-500 font-semibold hover:underline" href={'#'} >About</Link>
                <Link className="text-xs text-gray-500 font-semibold hover:underline" href={'#'} >Contact</Link>
                <Link className="text-xs text-gray-500 font-semibold hover:underline" href={'#'} >Terms of Service</Link>
                <Link className="text-xs text-gray-500 font-semibold hover:underline" href={'#'} >Privacy Policy</Link>
            </div>
        </div>
    );
};

export default Footer;