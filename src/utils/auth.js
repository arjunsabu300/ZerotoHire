// src/utils/auth.js

export function getCandidateName() {
  return localStorage.getItem("candidateName") || "";
}

export function setCandidateName(name) {
  localStorage.setItem("candidateName", name);
}

export function isAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

export function setAdminLoggedIn(flag) {
  localStorage.setItem("isAdmin", flag ? "true" : "false");
}
