import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  // 1.
  const numBookings = bookings?.length;

  // 2.
  const sales = bookings?.reduce((acc, cur) => acc + cur.totalPrice, 0);

  // 3.
  const checkIns = confirmedStays?.length;

  // 3.
  const occupation =
    confirmedStays?.reduce((acc, cur) => acc + cur.numNights, 0) /
    (numDays * cabinCount);

  return (
    <>
      <Stat
        icon={<HiOutlineBriefcase />}
        color="blue"
        title="Bookings"
        value={numBookings}
      />
      <Stat
        icon={<HiOutlineBanknotes />}
        color="green"
        title="Sales"
        value={formatCurrency(sales)}
      />
      <Stat
        icon={<HiOutlineCalendarDays />}
        color="indigo"
        title="Check ins"
        value={checkIns}
      />
      <Stat
        icon={<HiOutlineChartBar />}
        color="yellow"
        title="Occupancy rate"
        value={Math.round(occupation * 100) + "%"}
      />
    </>
  );
}

export default Stats;
