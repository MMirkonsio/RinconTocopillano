import { useState, useEffect } from 'react';

export const login = (user) => {
  if (user.id && user.nombre_usuario) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    console.error("El objeto de usuario no tiene los campos necesarios:", user);
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    if (user && user.id && user.nombre_usuario) {
      return user;
    }
  }
  return null;
};

export const useAuth = () => {
  const [user, setUser] = useState(getUser() || null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const updateUser = () => {
    setUser(getUser());
  };

  return { user, updateUser };
};
