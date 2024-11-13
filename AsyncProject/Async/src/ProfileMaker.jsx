import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/card";
import { useNavigate } from "react-router-dom";
import Logo from "/assets/app-logo.svg";
import UserIcon from "/assets/user.svg";
import { db, storage, auth } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfileMaker() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [profileType, setProfileType] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [defaultColor, setDefaultColor] = useState(""); // Holds the randomized color
	const fileInputRef = useRef(null);

	// Set a random color only once when the component loads
	useEffect(() => {
		const colors = ["#FFD700", "#8A2BE2", "#DC143C", "#20B2AA"];
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		setDefaultColor(randomColor);
	}, []);

	const handleProfilePictureUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProfilePicture(file);
		}
	};

	const handleProfilePictureClick = () => {
		fileInputRef.current.click(); // Trigger file input when clicking on profile circle
	};

	const handleContinue = async () => {
		if (!profileType) {
			alert("Please select either Student or Professor.");
			return;
		}

		try {
			const userId = auth.currentUser?.uid;
			let profilePictureUrl = "";

			if (profilePicture) {
				const profilePicRef = ref(storage, `profilePictures/${userId}`);
				setUploading(true);
				await uploadBytes(profilePicRef, profilePicture);
				profilePictureUrl = await getDownloadURL(profilePicRef);
				setUploading(false);
			}

			const profileData = {
				name,
				role: profileType,
				profilePictureUrl: profilePictureUrl || null,
			};

			await setDoc(doc(db, "users", userId), profileData);

			navigate("/main");
		} catch (error) {
			console.error("Error creating profile:", error);
			alert("There was an error creating your profile. Please try again.");
		}
	};

	return (
		<>
			{/* Navigation Bar */}
			<nav className="p-4 bg-gray-900 flex justify-between items-center">
				<button onClick={() => navigate("/")} className="ml-4">
					<img src={Logo} alt="Logo" width="40" height="40" />
				</button>
			</nav>

			{/* Main Profile Maker Container */}
			<div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-950 dark:bg-gray-900">
				<Card className="p-8 bg-gray-800 rounded-lg shadow-lg w-96 dark:bg-gray-800">
					<h1 className="mb-6 text-3xl font-bold text-center text-white">Create Your Profile</h1>

					{/* Profile Picture */}
					<div
						className="mt-4 relative cursor-pointer"
						onClick={handleProfilePictureClick}
						style={{ display: "flex", justifyContent: "center" }}
					>
						{/* Default Colored Background */}
						<div
							className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
							style={{
								backgroundColor: profilePicture ? "transparent" : defaultColor,
							}}
						>
							{/* User Icon overlayed on colored background if no profile picture */}
							{!profilePicture && (
								<img src={UserIcon} alt="Default User Icon" className="w-10 h-10 opacity-80" />
							)}
						</div>
						{/* Display uploaded profile picture */}
						{profilePicture && (
							<img src={URL.createObjectURL(profilePicture)} alt="Profile" className="rounded-full w-20 h-20 mx-auto" />
						)}
					</div>

					{/* Hidden File Input */}
					<input
						type="file"
						onChange={handleProfilePictureUpload}
						ref={fileInputRef}
						className="hidden" // Hide the actual file input
					/>

					{/* Name Field */}
					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-300 text-center">Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="block w-full px-4 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							placeholder="Enter your name"
						/>
					</div>

					{/* Role Selection */}
					<div className="flex mt-6 w-full bg-gray-700 text-gray-300 rounded-md shadow-sm">
						<button
							type="button"
							onClick={() => setProfileType("Student")}
							className={`w-1/2 py-2 font-semibold ${profileType === "Student" ? "bg-indigo-600 text-white" : ""}`}
						>
							Student
						</button>
						<div className="w-px bg-gray-500"></div>
						<button
							type="button"
							onClick={() => setProfileType("Professor")}
							className={`w-1/2 py-2 font-semibold ${profileType === "Professor" ? "bg-indigo-600 text-white" : ""}`}
						>
							Professor
						</button>
					</div>

					{/* Continue Button */}
					<button
						type="button"
						onClick={handleContinue}
						className="w-full px-4 py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
					>
						Continue to Dashboard
					</button>
				</Card>
			</div>
		</>
	);
}
