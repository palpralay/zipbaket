import React from "react";
import { assets } from "../assets/assets";

const AddAddress = () => {
  const [address, setAddress] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handelchange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandel = async (e) => {
    e.preventDefault();
    console.log("Address submitted:", address);
    // Add your submission logic here
  };

  const InputField = ({ type, placeholder, name, handelchange, address }) => (
    <input
      className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handelchange}
      value={address[name]}
      required
    />
  );

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl text-gray-500 md:text-3xl">
        Add Shipping <span className="text-primary font-semibold">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form className="space-y-3 mt-6 text-sm" onSubmit={onSubmitHandel}>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handelchange={handelchange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handelchange={handelchange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>

            <InputField
              handelchange={handelchange}
              address={address}
              name="email"
              type="email"
              placeholder="Email Address"
            />
            <InputField
              handelchange={handelchange}
              address={address}
              name="street"
              type="text"
              placeholder="Street Address"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handelchange={handelchange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handelchange={handelchange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handelchange={handelchange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
              <InputField
                handelchange={handelchange}
                address={address}
                name="zipCode"
                type="text"
                placeholder="Zip Code"
              />
            </div>
            <InputField
              handelchange={handelchange}
              address={address}
              name="phone"
              type="tel"
              placeholder="Phone Number"
            />
            <button
              type="submit"
              className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium rounded-lg hover:bg-primary-dull transition"
            >
              Save Address
            </button>
          </form>
        </div>
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
