
import { getUser } from "@/app/actions/authentication/get/getUser";
import { getUserProfile } from "@/app/actions/profiles/get/getUserProfile";
import NavBar from "./Navbar";
import NavbarMobile from "./NavbarMobile";

const NavbarServer = async () => {
    const { data } = await getUser()
    const userId = data?.user?.id

    const profile = userId ? (await getUserProfile(userId)).data : null

    return <>
        <div className="xl:block hidden"><NavBar initialUser={profile} /></div>
        <div className="xl:hidden block"><NavbarMobile initialUser={profile} /></div>
    </>;
}

export default NavbarServer