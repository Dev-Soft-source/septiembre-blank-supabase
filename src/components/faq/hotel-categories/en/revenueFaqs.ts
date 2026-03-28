
import { FaqItem } from "../../hotel-types";

export const revenueFaqs: FaqItem[] = [
  {
    question: "How does this affect RevPAR?",
    answer: "It eliminates empty nights and boosts annual income, even if nightly rates are lower than peak short stays.\n\nLong durations and reduced turnover drive profit."
  },
  {
    question: "Will I need to lower rates significantly?",
    answer: "No. These are rooms currently unsold. Even slightly discounted rates turn losses into profit, especially when considering reduced rotation costs."
  },
  {
    question: "How does the booking commission work?",
    answer: "• 10% commission on net room price (pre-tax)\n• No commission on taxes\n• Example:\n Net: $1,000 → Commission: $100 → Guest pays: $1,200 → You keep $1,000 and pay $100 commission"
  },
  {
    question: "What about cancellations or no-shows?",
    answer: "Guests pay a 10% deposit when booking. Hotels typically keep 2–3% as compensation, and the rest is service commission. Risk is minimal."
  },
  {
    question: "So what happens if the guest doesn't show up?",
    answer: "The hotel keeps 2–3% of the total as a no-show indemnity. Since the room would have remained empty anyway, this generates partial revenue."
  },
  {
    question: "Can I implement dynamic pricing for long stays?",
    answer: "Yes. You can set price floors and ceilings, and the system automatically adjusts prices as availability drops — incentivizing early bookings."
  },
  {
    question: "Can I change prices at any time?",
    answer: "Yes. You have full control over rates, both fixed and dynamic, and can update them anytime."
  },
  {
    question: "Can I offer different rates based on length of stay?",
    answer: "Yes, and we recommend it. Offer lower rates for 16–32 days to increase occupancy, reduce churn, and maximize lifetime value."
  }
];
