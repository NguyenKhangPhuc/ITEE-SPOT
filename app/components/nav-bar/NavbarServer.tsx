
import { getUser } from "@/app/actions/authentication/get/getUser";
import { getUserProfile } from "@/app/actions/profiles";
import NavBar from "./Navbar";
import NavbarMobile from "./NavbarMobile";

const NavbarServer = async () => {
    const { data, error } = await getUser()

    const { data: profile, error: profileError } = await getUserProfile(data.user?.id ?? "")


    return <>
        <div className="xl:block hidden"><NavBar initialUser={profile} /></div>
        <div className="xl:hidden block"><NavbarMobile initialUser={profile} /></div>
    </>;
}

export default NavbarServer