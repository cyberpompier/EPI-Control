"use client";
import React from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const controles = [
  { id: "1", name: "Contrôle 1" },
  { id: "2", name: "Contrôle 2" },
];

const Controles = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des contrôles</h1>
      {controles.map((controle) => (
        <div key={controle.id} className="flex items-center justify-between p-2 border-b">
          <span>{controle.name}</span>
          <Button variant="outline" size="icon" asChild>
            <Link to={`/controles/${controle.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Controles;