/**
 * PLACEHOLDER COPY — replace before launch.
 *
 * These are written to the right length and tone to size the carousel, but no
 * one has said them. Swap in real, attributed quotes with permission before
 * this page goes live; published testimonials that nobody gave are a legal
 * problem, not just an editorial one.
 */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  /** Home and locality — the detail that makes a quote credible. */
  detail: string;
  /** The layout they ended up with, tying back to the plan section. */
  layout: string;
  /** A filmed version of the story, if one was shot. */
  film?: string;
};

/**
 * The studio film — the loop that plays beside the written stories rather than
 * one owner's account. Remote (Cloudinary) on purpose: these are tens of
 * megabytes and have no business in the repo or the deploy.
 */
export const EPITOME_FILM =
  "https://res.cloudinary.com/fbel0u69/video/upload/v1787644674/epitome-video.webm";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We had rebuilt the same kitchen twice in nine years. The steel one has not moved an inch through two monsoons.",
    name: "Rajesh & Sunitha K.",
    detail: "3BHK · Gachibowli",
    layout: "L-Shape",
    film: "https://res.cloudinary.com/fbel0u69/video/upload/v1787644704/1.mp4",
  },
  {
    id: "t2",
    quote:
      "The designer came on a Saturday and the three plans were in my inbox by Sunday evening. That was the moment I stopped shopping around.",
    name: "Priya M.",
    detail: "2BHK · Kondapur",
    layout: "Parallel",
  },
  {
    id: "t3",
    quote:
      "Thirty days was not a sales line. They handed over on day twenty-eight and the site was cleaner than they found it.",
    name: "Arun V.",
    detail: "Villa · Kokapet",
    layout: "Island",
    film: "https://res.cloudinary.com/fbel0u69/video/upload/v1787644699/4.mp4",
  },
  {
    id: "t4",
    quote:
      "I wiped the shutter under the sink expecting the usual swelling at the edge. Nothing. It is sealed properly, all the way round.",
    name: "Fatima S.",
    detail: "3BHK · Banjara Hills",
    layout: "U-Shape",
  },
  {
    id: "t5",
    quote:
      "My mother cooks three meals a day on it. Six months of that and the finish still looks like the showroom sample.",
    name: "Karthik R.",
    detail: "2BHK · Miyapur",
    layout: "Parallel",
  },
  {
    id: "t6",
    quote:
      "What sold me was being able to stand in the showroom and put my hand on the actual finish instead of guessing from a catalogue.",
    name: "Deepika N.",
    detail: "4BHK · Jubilee Hills",
    layout: "Island",
    film: "https://res.cloudinary.com/fbel0u69/video/upload/v1787644719/3.mp4",
  },
  {
    id: "t7",
    quote:
      "The termite treatment on our old modular was an annual ritual. There is simply nothing in this one for them to eat.",
    name: "Srinivas P.",
    detail: "Villa · Shamirpet",
    layout: "L-Shape",
  },
  {
    id: "t8",
    quote:
      "Quoted price was the final price. No revised estimate halfway through, which is not what I have come to expect.",
    name: "Meera & Anand T.",
    detail: "3BHK · Manikonda",
    layout: "U-Shape",
  },
];
