import { createClient } from "../utils/supabase/server";
import NavBar from "./Navbar";
import NavbarMobile from "./NavbarMobile";

const NavbarServer = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return <>
        <div className="xl:block hidden"><NavBar initialUser={user} /></div>
        <div className="xl:hidden block"><NavbarMobile initialUser={user} /></div>
    </>;
}

export default NavbarServer