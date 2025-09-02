import React, { useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { bindToast } from "../services/ApiService";

export default function ToastBinder() {
  const toast = useToast();

  useEffect(() => {
    bindToast((message, type) => {
      toast[type || "error"](message);
    });
  }, [toast]);

  return null; // Ce composant ne rend rien
}







