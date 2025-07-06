import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] ">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Task<span className="text-pink-500">Board</span>
        </h1>
        <p className="text-gray-600 text-center text-lg ">
          Here you can manage your tasks efficiently.
        </p>
        <div className="flex gap-4 w-full">
          <Link to="/login" className="w-1/2">
            <Button className="w-full py-2 text-base font-semibold">
              Login
            </Button>
          </Link>
          <Link to="/register" className="w-1/2 ">
            <Button
              variant="outline"
              className="w-full py-2 text-base font-semibold"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
