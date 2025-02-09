import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase/config";
import { collection, doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCloudUploadAlt } from "react-icons/fa";

function Register() {
  const fullName = useRef();
  const email = useRef();
  const password = useRef();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // ✅ Store uploaded image URL
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  // ✅ Function to handle Image Upload from Cloudinary
  const uploadImage = () => {
    let myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dkzm5hoxm",
        uploadPreset: "exper-hackathon",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          setImageUrl(result.info.secure_url); // ✅ Save image URL in state
        }
      }
    );
    myWidget.open();
  };

  const register = async (e) => {
    e.preventDefault();
    const passwordValue = password.current.value;
    const emailValue = email.current.value;

    if (passwordValue !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
      const user = userCredential.user;
      toast.success("User registered successfully!");

      // ✅ Store user details + uploaded image URL in the "profile" collection in Firestore
      await setDoc(doc(db, "profile", user.uid), {
        name: fullName.current.value,
        email: email.current.value,
        uid: user.uid,
        profileImage: imageUrl || "", // Save image URL or keep it empty if not uploaded
      });

      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      const errorMessages = {
        "auth/email-already-in-use": "Email is already in use. Please use a different email.",
        "auth/invalid-email": "Invalid email format. Please check your email.",
        "auth/weak-password": "Password is too weak. Please choose a stronger password.",
      };
      setError(errorMessages[error.code] || "Error registering user. Please try again.");
      toast.error(errorMessages[error.code] || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="card w-96 bg-base-100 shadow-xl mt-10">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <form onSubmit={register}>
            <div className="form-control w-full max-w-xs">
              <label className="label"><span className="label-text">Full Name</span></label>
              <input type="text" placeholder="Enter your full name" className="input input-bordered w-full max-w-xs" ref={fullName} required />
            </div>
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" placeholder="Enter your email" ref={email} className="input input-bordered w-full max-w-xs" required />
            </div>
            <div className="form-control w-full max-w-xs mt-4 relative">
              <label className="label"><span className="label-text">Password</span></label>
              <input type={passwordVisible ? "text" : "password"} placeholder="Enter your password" className="input input-bordered w-full max-w-xs pr-10" ref={password} required />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <div className="form-control w-full max-w-xs mt-4 relative">
              <label className="label"><span className="label-text">Confirm Password</span></label>
              <input type={confirmPasswordVisible ? "text" : "password"} placeholder="Confirm your password" className="input input-bordered w-full max-w-xs pr-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                {confirmPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {/* ✅ Image Upload Field */}
            <div className="mt-4 flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <FaCloudUploadAlt className="text-2xl text-gray-500 cursor-pointer" onClick={uploadImage} />
                <button type="button" className="btn btn-outline" onClick={uploadImage}>
                  Upload Profile Image
                </button>
              </div>
              {/* ✅ Show preview of uploaded image */}
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Uploaded Profile" className="w-24 h-24 object-cover rounded-full border shadow-md" />
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button type="submit" className="btn btn-primary w-full mt-6" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <div className="mt-4 text-center">
              <h1>Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login Here</Link></h1>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
