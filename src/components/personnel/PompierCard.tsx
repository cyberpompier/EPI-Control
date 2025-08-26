"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pompier } from "@/types/personnel";
import { Link } from "react-router-dom";

interface PompierCardProps {
  pompier: Pompier;
}

const PompierCard = ({ pompier }: PompierCardProps) => {
  return (
    <Link to={`/personnel/${pompier.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={pompier.photo} alt={`${pompier.prenom} ${pompier.nom}`} />
              <AvatarFallback>
                {pompier.prenom.charAt(0)}
                {pompier.nom.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{pompier.prenom} {pompier.nom}</h3>
              <p className="text-sm text-gray-500">{pompier.grade}</p>
              <p className="text-xs text-gray-400">Matricule: {pompier.matricule}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PompierCard;