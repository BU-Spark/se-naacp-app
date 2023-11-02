import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./Callback.css";

export default function Callback() {
	return (
		<div className='Callback'>
			<Box
				sx={{
					display: "flex",
					width: "5em",
					height: "5em",
				}}
			>
				<CircularProgress
					style={{
						margin: "auto",
						height: "100%",
						width: "100%",
					}}
					className='Loading'
				/>
			</Box>
		</div>
	);
}
