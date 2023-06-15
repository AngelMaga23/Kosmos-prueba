import { useEffect, useState } from "react";



const useFetchimages = () => {

    const [images, setImages] = useState([]);

    useEffect(() => {
        // Realizar la solicitud a la API para obtener las imágenes
        fetch("https://jsonplaceholder.typicode.com/photos")
          .then((response) => response.json())
          .then((data) => {
            setImages(data);
          })
          .catch((error) => {
            console.error("Error fetching images:", error);
            setImages([]);
          });
      }, []);



    return {images}

}

export default useFetchimages;