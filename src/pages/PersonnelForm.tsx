"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  matricule: z.string().min(1, {
    message: "Le matricule est requis.",
  }),
  grade: z.string().min(1, {
    message: "Le grade est requis.",
  }),
  caserne: z.string().min(1, {
    message: "La caserne est requise.",
  }),
});

const casernes = [
  "Caserne A",
  "Caserne B",
  "Caserne C",
  "Caserne D",
  "Caserne E"
];

export default function PersonnelForm() {
  const { toast } = useToast();
  const [caserneSuggestions, setCaserneSuggestions] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      matricule: "",
      grade: "",
      caserne: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Personnel ajouté",
      description: `Nouveau membre: ${values.prenom} ${values.nom}`,
    });
    form.reset();
  }

  const handleCaserneChange = (value: string) => {
    form.setValue("caserne", value);
    if (value.length > 0) {
      const filtered = casernes.filter(caserne => 
        caserne.toLowerCase().includes(value.toLowerCase())
      );
      setCaserneSuggestions(filtered);
    } else {
      setCaserneSuggestions([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Ajouter un nouveau personnel</CardTitle>
            <CardDescription>
              Remplissez les informations du nouveau membre du personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="prenom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jean.dupont@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="matricule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matricule</FormLabel>
                        <FormControl>
                          <Input placeholder="MAT-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <Input placeholder="Caporal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="caserne"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Caserne</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Entrez la caserne"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleCaserneChange(e.target.value);
                            }}
                          />
                          {caserneSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                              {caserneSuggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    form.setValue("caserne", suggestion);
                                    setCaserneSuggestions([]);
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Entrez une caserne existante ou une nouvelle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Ajouter le personnel
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}