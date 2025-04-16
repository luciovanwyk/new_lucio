// _actions/SupportForm.ts

export interface SupportFormData {
    name: string;
    email: string;
    title: string;
    message: string;
    userId?: string; // optional, if user is logged in
  }
  