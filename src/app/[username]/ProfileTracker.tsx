"use client";

import { useEffect } from "react";

type Props = {
  username: string;
};

export default function ProfileTracker({ username }: Props) {
  useEffect(() => {
    const storageKey = `profile-view:${username}:${new Date().toDateString()}`;
    const alreadySent = localStorage.getItem(storageKey);

    if (alreadySent) return;

    fetch(`/api/profile-view/${username}`, {
      method: "POST",
    }).finally(() => {
      localStorage.setItem(storageKey, "1");
    });
  }, [username]);

  return null;
}