const kakaoKey = import.meta.env.VITE_KAKAO_API_KEY;

const script = document.createElement('script');
script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
document.head.appendChild(script);

script.onload = () => {
  kakao.maps.load(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(lat, lon),
        level: 3,
      };
      const map = new kakao.maps.Map(container, options);

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lon),
      });
      marker.setMap(map);
    });
  });
};
