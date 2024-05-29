import React, { useState } from "react";
import { settings } from "../../utils/tools";
import { Button,  Flex, Image,  Typography } from "antd";
import { HomeOutlined, LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const Header = () => {
	const { link_btn_color, link_btn_bg, header_bg, notification_bg } = settings;
    const location = useLocation();
	const [notification, setNotification] = useState(
		'"Hire an attitude, not just experience and qualification." Greg Savage🚀'
	);

	
	return (
		<>
			{notification && (
				<div
					id="notification-banner"
					style={{ background: `${notification_bg}` }}
					className={`position-relative custom-banner banner ${
						!notification_bg && "bg-success"
					}  text-center p-2`}
				>
					<div
						className="fs-7 banner-content text-light"
						style={{ paddingRight: "50px", paddingLeft: "50px" }}
					>
						{notification}
					</div>
					<button
						onClick={() => setNotification("")}
						id="remove-n-btn"
						style={{
							position: "absolute",
							right: 0,
							margin: "3px",
							height: "calc(100% - 16px)",
						}}
						className="remove-notification text-light p-0 top-0 mx-2 fs-6 px-2 outline-0 bg-transparent border-0"
					>
						<i className="bi bi-x-circle"></i>
					</button>
				</div>
			)}
			<header
				className="header-bar mb-auto mb-3"
				style={{ background: header_bg }}
			>
				 <div className="container h-100 p-3 py-2 mx-auto">
				<Flex className="governify-header-major-div"> 
					<div className="governify-header-major-div-logo">
					<Image width={215} height={80} src="/ProductsLogo.png"/>
					</div>
					<div className="governify-header-major-div-buttons">
					<Typography><span className='onboardify-welcome'>Welcome</span>{" "} <span className='onboardify-welcome-text-hani'>Hani</span></Typography>
					<div className="governify-header-buttons">
						{location.pathname === '/track-request' ? <Button className="governify-secondary-btn border-radius-10" style={{display:'flex' , gap:'5px' , alignItems:'center' }}><span className='font-family-montse fs-12 fw-700'>Home</span><HomeOutlined className="fs_20 fw-700"/></Button>
:<Button  className="governify-secondary-btn fs_12 fw-700 border-radius-10" style={{display:'flex' , gap:'5px' , alignItems:'center' }}><span className='font-family-montse fs-12 fw-700'>Track a Request</span><SearchOutlined  className="fs_20 fw-700"/></Button>
}
					<Button type="primaary" className="governify-primary-btn border-radius-10" style={{display:'flex' , gap:'5px' , alignItems:'center' , background:link_btn_bg , color:link_btn_color}}><span className='font-family-montse fs-12 fw-700'>Log out</span><LogoutOutlined  className='fs_20'/></Button>	
					</div>
					</div>
				</Flex>
				</div>


			</header>
		</>
	);
};

export default Header;
