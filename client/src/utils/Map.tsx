import {MapContainer, Marker, Popup, TileLayer, useMapEvent} from "react-leaflet";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import coordinateDTO from "./coordinates.model";
import {useState} from "react";

let defaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [16, 37]
});
L.Marker.prototype.options.icon = defaultIcon;

export default function Map(props: mapProps) {

    const [coordinates, setCoordinates] = useState<coordinateDTO[]>(props.coordinates);

    return (
        <MapContainer
            center={[42.570073453813, 20.909179695881907]} zoom={8}
            style={{height: props.height}}>
            <TileLayer attribution="React Movies"
                       url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {props.readOnly ? null : <MapClick setCoordinates={coordinates => {
                setCoordinates([coordinates]);
                props.handleMapClick(coordinates);
            }}/>}
            {coordinates.map((coordinate, index) => <Marker key={index}
                                                            position={[coordinate.lat, coordinate.lng]}
            >
                {coordinate.name ? <Popup>
                    {coordinate.name}
                </Popup> : null}
            </Marker>)}
        </MapContainer>
    )
}

interface mapProps {
    height: string;
    coordinates: coordinateDTO[];
    readOnly: boolean

    handleMapClick(coordinates: coordinateDTO): void
}

Map.defaultProps = {
    height: '500px',
    readOnly: false,
    handleMapClick: () => {
    }
}

function MapClick(props: mapClickProps) {
    useMapEvent('click', eventArgs => {
        props.setCoordinates({lat: eventArgs.latlng.lat, lng: eventArgs.latlng.lng})
    })
    return null;
}

interface mapClickProps {
    setCoordinates(coordinates: coordinateDTO): void;
}

