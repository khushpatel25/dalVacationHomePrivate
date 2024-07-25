import { signOut } from "aws-amplify/auth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import userStore from "@/lib/store/userStore";
import { Button } from "./ui/button";

const Navbar = () => {
  const { userRole, deleteUserRoleAndId } = userStore();

  const logout = async () => {
    try {
      const isSignOut = confirm("Are you sure you want to SignOut?");
      if (isSignOut) {
        await signOut();
        deleteUserRoleAndId();
        toast.success("SignOut Successful.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-16 w-full shrink-0 items-center px-4 md:px-6 bg-white border-b-2 border-gray-200">
      <Link
        to="/"
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-black text-black font-bold text-lg bg-light-blue-700"
      >
        d
      </Link>
      <span className="ml-2 text-black font-mono italic text-2xl font-bold">
        dalVacationHome
      </span>
      <div className="ml-auto flex gap-2">
        {userRole && userRole === "admin0" && (
          <>
          <Link to="/dashboard">
            <Button className="font-semibold">Dashboard</Button>
          </Link>
          <Link to="/cutomerconcerns">
            <Button className="font-semibold">Customer Concerns</Button>
          </Link>
        </>
        )}
        {!userRole ? (
          <>
            <Link to="/signin">
              <Button className="font-semibold ">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="font-semibold">Sign Up</Button>
            </Link>
          </>
        ) : (
          <Button onClick={logout} className="font-bold ">
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
