import LeftNav from "@/components/LeftNav";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { logOut, currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading]);

  return !currentUser ? (
    <Loader />
  ) : (
    <div className="flex bg-c1 h-[100vh]">
      <div className="flex w-full shrink-0">
        <LeftNav />
        <div className="flex bg-c2 grow">
          <div>Sidebar</div>
          <div>Chat</div>
        </div>
      </div>
    </div>
  );
}
