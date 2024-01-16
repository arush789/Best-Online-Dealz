import React from "react";
import MessengerCustomerChat from 'react-messenger-customer-chat';

export default function Contact() {
    return (
        <div className="contact-div">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-para">
                Should you have any questions about the site, advertising, or any other concerns,
                feel free to get in touch with us at help.bestonlinedealz@gmail.com
            </p>
            <iframe
                src="https://www.chatbase.co/chatbot-iframe/XTytznOBwCjf5q3A9EUEr"
                width="100%"
                style={{ height: 100, minHeight: 700 }}
                frameborder="0"
            ></iframe>
            <MessengerCustomerChat
                pageId="194040820465985"
                appId="694805529189611"
            />,
        </div>
    )
}