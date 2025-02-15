import React, { createContext, useState } from "react";

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ticket: {
      type: "",
    },
    quantity: 1,
    specialRequest: "",
    images: "",
  });

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};