import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useCabins } from "../cabins/useCabins";
import FormRow from "../../ui/FormRow";
// import CustomSelect from "../../ui/CustomSelect";
import styled from "styled-components";
import SpinnerMini from "../../ui/SpinnerMini";
import { useGuests } from "../guests/useGuests";
import { useCreateBooking } from "./useCreateBooking";
import { differenceInCalendarDays, format } from "date-fns";
import { useCountryFlags } from "../../hooks/useCountryFlags";
import { useCreateGuest } from "../guests/useCreateGuest";
import { useEditBooking } from "./useEditBooking";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.$type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);

  max-width: 233px;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;

  & input {
    /* -webkit-appearance: none;
    appearance: none; */
    display: none;
  }

  & input[type="checkbox"]:checked + div .after {
    transform: translate(30px, -50%);
    background-color: white;
  }

  & input[type="checkbox"]:checked + div .before {
    border-color: #0075ff;
    background-color: #0075ff;
  }

  & div {
    cursor: pointer;
    position: relative;

    & .before {
      width: 60px;
      height: 30px;
      border: 1px solid var(--color-grey-400);
      border-radius: 30px;
      transition: 0.3s;
    }

    &:hover .before {
      border-color: #0075ff;
    }

    & .after {
      /* content: "\f00c"; */
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
      background-color: var(--color-grey-400);
      border-radius: 100%;
      width: 20px;
      height: 20px;
      transition: 0.3s;
    }

    &:hover .after {
      border-color: #0075ff;
    }
  }
`;

const StyledRadio = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const RadioField = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
`;

