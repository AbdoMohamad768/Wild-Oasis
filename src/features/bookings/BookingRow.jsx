import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Modal from "./../../ui/Modal";
import ConfirmDelete from "./../../ui/ConfirmDelete";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Menus from "../../ui/Menus";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiPencil,
  HiSquare2Stack,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import CreateBookingForm from "./CreateBookingForm";
import { useCreateBooking } from "./useCreateBooking";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({ booking }) {
  const {
    id: bookingID,
    // created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    hasBreakfast,
    observations,
    extrasPrice,
    cabinPrice,
    totalPrice,
    isPaid,
    status,
    guests: { id: guestID, email, fullName: guestName },
    cabins: { id: cabinID, name: cabinName },
  } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();
  const { createBooking, isCreatingBooking } = useCreateBooking();

  function handleDuplicate() {
    createBooking({
      startDate,
      endDate,
      numNights,
      hasBreakfast,
      numGuests,
      observations,
      extrasPrice,
      totalPrice,
      cabinPrice,
      isPaid,
      status,
      guestID,
      cabinID,
    });
  }

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag $type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingID} />
          <Menus.List id={bookingID}>
            <Menus.Button
              onClick={handleDuplicate}
              disabled={isCreatingBooking}
              icon={<HiSquare2Stack />}
            >
              Duplicate
            </Menus.Button>

            <Modal.Open opens="booking-edit">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>

            <Menus.Button
              onClick={() => navigate(`/bookings/${bookingID}`)}
              icon={<HiEye />}
            >
              See details
            </Menus.Button>

            {status === "unconfirmed" && (
              <Menus.Button
                onClick={() => navigate(`/checkin/${bookingID}`)}
                icon={<HiArrowDownOnSquare />}
              >
                Check in
              </Menus.Button>
            )}

            {status === "checked-out" && (
              <Menus.Button
                onClick={() => {
                  checkout(bookingID);
                }}
                disabled={isCheckingOut}
                icon={<HiArrowUpOnSquare />}
              >
                Check out
              </Menus.Button>
            )}

            {(status === "checked-out" || !isPaid) && (
              <Modal.Open opens="delete">
                <Menus.Button
                  onClick={() => {
                    deleteBooking(bookingID);
                  }}
                  icon={<HiTrash />}
                >
                  Delete booking
                </Menus.Button>
              </Modal.Open>
            )}
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="booking-edit">
          <CreateBookingForm bookingToEdit={booking} />
        </Modal.Window>

        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="booking"
            onConfirm={() => {
              deleteBooking(bookingID);
            }}
            disabled={isDeleting}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;
