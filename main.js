const kakaoKey = import.meta.env.VITE_KAKAO_API_KEY;

const script = document.createElement("script");
script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&libraries=services&autoload=false`;
document.head.appendChild(script);

script.onload = () => {
  kakao.maps.load(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(lat, lon),
          level: 3,
        };
        const map = new kakao.maps.Map(container, options);

        // ⭐ 내 위치 마커 아이콘 설정
        const myIcon = new kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new kakao.maps.Size(24, 35)
        );

        // 📍 내 위치 마커
        const myMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(lat, lon),
          image: myIcon,
          map: map,
          title: "내 위치"
        });

        // 🍽️ 음식점 검색
        const ps = new kakao.maps.services.Places();

        ps.keywordSearch(
          "음식점",
          (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const infoDiv = document.getElementById("info");

              for (let i = 0; i < data.length; i++) {
                const place = data[i];

                const marker = new kakao.maps.Marker({
                  map: map,
                  position: new kakao.maps.LatLng(place.y, place.x),
                  title: place.place_name
                });

                const infowindow = new kakao.maps.InfoWindow({
                  content: `<div style="padding:5px;font-size:14px;">${place.place_name}</div>`,
                });

                // 🖱️ 마우스 오버 시 가게 이름 보여줌
                kakao.maps.event.addListener(marker, "mouseover", () => {
                  infowindow.open(map, marker);
                });

                kakao.maps.event.addListener(marker, "mouseout", () => {
                  infowindow.close();
                });

                // ✅ 클릭 시 상세 정보 하단에 표시
                kakao.maps.event.addListener(marker, "click", () => {
                  infoDiv.innerHTML = `
                    <strong style="font-size:17px;">${place.place_name}</strong><br>
                    📍 주소: ${place.road_address_name || place.address_name}<br>
                    📞 전화번호: ${place.phone || "없음"}
                  `;
                });
              }
            } else {
              console.warn("장소 검색 실패:", status);
            }
          },
          {
            location: new kakao.maps.LatLng(lat, lon),
            radius: 1000, // 반경 1km
          }
        );
      },
      (err) => {
        console.error("위치 정보 오류:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};
