"use client";

import React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Avatar = ({ children, ...props }: AvatarProps) => {
  return (
    <div {...props} className={`rounded-full overflow-hidden ${props.className || ""}`}>
      {children}
    </div>
  );
};

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = (props: AvatarImageProps) => {
  return <img {...props} className={`object-cover ${props.className || ""}`} />;
};

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarFallback = (props: AvatarFallbackProps) => {
  return (
    <div
      {...props}
      className={`flex items-center justify-center bg-gray-400 text-white ${props.className || ""}`}
    >
      {props.children}
    </div>
  );
};