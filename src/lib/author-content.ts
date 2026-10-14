export const bookPurchaseUrl =
  "https://olympiapublishers.com/book/how-to-lose-weight-and-keep-it-off";
export const publicEmail = "calderjeanie@gmail.com";
export const interests = [
  "General enquiry",
  "Book enquiry",
  "The ten-week course",
  "Teaching the ten-week course",
  "Teacher of teachers programme",
] as const;
export type Interest = (typeof interests)[number];
export const programmes = [
  {
    slug: "ten-week-course",
    name: "The ten-week course",
    audience: "For your own relationship with food",
    body: "Ten weeks exploring food, self acceptance and managing weight with enjoyment.",
    fee: "$1,000",
    cta: "Enquire about the course",
    theme: "course",
    interest: "The ten-week course",
  },
  {
    slug: "teacher-training",
    name: "Teaching the ten-week course",
    audience: "For people interested in teaching",
    body: "Learn to teach Jeanie’s course, particularly if you already work in the food and weight industry.",
    fee: "$10,000",
    cta: "Ask about teacher training",
    theme: "teaching",
    interest: "Teaching the ten-week course",
  },
  {
    slug: "teacher-of-teachers",
    name: "Teacher of teachers programme",
    audience: "For people interested in training teachers",
    body: "Prepare others to teach Jeanie’s approach. Discuss your experience and suitability with her.",
    fee: "$100,000",
    cta: "Discuss the programme",
    theme: "mentoring",
    interest: "Teacher of teachers programme",
  },
] as const;
export type Enquiry = { name: string; email: string; interest: Interest; message: string };
export function composeEnquiry(data: Enquiry) {
  const subject = `${data.interest} — ${data.name.trim()}`;
  const body = `Hello Jeanie,\n\n${data.message.trim()}\n\nName: ${data.name.trim()}\nEmail: ${data.email.trim()}\nInterest: ${data.interest}`;
  return {
    subject,
    body,
    text: `To: ${publicEmail}\nSubject: ${subject}\n\n${body}`,
    url: `mailto:${publicEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
