import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/assets/logo.svg";
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import Logout from "../../public/assets/logout.svg";
import { dark } from "@clerk/themes";

const Topbar = () => {
  const isUserLoggedIn = true;
  return (
    <nav className="topbar">
      {" "}
      <Link href="/" className="flex items-center gap-4">
        <Image src={Logo} alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>
      <div className="flex flex-1" />
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer gap-4 p-4">
                <Image src={Logout} alt="logout" width={24} height={24} />
                {/*this line does not appear in the ui at all  */}
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4" ,
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Topbar;
