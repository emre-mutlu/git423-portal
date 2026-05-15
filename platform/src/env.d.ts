/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    student?: {
      id: string;
      student_number: string;
      name_masked: string;
      branch: string;
    };
  }
}