function CreateBookingForm({ bookingToEdit = {}, onCloseModal }) {
  const { cabins, isLoading: isGettingCabins } = useCabins();
  const { guests, isLoading: isGettingGuests } = useGuests();
  const { countries, isLoading: isGettingFlags } = useCountryFlags();
  const { createBooking, isCreatingBooking } = useCreateBooking();
  const { createGuest, isCreatingGuest } = useCreateGuest();
  const { editBooking, isEditingBooking } = useEditBooking();

  const [newGuest, setNewGuest] = useState(false);

  const { id: editID, ...editValues } = bookingToEdit;
  const isEditSession = Boolean(editID);

  const valuesToEdit = {};
  if (isEditSession) {
    valuesToEdit.cabinID = editValues?.cabins?.id.toString();
    valuesToEdit.guestID = editValues?.guests?.id.toString();
    valuesToEdit.hasBreakfast = editValues?.hasBreakfast?.toString();
    valuesToEdit.isPaid = editValues?.isPaid?.toString();
    valuesToEdit.numGuests = editValues?.numGuests?.toString();
    valuesToEdit.observations = editValues?.observations;
    valuesToEdit.startDate = format(
      new Date(editValues?.startDate || "1950/1/1"),
      "yyyy-MM-dd"
    );
    valuesToEdit.endDate = format(
      new Date(editValues?.endDate || "1950/1/1"),
      "yyyy-MM-dd"
    );
  }

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? valuesToEdit : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    const newBookingDetails = {
      numGuests: +data.numGuests,
      hasBreakfast: data.hasBreakfast === "true",
      isPaid: data.status === "checked-in",
      cabinID: +data.cabinID,
      startDate: data.startDate,
      endDate: data.endDate,
      numNights: differenceInCalendarDays(data.endDate, data.startDate),
      observations: data.observations,
      status: data.status,
    };

    const newGuestDetails = {};
    if (newGuest) {
      newGuestDetails.fullName = data.fullName;
      newGuestDetails.email = data.email;
      newGuestDetails.nationality = countries[data.nationality];
      newGuestDetails.nationalID = data.nationalID;
      newGuestDetails.countryFlag = `https://flagcdn.com/${data.nationality}.svg`;
    }
    if (!newGuest) newBookingDetails.guestID = +data.guestID;

    if (newGuest)
      createGuest(newGuestDetails, {
        onSuccess: (newGuestData) => {
          newBookingDetails.guestID = newGuestData.id;
        },
      });

    if (!isEditSession)
      createBooking(newBookingDetails, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });

    if (isEditSession)
      editBooking(
        { bookingToEdit: newBookingDetails, id: editID },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors) {
    // console.error(errors);
  }

  const cabinsOptions = cabins?.map((cabin) => {
    return { value: cabin.id, label: cabin.name };
  });

  const guestsOptions = guests?.map((guest) => {
    return { value: guest.id, label: guest.fullName };
  });

  const statusOptions = [
    { value: "unconfirmed", label: "Unconfirmed" },
    { value: "checked-in", label: "Checked In" },
    // { value: "checked-out", label: "Checked Out" },
  ];

  const flagsOptions = [];
  for (const country in countries) {
    flagsOptions.push({ value: country, label: countries[country] });
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      $type={onCloseModal ? "modal" : "regular"}
    >
      <h2>New Booking</h2>

      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          {...register("startDate", {
            required: "This field is required",
            validate: (value) =>
              differenceInCalendarDays(value, getValues().endDate) < 0 ||
              "Start date must be sooner",
          })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          {...register("endDate", {
            required: "This field is required",
            validate: (value) =>
              differenceInCalendarDays(getValues().startDate, value) < 0 ||
              "End date must be later",
          })}
        />
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea id="observations" {...register("observations")} />
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinID?.message}>
        {isGettingCabins ? (
          <SpinnerMini />
        ) : (
          <StyledSelect
            id="cabinID"
            {...register("cabinID", {
              validate: (value) => {
                const selectedCabin = cabins.find(
                  (cabin) => cabin.id === +value
                );

                return (
                  selectedCabin.maxCapacity > getValues().numGuests ||
                  "Number of guests are more than cabin's max capacity"
                );
              },
            })}
          >
            {cabinsOptions.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </StyledSelect>
        )}
      </FormRow>

      <FormRow label="Guest" error={errors?.guestID?.message}>
        {isGettingGuests ? (
          <SpinnerMini />
        ) : (
          <>
            {/* <CustomSelect
              id="guestID"
              options={guestsOptions}
              disabled={newGuest}
              {...register("guestID")}
            /> */}
            <StyledSelect
              disabled={newGuest}
              id="guestID"
              {...register("guestID")}
            >
              {guestsOptions.map((option) => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </StyledSelect>
            <CheckboxContainer>
              <span>New Guest</span>
              <input
                type="checkbox"
                id="newGuest"
                checked={newGuest}
                onChange={() => setNewGuest((pre) => !pre)}
              />
              <div>
                <div className="before"></div>
                <div className="after"></div>
              </div>
            </CheckboxContainer>
          </>
        )}
      </FormRow>

      <FormRow label="Status" error={errors?.status?.message}>
        {isGettingCabins ? (
          <SpinnerMini />
        ) : (
          <>
            {/* <CustomSelect
            id="status"
            options={statusOptions}
            {...register("status", {
              required: "This field is required",
            })}
          /> */}
            <StyledSelect id="status" {...register("status")}>
              {statusOptions.map((option) => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </StyledSelect>
          </>
        )}
      </FormRow>

      <FormRow label="Guests Number" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          {...register("numGuests", {
            required: "This field is required",
            validate: (value) => {
              const selectedCabin = cabins.find(
                (cabin) => cabin.id === +getValues().cabinID
              );

              return (
                value < selectedCabin.maxCapacity ||
                "Number of guests are more than cabin's max capacity"
              );
            },
          })}
        />
      </FormRow>

      {/* <FormRow label="Paid" putLabel={false} error={errors?.isPaid?.message}>
        <StyledRadio>
          <RadioField>
            <RadioInput
              type="radio"
              value="true"
              checked={getValues().status === "checked-in"}
              id="paidRadYes"
              {...register("isPaid")}
            />
            <label htmlFor="paidRadYes">Yes</label>
          </RadioField>
          <RadioField>
            <RadioInput
              type="radio"
              value="false"
              id="paidRadNo"
              checked={getValues().status === "unconfirmed"}
              {...register("isPaid")}
            />
            <label htmlFor="paidRadNo">No</label>
          </RadioField>
        </StyledRadio>
      </FormRow> */}

      <FormRow
        label="Breakfast"
        putLabel={false}
        error={errors?.hasBreakfast?.message}
      >
        <StyledRadio>
          <RadioField>
            <RadioInput
              type="radio"
              value="true"
              id="breakfastRadYes"
              {...register("hasBreakfast", {
                required: "This field is required",
              })}
            />
            <label htmlFor="paidRadYes">Yes</label>
          </RadioField>
          <RadioField>
            <RadioInput
              type="radio"
              value="false"
              id="breakfastRadNo"
              {...register("hasBreakfast", {
                required: "This field is required",
              })}
            />
            <label htmlFor="paidRadNo">No</label>
          </RadioField>
        </StyledRadio>
      </FormRow>

      {newGuest && (
        <>
          <h2
            style={{
              paddingTop: "20px",
              marginTop: "20px",
              borderTop: "1px solid #fff",
            }}
          >
            New Guest
          </h2>

          <FormRow label="Full Name" error={errors?.fullName?.message}>
            <Input
              type="text"
              id="fullName"
              {...register("fullName", {
                required: "This field is required",
              })}
            />
          </FormRow>

          <FormRow label="Email" error={errors?.email?.message}>
            <Input
              type="email"
              id="email"
              {...register("email", {
                required: "This field is required",
              })}
            />
          </FormRow>

          <FormRow label="Nationality" error={errors?.nationality?.message}>
            {isGettingFlags ? (
              <SpinnerMini />
            ) : (
              <>
                <StyledSelect id="nationality" {...register("nationality")}>
                  {flagsOptions.map((option) => {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </StyledSelect>
              </>
            )}
          </FormRow>

          <FormRow label="nationalID" error={errors?.nationalID?.message}>
            <Input
              type="number"
              id="nationalID"
              {...register("nationalID", {
                required: "This field is required",
              })}
            />
          </FormRow>
        </>
      )}

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          onClick={() => onCloseModal?.()}
          $variation="secondary"
          $type="reset"
          disabled={isCreatingBooking || isCreatingGuest}
        >
          Cancel
        </Button>
        <Button disabled={isCreatingBooking || isCreatingGuest}>
          {!isEditSession && "Create"}
          {(isCreatingBooking || isCreatingGuest) && "Creating..."}
          {isEditSession && !newGuest && "Edit"}
          {isEditingBooking && "Editing..."}
          {isEditSession && newGuest && "Creat Guest & Edit"}
          {isEditSession && isCreatingGuest && "Creating Guest & Editing..."}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
