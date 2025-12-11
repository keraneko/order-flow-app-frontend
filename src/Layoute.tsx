import {NavLink,Outlet} from 'react-router'
import {Button} from '@/components/ui/button.tsx'

const Layout = () => {

    return(<>

    <nav className="flex gap-4 p-4 list-none ">
        <li><NavLink to="/"><Button  variant="outline" >Home</Button></NavLink></li>
        <li><NavLink to="/carts"><Button variant="secondary" >Carts</Button></NavLink></li>
        <li><NavLink to="/cartlist"><Button variant="secondary" >Cartlist</Button></NavLink></li>
    </nav>
    <Outlet />
    フッター
    </>)

}

export default Layout