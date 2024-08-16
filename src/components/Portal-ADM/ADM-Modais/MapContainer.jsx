// import React, { useEffect, useRef } from "react";
// import { GoogleMap, useLoadScript } from "@react-google-maps/api";
// import "./MapContainer.css";

// const containerStyle = {
//     width: "400px",
//     height: "400px",
// };

// function MapContainer({ address }) {
//     const mapRef = useRef(null);

//     const { isLoaded, loadError } = useLoadScript({
//         googleMapsApiKey: process.env.REACT_APP_MAPS_API,
//     });

//     useEffect(() => {
//         if (isLoaded) {
//             const geocoder = new window.google.maps.Geocoder();
//             geocoder.geocode({ address }, (results, status) => {
//                 if (status === "OK" && results.length > 0) {
//                     const location = results[0].geometry.location;
//                     mapRef.current.panTo(location);
//                     new window.google.maps.Marker({
//                         position: location,
//                         map: mapRef.current,
//                     });
//                 }
//             });
//         }
//     }, [isLoaded, address]);

//     if (loadError) {
//         return <div>Erro ao carregar o mapa</div>;
//     }

//     if (!isLoaded) {
//         return <div>Carregando o mapa...</div>;
//     }

//     return (
//         <div>
//             <GoogleMap
//                 zoom={10}
//                 center={{ lat: 44, lng: -80 }}
//                 mapContainerStyle={containerStyle}
//                 onLoad={(map) => (mapRef.current = map)}
//             />
//         </div>
//     );
// }

// export default MapContainer;
