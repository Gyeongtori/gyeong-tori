import styled from 'styled-components';

export const containerStyle = {
	width: '100%',
	height: 'calc(100vh - 140px)',
};


export const Sample1 = [
    // { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
	// { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
	// { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },

    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#878787"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f9f5ed"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#aee0f4"
            }
        ]
    },

    // 장소 아이콘(마커) 없애기
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },

]
