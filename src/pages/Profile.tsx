"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar";

interface ProfileData {
  avatar?: string;
  nom?: string;
  prenom?: string;
}

interface ProfileProps {
  profile?: ProfileData;
}

function getInitials(nom?: string, prenom?: string) {
  const firstInitial = nom ? nom.charAt(0) : "";
  const secondInitial = prenom ? prenom.charAt(0) : "";
  return `${firstInitial}${secondInitial}`.toUpperCase();
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const currentProfile: ProfileData = profile || {};

  return (
    <div className="p-4">
      <Avatar>
        <AvatarImage src={currentProfile.avatar || undefined} />
        <AvatarFallback className="text-2xl">
          {getInitials(currentProfile.nom, currentProfile.prenom)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Profile;