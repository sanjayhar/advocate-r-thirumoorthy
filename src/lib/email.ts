import emailjs from "@emailjs/browser";

export async function sendConsultationEmail(data: {
  name: string;
  phone: string;
  email: string;
  caseType: string;
  message: string;
}) {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      name: data.name,
      phone: data.phone,
      email: data.email,
      caseType: data.caseType,
      message: data.message,
      time: new Date().toLocaleString(),
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
}