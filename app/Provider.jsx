"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/services/supabase";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({ children }) {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    let { data: Users, error } = await supabase
      .from("Users")
      .select("*")
      .eq("email", user.primaryEmailAddress.emailAddress);

    if (!Users || Users.length === 0) {
      const { data, error } = await supabase
        .from("Users")
        .insert([
          {
            name: user?.fullName,
            email: user?.primaryEmailAddress.emailAddress,
          },
        ])
        .select();
      setUserDetails(data[0]);
    }
    setUserDetails(Users[0]);
  };
  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      <div className="w-full">{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;
