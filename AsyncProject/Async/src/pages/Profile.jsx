import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/card";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Logo from "/assets/app-logo.svg";
import UserIcon from "/assets/user.svg";

export default function Profile() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [profileType, setProfileType] = useState(""); // Static, cannot change
	const [profilePicture, setProfilePicture] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [defaultColor, setDefaultColor] = useState("");
	const fileInputRef = useRef(null);

	// Fetch the user data on load
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userId = auth.currentUser?.uid;
				const userDoc = await getDoc(doc(db, "users", userId));

				if (userDoc.exists()) {
					const userData = userDoc.data();
					setName(userData.name);
					setProfileType(userData.role);
					setProfilePicture(userData.profilePictureUrl);
				} else {
					console.log("No such document!");
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};
		fetchUserData();
	}, []);

	useEffect(() => {
		const colors = ["#FFD700", "#8A2BE2", "#DC143C", "#20B2AA"];
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		setDefaultColor(randomColor);
	}, []);

	const handleProfilePictureUpload = async (e) => {
		const file = e.target.files[0];
		if (file) {
			try {
				const userId = auth.currentUser?.uid;
				const profilePicRef = ref(storage, `profilePictures/${userId}`);
				setUploading(true);
				await uploadBytes(profilePicRef, file);
				const profilePictureUrl = await getDownloadURL(profilePicRef);
				setProfilePicture(profilePictureUrl);

				await updateDoc(doc(db, "users", userId), { profilePictureUrl });
				setUploading(false);
			} catch (error) {
				console.error("Error uploading profile picture:", error);
			}
		}
	};

	const handleProfilePictureClick = () => {
		fileInputRef.current.click();
	};

	const handleNameChange = async (e) => {
		const newName = e.target.value;
		setName(newName);

		try {
			const userId = auth.currentUser?.uid;
			await updateDoc(doc(db, "users", userId), { name: newName });
		} catch (error) {
			console.error("Error updating name:", error);
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

			{/* Main Profile Container */}
			<div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-950 dark:bg-gray-900">
				<Card className="p-10 bg-gray-800 rounded-lg shadow-lg w-96 dark:bg-gray-800">
					<h1 className="mb-6 text-4xl font-bold text-center text-white">Your Profile</h1>

					{/* Profile Picture */}
					<div
						className="relative cursor-pointer flex justify-center mb-6"
						onClick={handleProfilePictureClick}
					>
						<div
							className="w-28 h-28 rounded-full flex items-center justify-center"
							style={{
								backgroundColor: profilePicture ? "transparent" : defaultColor,
							}}
						>
							{profilePicture ? (
								<img src={profilePicture} alt="Profile" className="rounded-full w-28 h-28" />
							) : (
								<img src={UserIcon} alt="Default User Icon" className="w-14 h-14 opacity-80" />
							)}
						</div>
						{uploading && (
							<p className="absolute text-xs text-gray-400 mt-2">Uploading...</p>
						)}
					</div>

					<input
						type="file"
						ref={fileInputRef}
						onChange={handleProfilePictureUpload}
						className="hidden"
					/>

					{/* Display Name */}
					<div className="text-center mt-4">
						<label className="block text-sm font-medium text-gray-300">Name</label>
						<input
							type="text"
							value={name}
							onChange={handleNameChange}
							className="block w-full px-4 py-2 mt-1 text-center text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							placeholder="Your name"
						/>
					</div>

					{/* Profile Type */}
					<div className="text-center mt-6">
						<span className="text-sm font-medium text-gray-300">Role</span>
						<p className="text-lg font-semibold text-indigo-500">{profileType}</p>
					</div>

					<button
						onClick={() => navigate("/main")}
						className="w-full px-4 py-2 mt-8 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
					>
						Go to Dashboard
					</button>
				</Card>
			</div>
		</>
	);
}
