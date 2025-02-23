const MAX_SIZE = 16

function previewImage() {
    const fileInput = document.getElementById('fileInput');
    const archivo = fileInput.files[0]; // Obtener el archivo seleccionado
    if (archivo) {
        document.getElementById('fileInfo').innerText =
            `Has seleccionado: ${archivo.name} (${archivo.size} bytes)`;
    }
}

function preview(file) {
    const preview = document.getElementById('preview');

    const reader = new FileReader(); // Crear un lector de archivos
    reader.onload = (e) => {
        preview.src = e.target.result; // Establecer la imagen en el src
        preview.style.display = 'block'; // Mostrar la imagen
    };
    reader.readAsDataURL(file); // Leer el archivo como URL base64
}

function processImage(file) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
        // Configurar el canvas al tamaño de la imagen
        canvas.width = img.width;
        canvas.height = img.height;

        console.log("ANCHO imagen: ", img.width)
        console.log("ALTO imagen: ", img.height)

        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0);

        // Obtener los datos de la imagen en un array
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data; // Array RGBA

        console.log('Datos de la imagen como array: ', pixels);

        var arr = [] //El arreglo completo a predecir
        var arrAux = [] //Al llegar a MAX_SIZE posiciones se pone en 'arr' como un nuevo indice

        /*
            El array de píxeles (imageData.data) contiene los datos en bloques de 4 valores:
            R (Rojo)
            G (Verde)
            B (Azul)
            A (Alfa o transparencia)
        */
        for (let p = 0; p < pixels.length; p += 4) {
            var red = pixels[p] / 255; // normalizar a 0-1
            var green = pixels[p + 1] / 255; // normalizar a 0-1
            var blue = pixels[p + 2] / 255; // normalizar a 0-1
            arrAux.push([red, green, blue]); //Agregar al arrAux
            if (arrAux.length == MAX_SIZE) {
                arr.push(arrAux);
                arrAux = [];
            }
        }

        console.log('Datos del array a predecir: ', arr);

        predict(arr)
        //setTimeout(predict(arr), 150);
    };

    // Cargar la imagen seleccionada
    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function predict(arr) {
    let modelo = null;
    (async () => {
        console.log("Cargando modelo...");
        modelo = await tf.loadLayersModel("model.json");
        console.log("Modelo cargado...");
    })();

    //for(let i=0; i < 100000; i++);
    setTimeout(() => {
        arr = [arr]; //Meter el arreglo en otro arreglo por que si no tio tensorflow se enoja >:(
            //Nah basicamente Debe estar en un arreglo nuevo en el indice 0, por ser un tensor4d en forma 1, 150, 150, 1
            var tensor4 = tf.tensor4d(arr);
            var resultados = modelo.predict(tensor4).dataSync();
            var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados));
        
            var clases = ['Benigno', 'Maligno'];
            console.log("Prediccion", clases[mayorIndice]);
            document.getElementById("result").innerHTML = clases[mayorIndice];
    }, 5000);


}

function diagnosticar() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0]; // Obtener el archivo seleccionado

    if (file) {
        preview(file)
        //processImage(file)
    }
}