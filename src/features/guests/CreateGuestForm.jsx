import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";

import { useForm } from "react-hook-form";
import React, { useContext } from "react";
import FormRow from "../../ui/FormRow";
import CustomSelect from "../../ui/CustomSelect";
import { useCountryFlags } from "../../hooks/useCountryFlags";
import SpinnerMini from "../../ui/SpinnerMini";
import { ModalContext } from "../../ui/Modal";

function CreateGuestForm({ bookingToEdit = {}, handleBack }) {
  const { countries, isLoading } = useCountryFlags();
  const { close: onCloseModal } = useContext(ModalContext);

  // const [radioValue, setRadioValue] = useState();

  // const isWorking = isCreating || isEditing;

  // const { id: editID, ...editValue } = bookingToEdit;
  // const isEditSession = Boolean(editID);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    // defaultValues: isEditSession ? editValue : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    // if (isEditSession)
  }

  function onError(errors) {
    console.error(errors);
  }

  const selectOptions = [];
  for (const country in countries) {
    selectOptions.push({ value: country, label: countries[country] });
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      $type={onCloseModal ? "modal" : "regular"}
    >
      <h2>New Guest</h2>

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
        {isLoading ? (
          <SpinnerMini />
        ) : (
          <CustomSelect
            id="nationality"
            options={selectOptions}
            {...register("nationality", {
              required: "This field is required",
            })}
          />
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

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          onClick={() => {
            onCloseModal();
          }}
          $variation="secondary"
          $type="reset"
        >
          Cancel
        </Button>
        <Button onClick={handleBack}>Back</Button>
        <Button>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestForm;
