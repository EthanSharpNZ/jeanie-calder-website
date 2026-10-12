export const publicEmail = "calderjeanie@gmail.com";
export const interests = ["General enquiry", "Book enquiry", "The ten-week course", "Teaching the ten-week course", "Teacher of teachers programme"] as const;
export type Interest = typeof interests[number];
export const programmes = [
  { slug: "ten-week-course", name: "The ten-week course", body: "Explore your relationship with food and yourself through Jeanie’s ten-week course. Enquire for details and how to take part.", fee: "$1,000", cta: "Enquire about the course", theme: "course", interest: "The ten-week course" },
  { slug: "teacher-training", name: "Teaching the ten-week course", body: "Interested in teaching Jeanie’s ten-week course? Enquire about the programme and what it includes.", fee: "$10,000", cta: "Ask about teacher training", theme: "teaching", interest: "Teaching the ten-week course" },
  { slug: "teacher-of-teachers", name: "Teacher of teachers programme", body: "Explore the opportunity to teach future programme teachers. Contact Jeanie to discuss your background and the programme.", fee: "$100,000", cta: "Discuss the programme", theme: "mentoring", interest: "Teacher of teachers programme" },
] as const;
export type Enquiry = { name: string; email: string; interest: Interest; message: string };
export function composeEnquiry(data: Enquiry) {
  const subject = `${data.interest} — ${data.name.trim()}`;
  const body = `Hello Jeanie,\n\n${data.message.trim()}\n\nName: ${data.name.trim()}\nEmail: ${data.email.trim()}\nInterest: ${data.interest}`;
  return { subject, body, text: `To: ${publicEmail}\nSubject: ${subject}\n\n${body}`, url: `mailto:${publicEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}