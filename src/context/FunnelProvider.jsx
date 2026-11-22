import { useState } from "react";
import FunnelContext from "./FunnelContext";

export default function FunnelProvider({ children }) {

    const [funnels, setFunnels] = useState([
        {
            id: 1,
            campaign: "Luxury Apartment Campaign",
            propertyType: "Apartment",
            location: "Lekki",
            audience: "Diaspora Buyers",
            offer: "Free Inspection",
            status: "Completed"
        },

        {
            id: 2,
            campaign: "Investor Funnel",
            propertyType: "Land",
            location: "Abuja",
            audience: "Property Investors",
            offer: "Free Site Inspection",
            status: "Completed"
        },

        {
            id: 3,
            campaign: "Lekki Campaign",
            propertyType: "Duplex",
            location: "Lekki",
            audience: "Families",
            offer: "5% Discount",
            status: "Draft"
        },

        {
            id: 4,
            campaign: "Commercial Campaign",
            propertyType: "Office Space",
            location: "Victoria Island",
            audience: "Businesses",
            offer: "Free Consultation",
            status: "Completed"
        }
    ]);

 return (
    <FunnelContext.Provider
        value={{
            funnels,
            setFunnels
        }}
    >
        {children}
    </FunnelContext.Provider>
);
}