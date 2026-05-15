import { getUser } from "../actions/authentication";
import { getUserProfile } from "../actions/profiles";
import { createClient } from "../utils/supabase/server";
import NavBar from "./Navbar";
import NavbarMobile from "./NavbarMobile";

const NavbarServer = async () => {
    const { data, error } = await getUser()

    const { data: profile, error: profileError } = await getUserProfile(data.user?.id ?? "")


    return <>
        <div className="2xl:block hidden"><NavBar initialUser={profile} /></div>
        <div className="2xl:hidden block"><NavbarMobile initialUser={profile} /></div>
    </>;
}

export default NavbarServer