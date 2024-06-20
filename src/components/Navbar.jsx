import { Link } from 'react-router-dom'
import { signOut } from 'aws-amplify/auth';
import toast from 'react-hot-toast';

import { Button } from './ui/button'
import userStore from '@/lib/store/userStore';

const Navbar = () => {

    const { userRole, deleteUserRoleAndId } = userStore();

    const logout = async () => {
        try {
            const isSignOut = confirm("Are you sure you want to SignOut?");
            if (isSignOut) {
                await signOut();
                deleteUserRoleAndId();
                toast.success("SignOut Successful.")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex h-16 w-full shrink-0 items-center px-4 md:px-6 bg-slate-300">
            <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-black font-bold text-lg bg-light-blue-700">
                d
            </Link>
            <span className="ml-2 text-black font-mono italic text-2xl font-bold">dalVacationHome</span>
            <div className="ml-auto flex gap-2">
                {!userRole ?
                    <>
                        <Link to="/signin">
                        <Button  className="font-bold bg-blue-500 hover:bg-blue-600" >Sign In</Button>
                        </Link>
                        <Link to='/signup'>
                        <Button  className="font-bold bg-blue-500 hover:bg-blue-600" >Sign Up</Button>
                        </Link>
                    </>
                    : <Button onClick={logout} className="font-bold bg-blue-500 hover:bg-blue-600" >
                        Sign Out
                    </Button>
                }
            </div>
        </div>
    )
}

export default Navbar