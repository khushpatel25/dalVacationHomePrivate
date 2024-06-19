import { Link } from 'react-router-dom'

import { Button } from './ui/button'

const Navbar = () => {
    return (
        <div className="flex h-16 w-full shrink-0 items-center px-4 md:px-6 bg-green-500">
            <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white font-bold text-lg bg-light-blue-700">
                d
            </Link>
            <span className="ml-2 text-white font-mono italic text-2xl font-bold">dalVacationHome</span>
            <div className="ml-auto flex gap-2">
                <Link to="/signin">
                    <Button className="bg-slate-50 text-black font-bold">Sign In</Button>
                </Link>
                <Link to='/signup'>
                    <Button className="bg-slate-50 text-black font-bold">Sign Up</Button>
                </Link>
            </div>
        </div>
    )
}

export default Navbar