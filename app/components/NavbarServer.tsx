import { getUser } from "../actions/authentication";
import { createClient } from "../utils/supabase/server";
import NavBar from "./Navbar";
import NavbarMobile from "./NavbarMobile";

const NavbarServer = async () => {
    const { data: { user } } = await getUser()

    return <>
        <div className="2xl:block hidden"><NavBar initialUser={user} /></div>
        <div className="2xl:hidden block"><NavbarMobile initialUser={user} /></div>
    </>;
}

export default NavbarServer