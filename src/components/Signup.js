import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      college: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(5, "Password must be at least 5 characters").required("Password is required"),
      phone: Yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits").required("Phone number is required"),
      address: Yup.string().min(5, "Address must be at least 5 characters").required("Address is required"),
      college: Yup.string().min(5, "College name must be at least 5 characters").required("College is required"),
    }),
    onSubmit: async (values) => {
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        const json = await response.json();
        localStorage.setItem("token", json.authtoken);
        localStorage.setItem("userName", json.user.name);
        localStorage.setItem("userId", json.user._id);
        navigate("/");
        props.showAlert("Account Created Successfully", "success");
      } else if (response.status === 400) {
        props.showAlert("User with this phone already exists", "danger");
      } else {
        props.showAlert("Invalid Credentials, Try to change Email id or Phone Number to Create Account ", "danger");
      }
    },
  });

  return (
    <div className="container mt-3 white-text">
      <h2>Create account to use Pustakalaya</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label white-text">
            Name
          </label>
          <input
            type="text"
            className={`form-control custom-input ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
            id="name"
            name="name"
            aria-describedby="emailHelp"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback">{formik.errors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label white-text">
            Email address
          </label>
          <input
            type="email"
            className={`form-control custom-input ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            aria-describedby="emailHelp"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div id="emailHelp" className="form-text white-text">
            We'll never share your email with anyone else.
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="invalid-feedback">{formik.errors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label white-text">
            Password
          </label>
          <input
            type="password"
            className={`form-control custom-input ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            minLength={5}
            required
          />
          {formik.touched.password && formik.errors.password && (
            <div className="invalid-feedback">{formik.errors.password}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label white-text">
            Phone Number
          </label>
          <input
            type="number"
            className={`form-control custom-input ${formik.touched.phone && formik.errors.phone ? "is-invalid" : ""}`}
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            minLength={10}
            maxLength={10}
            required
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="invalid-feedback">{formik.errors.phone}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label white-text">
            Address
          </label>
          <input
            type="text"
            className={`form-control custom-input ${formik.touched.address && formik.errors.address ? "is-invalid" : ""}`}
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            minLength={5}
            required
          />
          {formik.touched.address && formik.errors.address && (
            <div className="invalid-feedback">{formik.errors.address}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="college" className="form-label white-text">
            College
          </label>
          <input
            type="text"
            className={`form-control custom-input ${formik.touched.college && formik.errors.college ? "is-invalid" : ""}`}
            id="college"
            name="college"
            value={formik.values.college}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            minLength={5}
            required
          />
          {formik.touched.college && formik.errors.college && (
            <div className="invalid-feedback">{formik.errors.college}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
