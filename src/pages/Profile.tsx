"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar";
import { useSession } from "@/components/auth/SessionProvider";
import { supabase } from "@/lib/supabase";

interface ProfileData {
  avatar?: string;
  nom?: string;
  prenom?: string;
}

const getInitials = (nom?: string, prenom?: string) => {
  const firstInitial = nom ? nom.charAt(0) : "";
  const secondInitial = prenom ? prenom.charAt(0) : "";
  return `${firstInitial}${secondInitial}`.toUpperCase();
};

const Profile: React.FC = () => {
  const { user, loading } = useSession();
  const [profileData, setProfileData] = useState<ProfileData>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!error && data) {
          setProfileData({
            avatar: data.avatar,
            nom: data.nom,
            prenom: data.prenom,
          });
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="p-4">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Avatar>
        <AvatarImage src={profileData.avatar || undefined} />
        <AvatarFallback className="text-2xl">
          {getInitials(profileData.nom, profileData.prenom)}
        </AvatarFallback>
      </Avatar>
      <div className="mt-4">
        <h2 className="text-xl font-bold">
          {profileData.prenom || "Prénom"} {profileData.nom || "Nom"}
        </h2>
      </div>
    </div>
  );
};

export default Profile;