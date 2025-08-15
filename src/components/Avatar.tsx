"use client";

import React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={`rounded-full overflow-hidden ${className || ""}`}>
      {children}
    </div>
  );
};

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage: React.FC<AvatarImageProps> = (props) => {
  return <img {...props} className={`object-cover ${props.className || ""}`} />;
};

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarFallback: React.FC<AvatarFallbackProps> = (props) => {
  return (
    <div {...props} className={`flex items-center justify-center bg-gray-400 text-white ${props.className || ""}`}>
      {props.children}
    </div>
  );
};